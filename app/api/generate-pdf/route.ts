import { NextRequest, NextResponse } from "next/server";
import ReactPDF from "@react-pdf/renderer";
import React from "react";
import { AnalysisReportPDF } from "@/components/pdf/AnalysisReportPDF";
import { z } from "zod";

// Import translation files
import enMessages from "@/messages/en.json";
import noMessages from "@/messages/no.json";

// Set maximum duration for PDF generation
export const maxDuration = 60;

// Request validation schema
const requestSchema = z.object({
  analysisData: z.object({
    // Based on actual PropertyAnalysis interface
    propertyDetails: z.object({
      address: z.string(),
      bedrooms: z.number(),
      price: z.number(),
      currency: z.string().optional(),
      size: z.number(),
      yearBuilt: z.number(),
      propertyType: z.string(),
    }),
    strongPoints: z.array(z.union([
      z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum(['kitchen', 'location', 'fees', 'outdoor', 'storage', 'condition', 'other']),
      }),
      z.string(),
    ])),
    concerns: z.array(z.union([
      z.object({
        title: z.string(),
        description: z.string(),
        severity: z.enum(['low', 'medium', 'high']),
        estimatedCost: z.string().optional(),
        category: z.enum(['electrical', 'structural', 'safety', 'pest', 'maintenance', 'age', 'other']),
      }),
      z.string(),
    ])),
    hiddenDefects: z.array(z.object({
      category: z.enum(['shared_debt', 'legal_deficiencies', 'moisture_water_damage', 'rot_fungus_pests', 'electrical_faults', 'drainage_leaks', 'roof_structural_issues', 'environmental_hazards']),
      riskLevel: z.enum(['low', 'medium', 'high']),
      briefExplanation: z.string(),
      signsToLookFor: z.array(z.string()),
      consequences: z.string(),
      preventiveMeasures: z.string(),
      actionRequired: z.string().optional(),
    })),
    bottomLine: z.string(),
    summary: z.string(),
  }),
  theme: z.enum(['light', 'dark']),
  locale: z.enum(['en', 'no']),
});

/**
 * Server-side translation helper
 * Creates a translation function similar to useTranslations() but for server-side use
 * The PDF component expects to work with AnalysisResult namespace keys
 */
function getServerTranslations(locale: string) {
  const messages = locale === 'no' ? noMessages : enMessages;
  
  return function t(key: string): string {
    // The PDF component uses keys like 'analysis.analysisSummaryTitle' 
    // but they should be 'AnalysisResult.analysis.analysisSummaryTitle'
    const fullKey = `AnalysisResult.${key}`;
    const keys = fullKey.split('.');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = messages;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // Return the key if translation is not found (fallback to English text)
        console.warn(`Translation not found for key: ${fullKey}`);
        return key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };
}

/**
 * Convert Node.js ReadableStream to Web ReadableStream
 * Required for NextResponse compatibility
 */
function toWebStream(nodejsStream: NodeJS.ReadableStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodejsStream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });

      nodejsStream.on('end', () => {
        controller.close();
      });

      nodejsStream.on('error', (err) => {
        controller.error(err);
      });
    },
  });
}

/**
 * POST handler for PDF generation
 * Accepts analysis data, theme, and locale, returns a streamed PDF
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { analysisData, theme, locale } = requestSchema.parse(body);

    // Create server-side translation function
    const t = getServerTranslations(locale);

    // Determine theme mode
    const isDarkMode = theme === 'dark';

    // Generate PDF using renderToStream
    const stream = await ReactPDF.renderToStream(
      React.createElement(AnalysisReportPDF, {
        analysisData,
        t,
        isDarkMode,
      }) as React.ReactElement
    );

    // Generate filename with timestamp
    const timestamp = Date.now();
    const filename = `property-analysis-${timestamp}.pdf`;

    // Return streaming response with proper headers
    return new NextResponse(toWebStream(stream), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: error.errors 
        }, 
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { 
        error: 'PDF generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
