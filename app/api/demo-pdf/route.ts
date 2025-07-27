import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }
    
    // Validate file name to prevent directory traversal
    const allowedFiles = [
      'Alv Johnsens vei 1 - Drammen - Salgsoppgave.pdf',
      'Bolette brygge 5 - Oslo - salgsoppgave.pdf',
      'Sanengveien 1 - Fredrikstad - salgsoppgave.pdf'
    ];
    
    if (!allowedFiles.includes(fileName)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    const filePath = join(process.cwd(), 'public', 'demo-pdfs', fileName);
    const fileBuffer = await readFile(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error serving demo PDF:', error);
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}
