import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const { blobUrl } = await request.json();
    
    if (!blobUrl || typeof blobUrl !== 'string') {
      return NextResponse.json(
        { error: 'Valid blob URL is required' },
        { status: 400 }
      );
    }
    
    // Delete the blob from Vercel Blob storage
    await del(blobUrl);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blob deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting blob:', error);
    return NextResponse.json(
      { error: 'Failed to delete blob' },
      { status: 500 }
    );
  }
}
