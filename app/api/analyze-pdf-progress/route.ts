import { NextRequest } from "next/server";
import { del } from "@vercel/blob";
import { GoogleGenAI } from "@google/genai";
import { AnalyzePdfFromBlobSchema } from "@/lib/validation";
import { getTranslations } from "next-intl/server";

// Demo file blob URLs that should never be deleted
const DEMO_FILE_BLOB_IDENTIFIERS = [
  'demo-alv-johnsens-vei-1',
  'demo-bolette-brygge-5', 
  'demo-sanengveien-1'
];

const isDemoFileBlob = (blobUrl: string): boolean => {
  return DEMO_FILE_BLOB_IDENTIFIERS.some(identifier => blobUrl.includes(identifier));
};

// Initialize Gemini client
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

interface ProgressEvent {
  type: 'progress' | 'stage' | 'complete' | 'error' | 'heartbeat';
  progress: number;
  stage: string;
  message?: string;
  data?: unknown;
  timestamp?: number;
  estimatedTimeRemaining?: number;
}

function createProgressEvent(event: ProgressEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const blobUrl = searchParams.get('blobUrl');
  const languageParam = searchParams.get('language') || 'en';
  
  let blobUrlToDelete: string | undefined = blobUrl || undefined;

  // Create a readable stream for Server-Sent Events
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const sendProgress = (event: ProgressEvent) => {
        controller.enqueue(encoder.encode(createProgressEvent(event)));
      };

      const processAnalysis = async () => {
        const startTime = Date.now();
        let heartbeatInterval: NodeJS.Timeout | undefined;
        let currentProgress = 0;
        let currentStage = '';
        
        // Enhanced progress sender with heartbeat
        const sendProgressWithHeartbeat = (event: ProgressEvent) => {
          event.timestamp = Date.now();
          currentProgress = event.progress;
          currentStage = event.stage;
          
          // Calculate estimated time remaining based on progress velocity
          if (event.progress > 0 && event.progress < 100) {
            const elapsed = Date.now() - startTime;
            const rate = event.progress / elapsed;
            const remaining = (100 - event.progress) / rate;
            event.estimatedTimeRemaining = Math.round(remaining / 1000); // in seconds
          }
          
          controller.enqueue(encoder.encode(createProgressEvent(event)));
        };
        
        // Start heartbeat to prevent connection timeout
        const startHeartbeat = () => {
          heartbeatInterval = setInterval(() => {
            controller.enqueue(encoder.encode(createProgressEvent({
              type: 'heartbeat',
              progress: currentProgress,
              stage: currentStage,
              message: 'Processing...'
            })));
          }, 3000); // Every 3 seconds
        };
        
        const stopHeartbeat = () => {
          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = undefined;
          }
        };
        
        try {
          startHeartbeat();
          // Get translations for the specified language
          const t = await getTranslations({ locale: languageParam, namespace: 'HomePage.upload' });

          // Check if Gemini API key is configured
          if (!process.env.GEMINI_API_KEY) {
            sendProgress({
              type: 'error',
              progress: 0,
              stage: 'Configuration Error',
              message: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.'
            });
            controller.close();
            return;
          }

          sendProgressWithHeartbeat({
            type: 'stage',
            progress: 5,
            stage: t('progressStages.extractingDetails'),
            message: ''
          });
          
          // Gradual progress increase during setup
          await new Promise(resolve => setTimeout(resolve, 100));
          sendProgressWithHeartbeat({ type: 'progress', progress: 8, stage: t('progressStages.extractingDetails'), message: '' });
          
          await new Promise(resolve => setTimeout(resolve, 100));
          sendProgressWithHeartbeat({ type: 'progress', progress: 12, stage: t('progressStages.extractingDetails'), message: '' });

          // Validate required parameters
          if (!blobUrl) {
            stopHeartbeat();
            sendProgressWithHeartbeat({
              type: 'error',
              progress: 0,
              stage: 'Validation Error',
              message: 'Blob URL is required'
            });
            controller.close();
            return;
          }

          // Validate parameters
          const language = languageParam as "en" | "no";
          const validationData = { blobUrl, language };
          const validationResult = AnalyzePdfFromBlobSchema.safeParse(validationData);

          if (!validationResult.success) {
            stopHeartbeat();
            sendProgressWithHeartbeat({
              type: 'error',
              progress: 0,
              stage: 'Validation Error',
              message: 'Invalid request data'
            });
            controller.close();
            return;
          }
          
          sendProgressWithHeartbeat({ type: 'progress', progress: 15, stage: t('progressStages.extractingDetails'), message: 'Validating document...' });

          const { blobUrl: validatedBlobUrl, language: validatedLanguage } = validationResult.data;
          blobUrlToDelete = validatedBlobUrl;

          // Validate blob URL format
          if (!validatedBlobUrl.includes('blob.vercel-storage.com')) {
            stopHeartbeat();
            sendProgressWithHeartbeat({
              type: 'error',
              progress: 15,
              stage: 'Invalid Blob URL',
              message: 'Invalid blob URL format'
            });
            controller.close();
            return;
          }
          
          sendProgressWithHeartbeat({ type: 'progress', progress: 18, stage: t('progressStages.extractingDetails'), message: 'Preparing to fetch document...' });

          // Fetch the PDF from the blob URL with retry logic
          let blobResponse: Response | undefined;
          let retryCount = 0;
          const maxRetries = 5;
          
          sendProgressWithHeartbeat({ type: 'progress', progress: 20, stage: t('progressStages.extractingDetails'), message: 'Downloading document...' });
          
          while (retryCount <= maxRetries) {
            blobResponse = await fetch(validatedBlobUrl);
            
            if (blobResponse.ok) {
              break;
            }
            
            if (blobResponse.status === 404 && retryCount < maxRetries) {
              const retryDelay = 500 * Math.pow(2, retryCount);
              sendProgressWithHeartbeat({ 
                type: 'progress', 
                progress: 20 + (retryCount * 2), 
                stage: t('progressStages.extractingDetails'), 
                message: `Retrying document fetch... (${retryCount + 1}/${maxRetries})` 
              });
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              retryCount++;
            } else {
              stopHeartbeat();
              sendProgressWithHeartbeat({
                type: 'error',
                progress: 20,
                stage: 'Document Fetch Error',
                message: `Failed to fetch PDF: ${blobResponse.statusText}`
              });
              controller.close();
              return;
            }
          }

          if (!blobResponse || !blobResponse.ok) {
            stopHeartbeat();
            sendProgressWithHeartbeat({
              type: 'error',
              progress: 25,
              stage: 'Document Fetch Error',
              message: 'Failed to fetch PDF after all retries'
            });
            controller.close();
            return;
          }
          
          sendProgressWithHeartbeat({ type: 'progress', progress: 30, stage: t('progressStages.extractingDetails'), message: 'Processing document content...' });

          const fileBuffer = Buffer.from(await blobResponse.arrayBuffer());
          sendProgressWithHeartbeat({ type: 'progress', progress: 32, stage: t('progressStages.extractingDetails'), message: 'Converting document format...' });
          
          const pdfPart = {
            inlineData: {
              data: fileBuffer.toString("base64"),
              mimeType: "application/pdf",
            },
          };
          
          sendProgressWithHeartbeat({ type: 'progress', progress: 35, stage: t('progressStages.extractingDetails'), message: 'Starting document analysis...' });

          // STEP 1: Document Classification
          const documentClassificationSchema = {
            type: "object",
            properties: {
              documentType: {
                type: "string",
                enum: ["property_report", "not_property_report"],
              },
              confidence: { type: "string", enum: ["high", "medium", "low"] },
              reasoning: { type: "string" },
            },
            required: ["documentType", "confidence", "reasoning"],
          };

          const classificationPrompt = validatedLanguage === "no"
            ? `Du er en AI-assistent som spesialiserer seg på å klassifisere dokumenter. Analyser det vedlagte PDF-dokumentet og bestem om det er en eiendomsrapport/boligrapport eller ikke. Klassifiser dokumentet som "property_report" bare hvis det tydelig er en norsk eiendomsrapport. Ellers, klassifiser det som "not_property_report". Svar på norsk i reasoning-feltet.`
            : `You are an AI assistant specialized in document classification. Analyze the attached PDF document and determine if it is a property report or not. Classify the document as "property_report" only if it is clearly a property report. Otherwise, classify it as "not_property_report". Respond in English in the reasoning field.`;

          try {
            sendProgressWithHeartbeat({ type: 'progress', progress: 38, stage: t('progressStages.extractingDetails'), message: 'Analyzing document type...' });
            
            const classificationResponse = await genai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: [{ text: classificationPrompt }, pdfPart],
              config: {
                responseMimeType: "application/json",
                responseSchema: documentClassificationSchema,
              },
            });

            const responseText = classificationResponse.text;
            if (!responseText) {
              stopHeartbeat();
              sendProgressWithHeartbeat({
                type: 'error',
                progress: 40,
                stage: 'Classification Failed',
                message: 'Failed to classify document - no response from AI'
              });
              controller.close();
              return;
            }
            
            sendProgressWithHeartbeat({ type: 'progress', progress: 42, stage: t('progressStages.extractingDetails'), message: 'Validating document type...' });

            const classificationResult = JSON.parse(responseText);
            if (classificationResult.documentType === "not_property_report") {
              const errorMessage = validatedLanguage === "no"
                ? "Dette ser ikke ut til å være en eiendomsrapport. Vennligst last opp riktig dokument."
                : "This does not appear to be a property report. Please upload the correct document.";
              
              stopHeartbeat();
              sendProgressWithHeartbeat({
                type: 'error',
                progress: 42,
                stage: 'Invalid Document Type',
                message: errorMessage
              });
              controller.close();
              return;
            }

            sendProgressWithHeartbeat({
              type: 'stage',
              progress: 45,
              stage: t('progressStages.analyzingPrice'),
              message: 'Document type verified'
            });

          } catch (classificationError) {
            console.error("Error in document classification:", classificationError);
            // Continue with analysis even if classification fails
            sendProgressWithHeartbeat({
              type: 'stage',
              progress: 45,
              stage: t('progressStages.analyzingPrice'),
              message: 'Proceeding with analysis'
            });
          }

          // Gradual progress during property analysis setup
          sendProgressWithHeartbeat({ type: 'progress', progress: 50, stage: t('progressStages.analyzingPrice'), message: 'Preparing analysis engine...' });
          await new Promise(resolve => setTimeout(resolve, 200));
          
          sendProgressWithHeartbeat({ type: 'progress', progress: 55, stage: t('progressStages.analyzingPrice'), message: 'Extracting property details...' });
          await new Promise(resolve => setTimeout(resolve, 200));
          
          sendProgressWithHeartbeat({
            type: 'stage',
            progress: 60,
            stage: t('progressStages.checkingRisks'),
            message: 'Analyzing property features...'
          });
          
          await new Promise(resolve => setTimeout(resolve, 200));
          sendProgressWithHeartbeat({ type: 'progress', progress: 65, stage: t('progressStages.checkingRisks'), message: 'Evaluating potential risks...' });

          // STEP 2: Property Analysis  
          const languageInstruction = validatedLanguage === "no"
            ? "Respond in Norwegian (Bokmål). All text fields including titles, descriptions, and the summary should be in Norwegian."
            : "Respond in English. All text fields should be in English.";

          const propertyAnalysisSchema = {
            type: "object",
            properties: {
              propertyDetails: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  bedrooms: { type: "number" },
                  price: { type: "number" },
                  size: { type: "number" },
                  yearBuilt: { type: "number" },
                  propertyType: {
                    type: "string",
                    enum: ["apartment", "house", "condo"],
                  },
                },
                required: ["address", "propertyType"],
              },
              strongPoints: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    category: {
                      type: "string",
                      enum: [
                        "kitchen",
                        "location",
                        "fees",
                        "outdoor",
                        "storage",
                        "condition",
                        "other",
                      ],
                    },
                  },
                  required: ["title", "description", "category"],
                },
              },
              concerns: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] },
                    estimatedCost: { type: "string" },
                    category: {
                      type: "string",
                      enum: [
                        "electrical",
                        "structural",
                        "safety",
                        "pest",
                        "maintenance",
                        "age",
                        "other",
                      ],
                    },
                  },
                  required: ["title", "description", "severity", "category"],
                },
              },
              hiddenDefects: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: {
                      type: "string",
                      enum: [
                        "shared_debt",
                        "legal_deficiencies", 
                        "moisture_water_damage",
                        "rot_fungus_pests",
                        "electrical_faults",
                        "drainage_leaks",
                        "roof_structural_issues",
                        "environmental_hazards"
                      ],
                    },
                    riskLevel: { type: "string", enum: ["low", "medium", "high"] },
                    briefExplanation: { type: "string" },
                    consequences: { type: "string" },
                    preventiveMeasures: { type: "string" },
                    actionRequired: { type: "string" },
                  },
                  required: ["category", "riskLevel", "briefExplanation", "consequences", "preventiveMeasures"],
                },
              },
              bottomLine: { type: "string" },
              summary: { type: "string" },
            },
            required: [
              "propertyDetails",
              "strongPoints",
              "concerns",
              "hiddenDefects",
              "bottomLine",
              "summary",
            ],
          };

          const systemPrompt = `You are an AI assistant specialized in analyzing property reports. Given the attached PDF property document, extract key information and provide structured analysis.

${languageInstruction}

Focus on actionable insights for a potential buyer. If you cannot extract structured data from the document, provide a brief summary in the summary field.

For the hiddenDefects section, analyze the document for potential hidden issues that buyers should be aware of. ONLY include categories where you find actual risks, concerns, or relevant information in the document. Do not include categories just because they exist in the schema - only include them if there are genuine findings to report.

Available categories to assess (only include if relevant findings exist):
- shared_debt: Financial obligations shared with other owners
- legal_deficiencies: Permits, zoning violations, or legal compliance issues  
- moisture_water_damage: Water damage, leaks, or moisture problems
- rot_fungus_pests: Structural damage from biological causes
- electrical_faults: Electrical system issues or code violations
- drainage_leaks: Plumbing, drainage, or water system problems
- roof_structural_issues: Roof damage, leaks, structural problems, or aging materials
- environmental_hazards: Asbestos, lead, PCBs, or other toxic materials

For each identified defect category that has actual findings, provide:
- briefExplanation: A short summary of what was specifically found in the document (e.g., "Page 17 mentions expected increase in maintenance costs", "Document shows moisture damage in basement area")
- riskLevel: low/medium/high based on document findings
- consequences: Brief description of potential impact (financial, health, structural)
- preventiveMeasures: What buyers should do before purchase (inspection, expert consultation, etc.)
- actionRequired: Specific recommended actions if defect is suspected/confirmed

If no hidden defects are found or mentioned in the document, return an empty array for hiddenDefects.`;

          sendProgressWithHeartbeat({
            type: 'progress',
            progress: 72,
            stage: t('progressStages.checkingRisks'),
            message: 'Sending analysis request...'
          });
          
          // Progress during AI analysis
          const aiAnalysisInterval = setInterval(() => {
            if (currentProgress < 82) {
              sendProgressWithHeartbeat({
                type: 'progress',
                progress: currentProgress + 2,
                stage: t('progressStages.checkingRisks'),
                message: 'AI analyzing document contents...'
              });
            }
          }, 1500);
          
          const response = await genai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: systemPrompt }, pdfPart],
            config: {
              responseMimeType: "application/json",
              responseSchema: propertyAnalysisSchema,
            },
          });
          
          clearInterval(aiAnalysisInterval);
          
          sendProgressWithHeartbeat({
            type: 'stage',
            progress: 85,
            stage: t('progressStages.finalizing'),
            message: 'Processing analysis results...'
          });

          // Skip this progress update to avoid too many stages

          const aiSummary = response.text;
          if (!aiSummary) {
            stopHeartbeat();
            sendProgressWithHeartbeat({
              type: 'error',
              progress: 88,
              stage: 'Analysis Failed',
              message: 'AI failed to generate a summary'
            });
            controller.close();
            return;
          }
          
          sendProgressWithHeartbeat({ type: 'progress', progress: 90, stage: t('progressStages.finalizing'), message: 'Parsing analysis results...' });

          const parsedAnalysis = JSON.parse(aiSummary);
          if (!parsedAnalysis.propertyDetails || !parsedAnalysis.propertyDetails.address) {
            const errorMessage = languageParam === "no"
              ? "Kunne ikke finne eiendomsinformasjon i dokumentet. Vennligst sjekk at dokumentet inneholder eiendomsdetaljer."
              : "Could not find property information in the document. Please ensure the document contains property details.";
            
            stopHeartbeat();
            sendProgressWithHeartbeat({
              type: 'error',
              progress: 92,
              stage: 'Insufficient Data',
              message: errorMessage
            });
            controller.close();
            return;
          }

          sendProgressWithHeartbeat({ type: 'progress', progress: 95, stage: t('progressStages.finalizing'), message: 'Preparing final results...' });
          await new Promise(resolve => setTimeout(resolve, 300));
          
          sendProgressWithHeartbeat({ type: 'progress', progress: 98, stage: t('progressStages.finalizing'), message: 'Finalizing analysis...' });
          await new Promise(resolve => setTimeout(resolve, 200));
          
          stopHeartbeat();
          sendProgressWithHeartbeat({
            type: 'complete',
            progress: 100,
            stage: t('progressStages.analysisComplete'),
            message: 'Analysis completed successfully',
            data: parsedAnalysis
          });

          controller.close();

        } catch (error) {
          console.error("Error in /api/analyze-pdf-progress:", error);
          
          stopHeartbeat();
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
          sendProgressWithHeartbeat({
            type: 'error',
            progress: Math.max(currentProgress, 0),
            stage: 'Processing Error',
            message: `Failed to process file: ${errorMessage}`
          });
          controller.close();
        } finally {
          stopHeartbeat();
          // Clean up blob if needed
          if (blobUrlToDelete && !isDemoFileBlob(blobUrlToDelete)) {
            try {
              console.log(`🗑️ Deleting blob: ${blobUrlToDelete}`);
              await del(blobUrlToDelete);
              console.log(`✅ Successfully deleted blob: ${blobUrlToDelete}`);
            } catch (deleteError) {
              console.error(`❌ Failed to delete blob ${blobUrlToDelete}:`, deleteError);
            }
          } else if (blobUrlToDelete) {
            console.log(`🛡️ Preserving demo file blob: ${blobUrlToDelete}`);
          }
        }
      };

      // Start the analysis process
      processAnalysis();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}