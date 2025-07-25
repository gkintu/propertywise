import { handleUpload } from "@vercel/blob/client";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return handleUpload({
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
        }),
      };
    },
    onUploadCompleted: async ({ blob }) => {
      console.log("Upload completed:", blob.url);
    },
  });
}
