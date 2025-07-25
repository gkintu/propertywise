import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname: string,
        clientPayload: string | null,
      ) => {
        // Perform authorization checks here

        return {
          allowedContentTypes: ["application/pdf"],
          tokenPayload: JSON.stringify({
            // Pass any custom data to onUploadCompleted
            pathname,
            clientPayload,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Post-upload logic, like updating a database
        console.log("✅ Upload completed successfully!");
        console.log("📁 Blob URL:", blob.url);
        console.log("📋 Token payload:", tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("❌ Upload error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Upload failed", message },
      { status: 400 },
    );
  }
}
