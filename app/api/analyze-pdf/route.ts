import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { GoogleGenAI } from "@google/genai";
import {
  AnalyzePdfRequestSchema,
  AnalyzePdfFromBlobSchema,
} from "@/lib/validation";
import { ZodError } from "zod";

// Initialize Gemini client
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function GET() {
  // Simple test endpoint to check if API is working
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.",
        status: "API key missing",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "PDF Analysis API is working",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  let blobUrlToDelete: string | undefined;

  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.",
        },
        { status: 500 }
      );
    }

    // Try to parse as JSON first (blob URL), then fall back to FormData (file upload)
    let pdfPart: {
      inlineData: {
        data: string;
        mimeType: string;
      };
    };
    let validatedLanguage: "en" | "no" = "en";

    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      // Handle blob URL request
      const body = await request.json();
      const validationResult = AnalyzePdfFromBlobSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "Invalid request data.",
            errorType: "validation_error",
            details: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const { blobUrl, language } = validationResult.data;
      blobUrlToDelete = blobUrl; // Set for deletion in finally block
      validatedLanguage = language;

      console.log("Received blob URL:", blobUrl);

      // Fetch the PDF from the blob URL
      const blobResponse = await fetch(blobUrl);
      if (!blobResponse.ok) {
        return NextResponse.json(
          {
            error: "Failed to fetch PDF from blob URL.",
            errorType: "blob_fetch_error",
          },
          { status: 400 }
        );
      }

      const fileBuffer = Buffer.from(await blobResponse.arrayBuffer());
      pdfPart = {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType: "application/pdf",
        },
      };
    } else {
      // Handle file upload request (legacy support)
      const formData = await request.formData();
      const file = formData.get("file");
      const language = formData.get("language");

      // Validate request using Zod
      const validationResult = AnalyzePdfRequestSchema.safeParse({
        file,
        language,
      });

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "Invalid request data.",
            errorType: "validation_error",
            details: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const { file: validatedFile, language: parsedLanguage } =
        validationResult.data;
      validatedLanguage = parsedLanguage;

      console.log(
        "Received file:",
        validatedFile.name,
        "Type:",
        validatedFile.type,
        "Size:",
        validatedFile.size
      );

      // Convert file to buffer and create PDF part for Gemini
      const fileBuffer = Buffer.from(await validatedFile.arrayBuffer());
      pdfPart = {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType: validatedFile.type,
        },
      };
    }

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

    const classificationPrompt =
      validatedLanguage === "no"
        ? `Du er en AI-assistent som spesialiserer seg på å klassifisere dokumenter. Analyser det vedlagte PDF-dokumentet og bestem om det er en eiendomsrapport/boligrapport eller ikke. Klassifiser dokumentet som "property_report" bare hvis det tydelig er en norsk eiendomsrapport. Ellers, klassifiser det som "not_property_report". Svar på norsk i reasoning-feltet.`
        : `You are an AI assistant specialized in document classification. Analyze the attached PDF document and determine if it is a property report or not. Classify the document as "property_report" only if it is clearly a property report. Otherwise, classify it as "not_property_report". Respond in English in the reasoning field.`;

    try {
      const classificationResponse = await genai.models.generateContent({
        model: "gemini-2.5-flash-lite-preview-06-17",
        contents: [{ text: classificationPrompt }, pdfPart],
        config: {
          responseMimeType: "application/json",
          responseSchema: documentClassificationSchema,
        },
      });

      const responseText = classificationResponse.text;
      if (!responseText) {
        return NextResponse.json(
          {
            error: "Failed to classify document - no response from AI",
            errorType: "classification_failed",
          },
          { status: 500 }
        );
      }

      const classificationResult = JSON.parse(responseText);
      if (classificationResult.documentType === "not_property_report") {
        const errorMessage =
          validatedLanguage === "no"
            ? "Dette ser ikke ut til å være en eiendomsrapport. Vennligst last opp riktig dokument."
            : "This does not appear to be a property report. Please upload the correct document.";
        return NextResponse.json(
          {
            error: errorMessage,
            errorType: "invalid_document_type",
            classification: classificationResult,
          },
          { status: 400 }
        );
      }
    } catch (classificationError) {
      console.error("Error in document classification:", classificationError);
      console.log(
        "Classification failed, proceeding with property analysis as fallback",
      );
    }

    // STEP 2: Property Analysis
    const languageInstruction =
      validatedLanguage === "no"
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
        bottomLine: { type: "string" },
        summary: { type: "string" },
      },
      required: [
        "propertyDetails",
        "strongPoints",
        "concerns",
        "bottomLine",
        "summary",
      ],
    };

    const systemPrompt = `You are an AI assistant specialized in analyzing property reports. Given the attached PDF property document, extract key information and provide structured analysis.

${languageInstruction}

Focus on actionable insights for a potential buyer. If you cannot extract structured data from the document, provide a brief summary in the summary field.`;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: [{ text: systemPrompt }, pdfPart],
      config: {
        responseMimeType: "application/json",
        responseSchema: propertyAnalysisSchema,
      },
    });

    const aiSummary = response.text;
    if (!aiSummary) {
      return NextResponse.json(
        { error: "AI failed to generate a summary." },
        { status: 500 }
      );
    }

    const parsedAnalysis = JSON.parse(aiSummary);
    if (
      !parsedAnalysis.propertyDetails ||
      !parsedAnalysis.propertyDetails.address
    ) {
      const errorMessage =
        validatedLanguage === "no"
          ? "Kunne ikke finne eiendomsinformasjon i dokumentet. Vennligst sjekk at dokumentet inneholder eiendomsdetaljer."
          : "Could not find property information in the document. Please ensure the document contains property details.";
      return NextResponse.json(
        {
          error: errorMessage,
          errorType: "insufficient_property_data",
          partialAnalysis: parsedAnalysis,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(parsedAnalysis, { status: 200 });
  } catch (error) {
    console.error("Error in /api/analyze-pdf:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data.",
          errorType: "validation_error",
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: `Failed to process file: ${errorMessage}`,
        errorType: "processing_error",
      },
      { status: 500 }
    );
  } finally {
    if (blobUrlToDelete) {
      try {
        console.log(`🗑️ Deleting blob: ${blobUrlToDelete}`);
        await del(blobUrlToDelete);
        console.log(`✅ Successfully deleted blob: ${blobUrlToDelete}`);
      } catch (deleteError) {
        console.error(
          `❌ Failed to delete blob ${blobUrlToDelete}:`,
          deleteError,
        );
        // We don't re-throw here because the primary operation's response
        // has already been determined. This is a cleanup step.
      }
    }
  }
}
