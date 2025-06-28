"use client";

import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Search } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ShakeMotion, ShakeMotionHandle } from "@/components/motion";
import { DemoFilesSection } from "./DemoFilesSection";
import AnalysisProgressBar from "./AnalysisProgressBar";

interface FileUploadSectionProps {
  onAnalysisStart?: () => void;
  onAnalysisComplete?: () => void;
  className?: string;
  showTitle?: boolean;
  containerWidth?: "normal" | "full";
}

export interface FileUploadSectionHandle {
  shake: () => void;
}

// Analysis states enum for better type safety
enum AnalysisState {
  IDLE = 'idle',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  ERROR = 'error'
}

const FileUploadSection = forwardRef<
  FileUploadSectionHandle,
  FileUploadSectionProps
>(
  (
    {
      onAnalysisStart,
      onAnalysisComplete,
      className,
      showTitle = true,
      containerWidth = "normal",
    },
    ref
  ) => {
    const t = useTranslations("HomePage");
    const params = useParams();
    const locale = params.locale as string;
    const router = useRouter();
    
    // Modern state management
    const [analysisState, setAnalysisState] = useState<AnalysisState>(AnalysisState.IDLE);
    const [isPending, startTransition] = useTransition();
    const shakeRef = useRef<ShakeMotionHandle>(null);

    const {
      dragActive,
      uploadedFiles,
      statusMessage,
      fileInputRef,
      handleDrag,
      handleDrop,
      handleFileSelect,
      removeFile,
      openFileDialog,
      setUploadedFiles,
    } = useFileUpload();

    useImperativeHandle(ref, () => ({
      shake: () => {
        shakeRef.current?.shake();
      },
    }));

    // Memoized navigation handler
    const navigateToResults = useCallback(() => {
      startTransition(() => {
        router.push(`/${locale}/analysis-result`);
      });
    }, [router, locale]);

    // Modern error handling
    const handleAnalysisError = useCallback((error: unknown, errorType: string = "processing_error") => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      console.error("Analysis error:", error);
      toast.error(`${t("upload.error")}: ${errorMessage}`);
      
      // Store error info for results page
      localStorage.setItem("analysisError", errorMessage);
      localStorage.setItem("analysisErrorType", errorType);
      
      setAnalysisState(AnalysisState.ERROR);
      
      // Brief delay to show completion, then navigate
      setTimeout(() => {
        navigateToResults();
        onAnalysisComplete?.();
      }, 500);
    }, [t, navigateToResults, onAnalysisComplete]);

    // Modern success handling
    interface AnalysisResult {
      analysis?: unknown;
      summary?: unknown;
      [key: string]: unknown;
    }
    const handleAnalysisSuccess = useCallback((data: AnalysisResult) => {
      localStorage.setItem("analysisResult", JSON.stringify(data));
      toast.success(t("upload.success"));
      
      setAnalysisState(AnalysisState.COMPLETED);
      
      // Brief delay to show 100% completion, then navigate
      setTimeout(() => {
        navigateToResults();
        onAnalysisComplete?.();
      }, 500);
    }, [t, navigateToResults, onAnalysisComplete]);

    // Main analysis handler with modern async patterns
    const handleAnalyzeDocuments = useCallback(async () => {
      const fileToAnalyze = uploadedFiles[0];

      if (!fileToAnalyze) {
        toast.error(t("upload.validation.noFileSelected"));
        shakeRef.current?.shake();
        return;
      }

      // Clear previous results
      ['analysisResult', 'analysisError', 'analysisErrorType'].forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Start analysis
      setAnalysisState(AnalysisState.ANALYZING);
      onAnalysisStart?.();

      const formData = new FormData();
      formData.append("file", fileToAnalyze);
      formData.append("language", locale);

      try {
        const response = await fetch("/api/analyze-pdf", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = "Failed to analyze document";

          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }

          throw new Error(errorMessage);
        }

        const data: AnalysisResult = await response.json();

        if (data && (data.analysis || data.summary)) {
          handleAnalysisSuccess(data);
        } else {
          throw new Error("No analysis data received from server");
        }
      } catch (error) {
        handleAnalysisError(error);
      }
    }, [
      uploadedFiles,
      locale,
      t,
      onAnalysisStart,
      handleAnalysisSuccess,
      handleAnalysisError
    ]);

    // Computed values
    const isAnalyzing = analysisState === AnalysisState.ANALYZING;
    const isCompleted = analysisState === AnalysisState.COMPLETED;
    const hasFiles = uploadedFiles.length > 0;

    return (
      <div className={className}>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {statusMessage}
        </div>

        <div
          className={`text-center ${
            containerWidth === "full" ? "max-w-5xl" : "max-w-4xl"
          } mx-auto`}
        >
          {showTitle && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t("upload.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-[#D1D5DB] mb-8">
                {t("upload.subtitle")}
              </p>
            </>
          )}

          <ShakeMotion ref={shakeRef} duration={600} intensity={8}>
            <Card
              className={`max-w-2xl mx-auto border-2 border-dashed transition-colors ${
                dragActive
                  ? "border-yellow-400 bg-yellow-50 dark:border-yellow-500/50 dark:bg-gray-800/50"
                  : "border-yellow-200 hover:border-yellow-400 dark:border-gray-600 dark:hover:border-yellow-500/50 dark:bg-gray-800/50"
              } ${isAnalyzing ? 'opacity-50 pointer-events-none select-none' : ''}`}
            >
              <CardContent
                className="p-12 cursor-default"
                role="region"
                aria-label={t("upload.dropText")}
                tabIndex={0}
                onDragEnter={isAnalyzing ? undefined : handleDrag}
                onDragLeave={isAnalyzing ? undefined : handleDrag}
                onDragOver={isAnalyzing ? undefined : handleDrag}
                onDrop={isAnalyzing ? undefined : handleDrop}
                onKeyDown={isAnalyzing ? undefined : (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openFileDialog();
                  }
                }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-yellow-600 dark:text-[#FBBF24]" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t("upload.dropText")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-[#9CA3AF] mb-4">
                    <span className="font-medium text-yellow-600 dark:text-[#FBBF24]">
                      {t("upload.browseText")}
                    </span>
                  </p>
                  <div className="text-sm text-gray-400 dark:text-[#6B7280]">
                    {t("upload.supportText")}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isAnalyzing}
                  />

                  <Button
                    variant="outline"
                    className="mt-6 border-yellow-200 dark:border-[#FBBF24] text-yellow-600 dark:text-[#FBBF24] hover:bg-yellow-50 dark:hover:bg-[#FBBF24] dark:hover:text-black font-medium"
                    onClick={isAnalyzing ? undefined : openFileDialog}
                    aria-label={t("upload.selectButton")}
                    disabled={isAnalyzing}
                  >
                    {t("upload.selectButton")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ShakeMotion>

          {!hasFiles ? (
            <DemoFilesSection
              onDemoFileUpload={(file) => setUploadedFiles([file])}
              isLoading={isAnalyzing}
            />
          ) : (
            <div className="max-w-2xl mx-auto mt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("upload.uploadedFile")}
              </h4>
              <Card className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800/0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-red-600 dark:text-red-400/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {uploadedFiles[0].name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-[#9CA3AF]">
                          {(uploadedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile()}
                      disabled={isAnalyzing || isPending}
                      className={`text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 dark:border-gray-600 ${
                        (isAnalyzing || isPending) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                      }`}
                      aria-label={`Remove ${uploadedFiles[0].name}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6 text-center">
                {(isAnalyzing || isCompleted) ? (
                  <AnalysisProgressBar complete={isCompleted} />
                ) : (
                  <Button
                    className="bg-yellow-500 hover:bg-[#FACC15] dark:hover:bg-[#f6c40c] text-white dark:text-[#111827] px-8 font-medium relative flex items-center justify-center disabled:opacity-50"
                    onClick={handleAnalyzeDocuments}
                    disabled={!hasFiles || isPending}
                  >
                    {isPending ? (
                      "Processing..."
                    ) : (
                      <>
                        {t("upload.analyzeButton")}
                        <Search className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FileUploadSection.displayName = "FileUploadSection";

export default FileUploadSection;
