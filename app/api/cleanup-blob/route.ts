import { del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function DELETE(request: NextRequest) {
  try {
    const { blobUrl } = await request.json()

    if (!blobUrl || typeof blobUrl !== 'string') {
      return NextResponse.json(
        { error: 'Blob URL is required' },
        { status: 400 }
      )
    }

    // Protection: Don't delete demo files
    if (blobUrl.includes('demo-pdfs') || blobUrl.includes('Alv-Johnsens-vei') || 
        blobUrl.includes('Bankgata') || blobUrl.includes('Ekornsvingen') || 
        blobUrl.includes('Nordahl-Griegs-vei')) {
      console.log('🛡️ Skipping deletion of protected demo file:', blobUrl)
      return NextResponse.json({ 
        success: true, 
        message: 'Demo file protected from deletion' 
      })
    }

    // Delete the blob
    await del(blobUrl)
    console.log('🗑️ Successfully deleted blob:', blobUrl)

    return NextResponse.json({ 
      success: true, 
      message: 'Blob deleted successfully' 
    })

  } catch (error) {
    console.error('❌ Error deleting blob:', error)
    
    // If blob doesn't exist, consider it a success
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ 
        success: true, 
        message: 'Blob was already deleted or does not exist' 
      })
    }

    return NextResponse.json(
      { error: 'Failed to delete blob' },
      { status: 500 }
    )
  }
}

// Handle sendBeacon requests (these come as POST with different content-type)
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let blobUrl: string;

    // Handle different request formats
    if (contentType.includes('application/json')) {
      const { blobUrl: url } = await request.json();
      blobUrl = url;
    } else {
      // sendBeacon sends data as text, try parsing as JSON
      const body = await request.text();
      try {
        const parsed = JSON.parse(body);
        blobUrl = parsed.blobUrl;
      } catch {
        // If not JSON, assume it's the URL directly
        blobUrl = body;
      }
    }

    if (!blobUrl || typeof blobUrl !== 'string') {
      return NextResponse.json(
        { error: 'Blob URL is required' },
        { status: 400 }
      )
    }

    // Protection: Don't delete demo files
    if (blobUrl.includes('demo-pdfs') || blobUrl.includes('Alv-Johnsens-vei') || 
        blobUrl.includes('Bankgata') || blobUrl.includes('Ekornsvingen') || 
        blobUrl.includes('Nordahl-Griegs-vei')) {
      console.log('🛡️ Skipping deletion of protected demo file (beacon):', blobUrl)
      return NextResponse.json({ 
        success: true, 
        message: 'Demo file protected from deletion' 
      })
    }

    // Delete the blob
    await del(blobUrl)
    console.log('🗑️ Successfully deleted blob via beacon:', blobUrl)

    return NextResponse.json({ 
      success: true, 
      message: 'Blob deleted successfully via beacon' 
    })

  } catch (error) {
    console.error('❌ Error deleting blob via beacon:', error)
    
    // If blob doesn't exist, consider it a success
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ 
        success: true, 
        message: 'Blob was already deleted or does not exist' 
      })
    }

    return NextResponse.json(
      { error: 'Failed to delete blob via beacon' },
      { status: 500 }
    )
  }
}
