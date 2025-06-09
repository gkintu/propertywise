\
import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';
import 'dotenv/config'; // Ensure environment variables are loaded

// Initialize OpenAI client for OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000', // Add your site URL to .env or use a default
    'X-Title': process.env.APP_TITLE || 'PropertyAI', // Add your app title to .env or use a default
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type. Only PDFs are allowed.' }, { status: 400 });
    }

    console.log('Received file:', file.name, 'Type:', file.type, 'Size:', file.size);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(fileBuffer);
    const pdfText = pdfData.text;

    console.log('Extracted text length:', pdfText.length);

    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from PDF, or PDF is empty.' }, { status: 400 });
    }

    // Truncate pdfText if it's too long to avoid exceeding model token limits
    // Adjust the maxLength as needed based on typical document sizes and model context window
    const maxLength = 15000; // Example: roughly 4k tokens, adjust as needed
    const truncatedText = pdfText.length > maxLength ? pdfText.substring(0, maxLength) + "..." : pdfText;

    console.log('Sending text to AI (truncated length):', truncatedText.length);

    const completion = await openai.chat.completions.create({
      model: 'google/gemma-3-27b-it:free', // Or your preferred model
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

    const aiSummary = completion.choices[0].message.content;

    if (!aiSummary) {
      return NextResponse.json({ error: 'AI failed to generate a summary.' }, { status: 500 });
    }

    return NextResponse.json({ summary: aiSummary });
  } catch (error) {
    console.error('Error in /api/analyze-pdf:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process file: ${errorMessage}` }, { status: 500 });
  }
}
