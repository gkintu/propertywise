"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useServerSentEvents, type ProgressEvent } from "@/hooks/useServerSentEvents";
import { useLoadingDots } from "@/hooks/useLoadingDots";

interface AnalysisResult {
  analysis?: unknown;
  summary?: unknown;
  [key: string]: unknown;
}

interface AnalysisProgressBarProps {
  blobUrl?: string;
  language?: "en" | "no";
  onComplete?: (data: AnalysisResult) => void;
  onError?: (error: string) => void;
}

export default function AnalysisProgressBar({ 
  blobUrl, 
  language = "en",
  onComplete,
  onError 
}: AnalysisProgressBarProps) {
  const t = useTranslations("HomePage");
  const [stage, setStage] = useState("");
  const [message, setMessage] = useState("");
  
  // Configure SSE connection with query parameters
  const sseConfig = blobUrl ? {
    url: `/api/analyze-pdf-progress?blobUrl=${encodeURIComponent(blobUrl)}&language=${language}`,
    options: {
      retryDelay: 1000,
      maxRetries: 3,
      timeout: 30000,
    }
  } : null;


  const { isConnecting, error, lastEvent } = useServerSentEvents(sseConfig);
  
  // Determine the main stage title (no animation)
  const mainStageTitle = stage || (isConnecting ? t("upload.connecting") : t("upload.initializing"));
  
  // Create animated "Processing..." text for replacement
  const animatedProcessingText = useLoadingDots(t("upload.processing"), 600);

  // Handle progress events from SSE
  useEffect(() => {
    if (!lastEvent) return;

    const event: ProgressEvent = lastEvent;
    
    setStage(event.stage);
    setMessage(event.message || "");

    if (event.type === 'complete' && event.data) {
      onComplete?.(event.data);
    } else if (event.type === 'error') {
      onError?.(event.message || "Analysis failed");
    }
  }, [lastEvent, onComplete, onError]);

  // Handle connection errors - but ignore benign cleanup errors
  useEffect(() => {
    if (error) {
      // Don't report connection errors if we just completed successfully
      if (lastEvent?.type === 'complete') {
        console.log('Ignoring SSE cleanup error after successful completion:', error);
        return;
      }
      onError?.(error);
    }
  }, [error, onError, lastEvent]);

  // SSE connection automatically starts analysis when connected
  // No additional POST request needed

  // Use the main stage title (no animation) for display
  const displayStage = mainStageTitle;
  
  // Replace static "Processing..." with animated version
  let displayMessage = message || (isConnecting ? t("upload.establishingConnection") : "");
  if (displayMessage && (displayMessage.toLowerCase().includes("processing") || displayMessage.toLowerCase().includes("behandler"))) {
    displayMessage = animatedProcessingText;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-md">
        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {displayStage}
              </p>
              {displayMessage && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {displayMessage}
                </p>
              )}
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  {error}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-yellow-600 dark:text-[#FBBF24] animate-spin" />
              </div>
              {isConnecting && (
                <div className="text-center text-xs text-gray-400">
                  {t("upload.connectingToAnalysisService")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
