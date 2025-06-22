import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function GET() {
  // Simple test endpoint to check if API is working
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ 
      error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.',
      status: 'API key missing'
    }, { status: 500 });
  }

  return NextResponse.json({ 
    message: 'PDF Analysis API is working',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received');
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.log('Missing API key');
      return NextResponse.json({ 
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.' 
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const language = formData.get('language') as string || 'en';

    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'Invalid file type. Only PDFs are allowed.' }, { status: 400 });
    }

    console.log('Received file:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Convert file to buffer and create PDF part for Gemini
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    console.log('File buffer created, size:', fileBuffer.length);

    const pdfPart = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: file.type, // 'application/pdf'
      },
    };

    console.log('PDF part created for Gemini API');
    console.log('Requested language:', language);
    console.log('About to call Gemini API...');

    // STEP 1: Document Classification - Check if this is a property report
    console.log('Step 1: Classifying document type...');
    
    const documentClassificationSchema = {
      type: "object",
      properties: {
        documentType: {
          type: "string",
          enum: ["property_report", "not_property_report"],
          description: "Classification of the document type"
        },
        confidence: {
          type: "string",
          enum: ["high", "medium", "low"],
          description: "Confidence level of the classification"
        },
        reasoning: {
          type: "string",
          description: "Brief explanation of why this classification was chosen"
        }
      },
      required: ["documentType", "confidence", "reasoning"]
    };

    const classificationPrompt = language === 'no'
      ? `Du er en AI-assistent som spesialiserer seg på å klassifisere dokumenter. Analyser det vedlagte PDF-dokumentet og bestem om det er en eiendomsrapport/boligrapport eller ikke.

En eiendomsrapport inneholder vanligvis informasjon som:
- Eiendomsadresse og beskrivelse
- Pris og størrelse (kvadratmeter)
- Byggeår og eiendomstype
- Teknisk tilstand og utfordringer
- Bilder av eiendommen
- Energimerking eller tilstandsrapport
- Informasjon om sameie/fellesutgifter

Klassifiser dokumentet som "property_report" bare hvis det tydelig er en norsk eiendomsrapport, boligannonse, eller lignende eiendomsdokument. Hvis dokumentet er noe annet (fakturaer, kontrakter, brukermanualer, etc.), klassifiser det som "not_property_report".

Svar på norsk i reasoning-feltet.`
      : `You are an AI assistant specialized in document classification. Analyze the attached PDF document and determine if it is a property report or not.

A property report typically contains information such as:
- Property address and description
- Price and size (square meters)
- Year built and property type
- Technical condition and issues
- Property photos
- Energy rating or condition reports
- Information about fees/maintenance costs

Classify the document as "property_report" only if it clearly appears to be a property report, real estate listing, or similar property-related document. If the document is something else (invoices, contracts, manuals, etc.), classify it as "not_property_report".

Respond in English in the reasoning field.`;

    try {
      const classificationResponse = await genai.models.generateContent({
        model: 'gemini-2.5-flash-lite-preview-06-17',
        contents: [
          { text: classificationPrompt },
          pdfPart
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: documentClassificationSchema,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });

      const classificationText = classificationResponse.text;
      if (!classificationText) {
        throw new Error('Classification failed to generate response');
      }
      const classificationResult = JSON.parse(classificationText);
      console.log('Classification result:', classificationResult);

      // If document is not a property report, return specific error
      if (classificationResult.documentType === 'not_property_report') {
        const errorMessage = language === 'no'
          ? 'Dette ser ikke ut til å være en eiendomsrapport. Vennligst last opp riktig dokument.'
          : 'This does not appear to be a property report. Please upload the correct document.';
        
        return NextResponse.json({ 
          error: errorMessage,
          errorType: 'invalid_document_type',
          classification: classificationResult
        }, { status: 400 });
      }

      // If confidence is low, warn but proceed
      if (classificationResult.confidence === 'low') {
        console.log('Low confidence classification - proceeding with caution');
      }

    } catch (classificationError) {
      console.error('Error in document classification:', classificationError);
      // If classification fails, proceed with analysis (fallback behavior)
      console.log('Classification failed, proceeding with property analysis as fallback');
    }

    // STEP 2: Property Analysis - Proceed with detailed analysis
    console.log('Step 2: Performing detailed property analysis...');

    // Determine the language instruction for the AI prompt
    const languageInstruction = language === 'no' 
      ? 'Respond in Norwegian (Bokmål). All text fields including titles, descriptions, and the summary should be in Norwegian.'
      : 'Respond in English. All text fields should be in English.';

    // Define the structured output schema
    const propertyAnalysisSchema = {
      type: "object",
      properties: {
        propertyDetails: {
          type: "object",
          properties: {
            address: { type: "string", description: "Full property address" },
            bedrooms: { type: "number", description: "Number of bedrooms" },
            price: { type: "number", description: "Price in NOK" },
            size: { type: "number", description: "Size in square meters" },
            yearBuilt: { type: "number", description: "Year the property was built" },
            propertyType: { 
              type: "string", 
              enum: ["apartment", "house", "condo"],
              description: "Type of property" 
            }
          },
          required: ["address", "propertyType"],
          propertyOrdering: ["address", "bedrooms", "price", "size", "yearBuilt", "propertyType"]
        },
        strongPoints: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Brief title of the strong point" },
              description: { type: "string", description: "Detailed description" },
              category: { 
                type: "string", 
                enum: ["kitchen", "location", "fees", "outdoor", "storage", "condition", "other"],
                description: "Category of the strong point"
              }
            },
            required: ["title", "description", "category"],
            propertyOrdering: ["title", "description", "category"]
          }
        },
        concerns: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Brief title of the concern" },
              description: { type: "string", description: "Detailed description" },
              severity: { 
                type: "string", 
                enum: ["low", "medium", "high"],
                description: "Severity level of the concern"
              },
              estimatedCost: { type: "string", description: "Estimated cost to address (optional)" },
              category: { 
                type: "string", 
                enum: ["electrical", "structural", "safety", "pest", "maintenance", "age", "other"],
                description: "Category of the concern"
              }
            },
            required: ["title", "description", "severity", "category"],
            propertyOrdering: ["title", "description", "severity", "estimatedCost", "category"]
          }
        },
        bottomLine: { type: "string", description: "Overall recommendation and key points" },
        summary: { type: "string", description: "Brief overview of the property analysis" }
      },
      required: ["propertyDetails", "strongPoints", "concerns", "bottomLine", "summary"],
      propertyOrdering: ["propertyDetails", "strongPoints", "concerns", "bottomLine", "summary"]
    };

    const systemPrompt = `You are an AI assistant specialized in analyzing property reports. Given the attached PDF property document, extract key information and provide structured analysis.

${languageInstruction}

Focus on actionable insights for a potential buyer. If you cannot extract structured data from the document, provide a brief summary in the summary field.`;

    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash-lite-preview-06-17',
      contents: [
        { text: systemPrompt },
        pdfPart
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: propertyAnalysisSchema,
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking for faster response
        },
      },
    });

    console.log('Gemini API response received');
    const aiSummary = response.text;

    if (!aiSummary) {
      console.log('AI failed to generate summary');
      return NextResponse.json({ error: 'AI failed to generate a summary.' }, { status: 500 });
    }

    // With responseSchema, the output is guaranteed to be valid JSON
    console.log('Parsing structured response');
    const parsedAnalysis = JSON.parse(aiSummary);
    
    // Validate that we got meaningful property data
    if (!parsedAnalysis.propertyDetails || !parsedAnalysis.propertyDetails.address) {
      const errorMessage = language === 'no'
        ? 'Kunne ikke finne eiendomsinformasjon i dokumentet. Vennligst sjekk at dokumentet inneholder eiendomsdetaljer.'
        : 'Could not find property information in the document. Please ensure the document contains property details.';
      
      return NextResponse.json({ 
        error: errorMessage,
        errorType: 'insufficient_property_data',
        partialAnalysis: parsedAnalysis
      }, { status: 400 });
    }
    
    console.log('Returning structured analysis response');
    return NextResponse.json({ analysis: parsedAnalysis });
  } catch (error) {
    console.error('Error in /api/analyze-pdf:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Handle specific error types
    if (error instanceof Error) {
      // Check if it's a classification or validation error that we should pass through
      if (error.message.includes('Classification failed') || 
          error.message.includes('insufficient_property_data') ||
          error.message.includes('invalid_document_type')) {
        return NextResponse.json({ 
          error: error.message,
          errorType: 'classification_error'
        }, { status: 400 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: `Failed to process file: ${errorMessage}`,
      errorType: 'processing_error'
    }, { status: 500 });
  }
}
