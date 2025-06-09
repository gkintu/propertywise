import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import PDFParser from 'pdf2json'; // Changed to default import
import fs from 'fs';
import path from 'path';
import os from 'os';

// Initialize OpenAI client for OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
    'X-Title': process.env.APP_TITLE || 'PropertyAI',
  },
});

export async function GET() {
  // Simple test endpoint to check if API is working
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ 
      error: 'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in your .env.local file.',
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
    console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
    
    // Check if OpenRouter API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.log('Missing API key');
      return NextResponse.json({ 
        error: 'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in your .env.local file.' 
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

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

    const maxLength = 15000;
    const truncatedText = pdfText.length > maxLength ? pdfText.substring(0, maxLength) + "..." : pdfText;

    console.log('Sending text to AI (truncated length):', truncatedText.length);
    console.log('About to call OpenRouter API...');

    const completion = await openai.chat.completions.create({
      model: 'google/gemma-3-27b-it:free',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant specialized in analyzing property reports. Given the text from a property document, please provide a concise summary highlighting key findings, potential risks (like structural issues, moisture, pests, outdated systems), and any urgent recommendations. Focus on actionable insights for a potential buyer. If the document is not a property report or the text is too garbled, indicate that you cannot provide a meaningful summary.',
        },
        {
          role: 'user',
          content: truncatedText,
        },
      ],
    });

    console.log('OpenRouter API response received');
    const aiSummary = completion.choices[0].message.content;

    if (!aiSummary) {
      console.log('AI failed to generate summary');
      return NextResponse.json({ error: 'AI failed to generate a summary.' }, { status: 500 });
    }

    console.log('Returning successful response');
    return NextResponse.json({ summary: aiSummary });
  } catch (error) {
    console.error('Error in /api/analyze-pdf:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process file: ${errorMessage}` }, { status: 500 });
  }
}
