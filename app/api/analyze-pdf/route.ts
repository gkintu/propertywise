import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import PDFParser from 'pdf2json'; 
import fs from 'fs';
import path from 'path';
import os from 'os';

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

    // Convert file to buffer for pdf2json processing
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    console.log('File buffer created, size:', fileBuffer.length);

    // Create pdf2json parser instance
    // Pass true as the second argument to enable raw text content extraction
    const pdfParser = new PDFParser(null, true);

    // Process PDF using pdf2json with Promise wrapper
    const pdfText = await new Promise<string>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('PDF parsing timed out'));
      }, 30000); // 30 second timeout

      pdfParser.on("pdfParser_dataError", (errData) => {
        clearTimeout(timeoutId);
        console.error('PDF parsing error:', errData.parserError);
        reject(new Error(`PDF parsing failed: ${errData.parserError}`));
      });

      pdfParser.on("pdfParser_dataReady", () => {
        clearTimeout(timeoutId);
        try {
          // Extract raw text content from parsed PDF
          const rawText = pdfParser.getRawTextContent();
          console.log('PDF text extracted successfully, length:', rawText.length);
          resolve(rawText);
        } catch (error) {
          console.error('Error extracting text from parsed PDF:', error);
          reject(new Error('Failed to extract text from parsed PDF'));
        }
      });

      // Parse the PDF buffer - use the correct method for buffer parsing
      try {
        // Convert buffer to a temporary file approach or use loadPDF with buffer
        // According to pdf2json docs, we need to use parseBuffer method properly
        if (typeof pdfParser.parseBuffer === 'function') {
          pdfParser.parseBuffer(fileBuffer);
        } else {
          // Alternative approach: write buffer to temp file
          const tempDir = os.tmpdir();
          const tempFile = path.join(tempDir, `temp_${Date.now()}.pdf`);
          
          fs.writeFileSync(tempFile, fileBuffer);
          pdfParser.loadPDF(tempFile);
          
          // Clean up temp file after parsing
          setTimeout(() => {
            try {
              fs.unlinkSync(tempFile);
            } catch (e) {
              console.log('Could not delete temp file:', e);
            }
          }, 5000);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error parsing PDF buffer:', error);
        reject(new Error('Failed to parse PDF buffer'));
      }
    });

    console.log('Extracted text length:', pdfText.length);

    if (!pdfText || pdfText.trim().length === 0) {
      console.log('No text extracted from PDF');
      return NextResponse.json({ error: 'Could not extract text from PDF, or PDF is empty.' }, { status: 400 });
    }

    // Stay within Gemma 3 27B's 96k token context window
    // Reserve ~16k tokens for system prompt and response, leaving ~80k tokens for input
    const maxLength = 320000; // ~80k tokens input, staying well within 96k context window
    const truncatedText = pdfText.length > maxLength ? pdfText.substring(0, maxLength) + "..." : pdfText;

    console.log('Sending text to AI (truncated length):', truncatedText.length);
    console.log('Requested language:', language);
    console.log('About to call Gemini API...');

    // Determine the language instruction for the AI prompt
    const languageInstruction = language === 'no' 
      ? 'Respond in Norwegian (Bokmål). All text fields including titles, descriptions, and the summary should be in Norwegian.'
      : 'Respond in English. All text fields should be in English.';

    const systemPrompt = `You are an AI assistant specialized in analyzing property reports. Given the text from a property document, extract key information and return it as a JSON object with the following structure:

{
  "propertyDetails": {
    "address": "Full property address",
    "bedrooms": number_of_bedrooms,
    "price": price_in_NOK,
    "size": size_in_square_meters,
    "yearBuilt": year_built,
    "propertyType": "apartment|house|condo"
  },
  "strongPoints": [
    {
      "title": "Brief title",
      "description": "Detailed description",
      "category": "kitchen|location|fees|outdoor|storage|condition|other"
    }
  ],
  "concerns": [
    {
      "title": "Brief title", 
      "description": "Detailed description",
      "severity": "low|medium|high",
      "estimatedCost": "10-50k NOK (optional)",
      "category": "electrical|structural|safety|pest|maintenance|age|other"
    }
  ],
  "bottomLine": "Overall recommendation and key points",
  "summary": "Brief overview of the property analysis"
}

LANGUAGE REQUIREMENT: ${languageInstruction}

IMPORTANT: 
- Return ONLY the JSON object, no markdown formatting, no code blocks, no extra text
- If you cannot extract structured data from the document, return {"error": "Unable to parse property data from document", "summary": "your analysis"}
- Focus on actionable insights for a potential buyer
- Ensure all JSON is valid and properly formatted
- All text content (titles, descriptions, summary, bottomLine) must be in the requested language`;

    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash-lite-preview-06-17',
      contents: `${systemPrompt}\n\nDocument text to analyze:\n${truncatedText}`,
      config: {
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

    // Try to parse as JSON first
    try {
      // Clean the AI response to handle common formatting issues
      let cleanedResponse = aiSummary.trim();
      
      // Remove markdown code blocks
      cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '').replace(/```\s*$/g, '');
      cleanedResponse = cleanedResponse.replace(/```\s*/g, '');
      
      // Remove leading/trailing quotes
      cleanedResponse = cleanedResponse.replace(/^["'`]+|["'`]+$/g, '');
      cleanedResponse = cleanedResponse.trim();
      
      // Try to find JSON in the response
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;
      
      const parsedAnalysis = JSON.parse(jsonString);
      console.log('Returning structured analysis response');
      return NextResponse.json({ analysis: parsedAnalysis });
    } catch {
      console.log('Failed to parse as JSON, returning as summary');
      // Fallback to original behavior if not valid JSON
      return NextResponse.json({ summary: aiSummary });
    }
  } catch (error) {
    console.error('Error in /api/analyze-pdf:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process file: ${errorMessage}` }, { status: 500 });
  }
}
