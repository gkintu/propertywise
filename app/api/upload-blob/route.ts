import { handleUpload } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const result = await handleUpload({
      body: request.body as never,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Simple validation: must be a PDF
        if (!pathname.toLowerCase().endsWith(".pdf")) {
          throw new Error("Only PDF files are allowed");
        }

        return {
          allowedContentTypes: ["application/pdf"],
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
            fileName: pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Upload completed:", blob.url);
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
