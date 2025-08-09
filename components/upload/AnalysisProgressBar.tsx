"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useTranslations } from "next-intl";
import { useServerSentEvents, type ProgressEvent } from "@/hooks/useServerSentEvents";

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
  const [progress, setProgress] = useState(0);
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

  // Handle progress events from SSE
  useEffect(() => {
    if (!lastEvent) return;

    const event: ProgressEvent = lastEvent;
    
    setProgress(event.progress);
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

  // Fallback display when no SSE data yet
  const displayStage = stage || (isConnecting ? t("upload.connecting") : t("upload.initializing"));
  const displayMessage = message || (isConnecting ? t("upload.establishingConnection") : "");

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
              <Progress
                value={progress}
                className="h-3 bg-yellow-100 dark:bg-yellow-900 [&>div]:bg-yellow-500 [&>div]:dark:bg-yellow-400 [&>div]:transition-all [&>div]:duration-300"
              />
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                {Math.round(progress)}%
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
