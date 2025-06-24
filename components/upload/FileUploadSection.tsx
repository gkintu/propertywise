"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Search } from "lucide-react"
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from "sonner"
import { useFileUpload } from '@/hooks/useFileUpload'
import { useState, forwardRef, useImperativeHandle } from 'react'
import Spinner from "@/components/customized/spinner/spinner-05";
import { ShakeMotion, ShakeMotionHandle } from '@/components/motion'
import { useRef } from 'react'

interface FileUploadSectionProps {
  onAnalysisStart?: () => void;
  onAnalysisComplete?: () => void;
  className?: string;
  showTitle?: boolean;
  containerWidth?: 'normal' | 'full';
}

export interface FileUploadSectionHandle {
  shake: () => void;
}

const FileUploadSection = forwardRef<FileUploadSectionHandle, FileUploadSectionProps>(({ 
  onAnalysisStart, 
  onAnalysisComplete, 
  className = "",
  showTitle = true,
  containerWidth = 'normal'
}, ref) => {
  const t = useTranslations('HomePage');
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const shakeRef = useRef<ShakeMotionHandle>(null)
  
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
  } = useFileUpload();

  useImperativeHandle(ref, () => ({
    shake: () => {
      shakeRef.current?.shake();
    }
  }));

  const handleAnalyzeDocuments = async () => {
    if (uploadedFiles.length === 0) {
      toast.error(t('upload.validation.noFileSelected'))
      return
    }

    // Clear any previous analysis results when starting a new analysis
    localStorage.removeItem('analysisResult')
    localStorage.removeItem('analysisError')
    localStorage.removeItem('analysisErrorType')

    setIsLoading(true)
    onAnalysisStart?.()
    
    const formData = new FormData()
    formData.append("file", uploadedFiles[0])
    formData.append("language", locale)

    try {
      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Failed to analyze document"
        let errorType = "processing_error"
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
          errorType = errorData.errorType || errorType
          
          // Store both error message and type for the analysis result page
          localStorage.setItem('analysisError', errorMessage)
          localStorage.setItem('analysisErrorType', errorType)
          
        } catch {
          // If response is not JSON, use the text as error message
          errorMessage = errorText || errorMessage
          localStorage.setItem('analysisError', errorMessage)
          localStorage.setItem('analysisErrorType', 'processing_error')
        }
        
        // Don't show toast for specific error types that will be handled on the result page
        if (errorType === 'invalid_document_type' || errorType === 'insufficient_property_data') {
          // Navigate to result page to show specific error UI
          router.push(`/${locale}/analysis-result`)
          return
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Validate that we have actual data before storing
      if (data && (data.analysis || data.summary)) {
        localStorage.setItem('analysisResult', JSON.stringify(data))
        toast.success(t('upload.success'))
        router.push(`/${locale}/analysis-result`)
      } else {
        throw new Error("No analysis data received from server")
      }
    } catch (error) {
      console.error("Error analyzing document:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error(`${t('upload.error')}: ${errorMessage}`)
      localStorage.setItem('analysisError', errorMessage)
      localStorage.setItem('analysisErrorType', 'processing_error')
      router.push(`/${locale}/analysis-result`)
    } finally {
      setIsLoading(false)
      onAnalysisComplete?.()
    }
  }

  return (
    <div className={`${className}`}>
      {/* Screen reader status announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>

      <div className={`text-center ${containerWidth === 'full' ? 'max-w-5xl' : 'max-w-4xl'} mx-auto`}>
        {showTitle && (
          <>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('upload.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-[#D1D5DB] mb-8">
              {t('upload.subtitle')}
            </p>
          </>
        )}
        
        <ShakeMotion ref={shakeRef} duration={600} intensity={8}>
          <Card className={`max-w-2xl mx-auto border-2 border-dashed transition-colors ${
            dragActive 
              ? 'border-yellow-400 bg-yellow-50 dark:border-yellow-500/50 dark:bg-gray-800/50' 
              : 'border-yellow-200 hover:border-yellow-400 dark:border-gray-600 dark:hover:border-yellow-500/50 dark:bg-gray-800/50'
          }`}>
          <CardContent 
            className="p-12 cursor-default"
            role="region"
            aria-label={t('upload.dropText')}
            tabIndex={0}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openFileDialog();
              }
            }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-yellow-600 dark:text-[#FBBF24]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('upload.dropText')}</h3>
              <p className="text-gray-500 dark:text-[#6B7280] mb-4">
                {t('upload.or')} <span 
                  className="text-yellow-600 dark:text-[#FBBF24] font-medium cursor-pointer hover:text-yellow-700 dark:hover:text-[#F59E0B] underline"
                  onClick={openFileDialog}
                >{t('upload.browseText')}</span>
              </p>
              <div className="text-sm text-gray-400 dark:text-[#6B7280]">
                {t('upload.supportText')}
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              
              {/* Upload button */}
              <Button 
                variant="outline" 
                className="mt-6 border-yellow-200 dark:border-[#FBBF24] text-yellow-600 dark:text-[#FBBF24] hover:bg-yellow-50 dark:hover:bg-[#FBBF24] dark:hover:text-black font-medium"
                onClick={openFileDialog}
                aria-label={t('upload.selectButton')}
              >
                {t('upload.selectButton')}
              </Button>
            </div>
          </CardContent>
        </Card>
        </ShakeMotion>

        {/* Uploaded files display */}
        {uploadedFiles.length > 0 && (
          <div className="max-w-2xl mx-auto mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('upload.uploadedFiles')}</h4>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <Card key={index} className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-red-600 dark:text-red-400"
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
                          <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                          <p className="text-sm text-gray-500 dark:text-[#9CA3AF]">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile()}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 dark:border-gray-600"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 dark:bg-[#EAB308] dark:hover:bg-[#D97706] text-white dark:text-black font-medium px-8 relative flex items-center justify-center"
                onClick={handleAnalyzeDocuments}
                disabled={isLoading || uploadedFiles.length === 0}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    {t('upload.analyzing')}
                  </span>
                ) : (
                  <>{t('upload.analyzeButton')}</>
                )}
                <Search className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
});

FileUploadSection.displayName = 'FileUploadSection';

export default FileUploadSection;
