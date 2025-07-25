"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Home as HomeIcon,
  ArrowLeft,
  FileText,
  AlertTriangle,
  MapPin,
  Eye,
  TrendingUp,
  CheckCircle,
  Info,
  Download,
  Upload,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { PropertyAnalysis } from "@/lib/types";
import { TranslationFunction } from "@/lib/i18n-types";
import { AnalysisReportPDF } from "@/components/pdf/AnalysisReportPDF";
import FileUploadSection from "@/components/upload/FileUploadSection";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PropertyListingBadge } from "@/components/ui/property-listing-badge";

// Helper function to extract JSON from text that might be wrapped in markdown or have extra formatting
function tryExtractJsonFromText(text: string): PropertyAnalysis | null {
  try {
    // First try parsing directly
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed.propertyDetails || parsed.strongPoints || parsed.concerns)
    ) {
      return parsed as PropertyAnalysis;
    }
  } catch {
    // If direct parsing fails, try to extract JSON from markdown code blocks or other formatting
  }

  // Remove common markdown formatting
  let cleanedText = text;

  // Remove markdown code blocks
  cleanedText = cleanedText.replace(/```json\s*/gi, "").replace(/```\s*$/g, "");
  cleanedText = cleanedText.replace(/```\s*/g, "");

  // Remove leading/trailing quotes and other formatting
  cleanedText = cleanedText.replace(/^["'`]+|["'`]+$/g, "");
  cleanedText = cleanedText.trim();

  // Try to find JSON-like structure in the text
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (
        parsed &&
        typeof parsed === "object" &&
        (parsed.propertyDetails || parsed.strongPoints || parsed.concerns)
      ) {
        return parsed as PropertyAnalysis;
      }
    } catch (e) {
      console.log("Failed to parse extracted JSON:", e);
    }
  }

  return null;
}

// PDF download function using react-pdf/renderer
async function downloadAsPDF(
  analysisData: PropertyAnalysis,
  t: TranslationFunction
) {
  try {
    // Generate PDF using react-pdf/renderer
    const blob = await pdf(
      <AnalysisReportPDF analysisData={analysisData} t={t} />
    ).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Generate filename from property address
    const propertyAddress =
      analysisData?.propertyDetails?.address
        ?.replace(/[^a-zA-Z0-9\s]/g, "")
        ?.trim() || "Property";

    const filename = `${propertyAddress}_Analysis_Report.pdf`;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);

    console.log("PDF generated successfully:", filename);
    toast.success(t("analysis.pdfGeneratedSuccess"));
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error(t("analysis.pdfGenerationError"));
  }
}

export default function AnalysisResultPage() {
  const [isDev, setIsDev] = useState(false);
  const t = useTranslations("AnalysisResult");
  const [analysisData, setAnalysisData] = useState<PropertyAnalysis | null>(
    null
  );
  const [summaryData, setSummaryData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");
  const [showUpload, setShowUpload] = useState(false);
  const [showAnalyzeUpload, setShowAnalyzeUpload] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === "development");
  }, []);

  useEffect(() => {
    const storedAnalysis = localStorage.getItem("analysisResult");
    const storedError = localStorage.getItem("analysisError");
    const storedErrorType = localStorage.getItem("analysisErrorType");

    if (
      storedAnalysis &&
      storedAnalysis !== "undefined" &&
      storedAnalysis !== "null"
    ) {
      try {
        const parsed = JSON.parse(storedAnalysis);
        if (isDev) console.log("📊 Parsed data structure:", parsed);
        // Check if it's an AnalysisResponse wrapper or direct PropertyAnalysis
        if (parsed.analysis && typeof parsed.analysis === "object") {
          if (isDev)
            console.log("✅ Loading wrapped AnalysisResponse data", {
              strongPoints: parsed.analysis.strongPoints?.length || 0,
              concerns: parsed.analysis.concerns?.length || 0,
              hasPropertyDetails: !!parsed.analysis.propertyDetails,
            });
          setAnalysisData(parsed.analysis);
          setDataSource("API Response (structured JSON)");
        } else if (
          parsed.propertyDetails &&
          (parsed.strongPoints || parsed.concerns)
        ) {
          if (isDev)
            console.log("✅ Loading direct PropertyAnalysis data", {
              strongPoints: parsed.strongPoints?.length || 0,
              concerns: parsed.concerns?.length || 0,
              hasPropertyDetails: !!parsed.propertyDetails,
            });
          setAnalysisData(parsed);
          setDataSource("Direct PropertyAnalysis (structured JSON)");
        } else if (parsed.summary && typeof parsed.summary === "string") {
          if (isDev)
            console.log(
              "⚠️ Loading summary fallback data (AI did not return structured JSON)"
            );
          // Try to extract JSON from the summary if it contains structured data
          const cleanedSummary = tryExtractJsonFromText(parsed.summary);
          if (cleanedSummary) {
            if (isDev)
              console.log(
                "✅ Successfully extracted structured data from summary text"
              );
            setAnalysisData(cleanedSummary);
            setDataSource("Extracted from summary text (structured JSON)");
          } else {
            setSummaryData(parsed.summary);
            setDataSource(
              "Summary fallback (AI returned text instead of JSON)"
            );
          }
        } else {
          // Try to parse the raw stored analysis as JSON if it looks like structured data
          const directParsed = tryExtractJsonFromText(storedAnalysis);
          if (directParsed) {
            if (isDev)
              console.log(
                "✅ Successfully extracted structured data from raw stored analysis"
              );
            setAnalysisData(directParsed);
            setDataSource("Extracted from raw analysis (structured JSON)");
          } else {
            if (isDev) console.log("❌ No structured data found in:", parsed);
            setError(
              "No valid analysis data found. The API may have returned an unexpected format."
            );
            setDataSource("Unknown format");
          }
        }
      } catch (parseError) {
        if (isDev)
          console.error("❌ Error parsing analysis result:", parseError);
        // If parsing fails, try to extract JSON directly from the stored analysis
        const directParsed = tryExtractJsonFromText(storedAnalysis);
        if (directParsed) {
          if (isDev)
            console.log(
              "✅ Successfully extracted structured data from unparseable stored analysis"
            );
          setAnalysisData(directParsed);
          setDataSource("Extracted from raw text (structured JSON)");
        } else {
          setError("Invalid analysis result format");
          setDataSource("Parse Error");
        }
      }
    } else if (
      storedError &&
      storedError !== "undefined" &&
      storedError !== "null"
    ) {
      setError(storedError);
      setErrorType(storedErrorType || "processing_error");
      setDataSource("Stored Error");
    } else {
      // No valid data found
      setError(
        "No analysis result found. Please upload and analyze a document first."
      );
      setDataSource("No Data");
    }
    setIsLoading(false);
  }, [isDev]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white dark:from-[#111827] dark:to-[#1F2937]">
        <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#111827]/85 backdrop-blur-sm border-b border-gray-200/30 dark:border-[#374151]/50 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-[#F9FAFB]">
                PropertyWise
              </span>
            </button>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <PropertyListingBadge />
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-950/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileText className="w-12 h-12 text-yellow-600 dark:text-[#FBBF24]" />
            </div>
            <p className="text-xl text-gray-600 dark:text-[#D1D5DB]">
              {t("loading.loadingText")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!analysisData && !summaryData)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white dark:from-[#111827] dark:to-[#1F2937]">
        <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#111827]/85 backdrop-blur-sm border-b border-gray-200/30 dark:border-[#374151]/50 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-[#F9FAFB]">
                PropertyWise
              </span>
            </button>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <PropertyListingBadge />
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="w-full max-w-2xl border-2 border-yellow-200 dark:border-yellow-800/50 dark:bg-[#1F2937]">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">
                {errorType === "invalid_document_type"
                  ? t("error.invalidDocumentTitle")
                  : errorType === "insufficient_property_data"
                  ? t("error.insufficientDataTitle")
                  : errorType === "classification_error"
                  ? t("error.classificationErrorTitle")
                  : errorType === "processing_error"
                  ? t("error.processingErrorTitle")
                  : error
                  ? t("error.analysisFailedTitle")
                  : t("error.analysisNotFoundTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 dark:text-[#D1D5DB] mb-6">
                {errorType === "invalid_document_type"
                  ? t("error.invalidDocumentMessage")
                  : errorType === "insufficient_property_data"
                  ? t("error.insufficientDataMessage")
                  : errorType === "classification_error"
                  ? t("error.classificationErrorMessage")
                  : errorType === "processing_error"
                  ? t("error.processingErrorMessage")
                  : error || t("error.noResultMessage")}
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    localStorage.removeItem("analysisResult");
                    localStorage.removeItem("analysisError");
                    localStorage.removeItem("analysisErrorType");
                    router.push("/");
                  }}
                  size="lg"
                  className="bg-yellow-500 hover:bg-[#FACC15] text-white dark:text-[#111827]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("error.goBackButton")}
                </Button>

                {(errorType === "invalid_document_type" ||
                  errorType === "insufficient_property_data") && (
                  <Button
                    onClick={() => setShowUpload(true)}
                    size="lg"
                    variant="outline"
                    className="border-yellow-200 dark:border-[#CA8A04] text-yellow-700 dark:text-[#FBBF24] hover:bg-yellow-50 dark:hover:bg-[#374151]"
                  >
                    {t("error.tryAgainButton")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Show upload section when user clicks "Try Again" */}
          {showUpload && (
            <div className="mt-8 w-full">
              <FileUploadSection
                showTitle={false}
                containerWidth="full"
                onAnalysisStart={() => {
                  setShowUpload(false);
                  setIsLoading(true);
                }}
                onAnalysisComplete={() => {
                  setIsLoading(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render structured data (preferred)
  if (analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white dark:from-[#111827] dark:to-[#1F2937]">
        <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#111827]/85 backdrop-blur-sm border-b border-gray-200/30 dark:border-[#374151]/50 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-[#F9FAFB]">
                PropertyWise
              </span>
            </button>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <PropertyListingBadge />
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8 pt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-[#F9FAFB] flex items-center">
              <MapPin className="w-7 h-7 mr-3 text-yellow-600 dark:text-[#FBBF24]" />
              {analysisData?.propertyDetails?.address ||
                t("analysis.propertyAnalysisTitle")}
            </h1>
          </div>

          {analysisData?.summary && (
            <Card className="mb-6 dark:bg-[#1F2937] dark:border-[#374151]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-[#F9FAFB]">
                  <FileText className="w-5 h-5" />
                  {t("analysis.analysisSummaryTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-[#D1D5DB] leading-relaxed whitespace-pre-wrap">
                    {analysisData.summary}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisData?.propertyDetails && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mb-8">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                {t("analysis.marketPosition")}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">
                  {analysisData.propertyDetails.bedrooms}
                  {t("analysis.roomPropertyPriced", {
                    propertyType: analysisData.propertyDetails.propertyType,
                    price: analysisData.propertyDetails.price.toLocaleString(),
                  })}
                </span>
                <span>•</span>
                <span className="font-medium">
                  {t("analysis.totalSize", {
                    size: analysisData.propertyDetails.size,
                  })}
                </span>
                <span>•</span>
                <span className="font-medium">
                  {t("analysis.built", {
                    year: analysisData.propertyDetails.yearBuilt,
                  })}
                </span>
              </div>
            </div>
          )}

          <Card className="mb-6 border-gray-200 dark:border-[#374151] bg-white dark:bg-[#1F2937]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-[#F9FAFB]">
                <Eye className="w-5 h-5 text-gray-600 dark:text-[#D1D5DB] flex-shrink-0" />
                {t("analysis.keyFindingsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-green-700 dark:text-green-300 text-lg font-semibold">
                      {t("analysis.strongSellingPoints")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {analysisData?.strongPoints?.map((point, idx) => {
                      const spTitle =
                        typeof point === "string" ? point : point.title;
                      const spDescription =
                        typeof point === "string" ? "" : point.description;
                      return (
                        <div
                          key={idx}
                          className="bg-green-50 dark:bg-green-950/20 p-3 rounded border border-green-200 dark:border-green-800/50"
                        >
                          <div className="flex items-start gap-2 text-green-800 dark:text-green-200">
                            <CheckCircle className="w-5 h-5 text-green-800 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="font-bold text-green-900 dark:text-green-100">
                                {spTitle}
                              </div>
                              {spDescription && (
                                <div className="text-black dark:text-[#D1D5DB] mt-1">
                                  {spDescription}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <span className="text-red-700 dark:text-red-300 text-lg font-semibold">
                      {t("analysis.areasOfConcern")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {analysisData?.concerns?.map((concern, idx) => {
                      const concernTitle =
                        typeof concern === "string" ? concern : concern.title;
                      const concernDescription =
                        typeof concern === "string" ? "" : concern.description;
                      return (
                        <div
                          key={idx}
                          className="bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-800/50"
                        >
                          <div className="flex items-start gap-2 text-red-800 dark:text-red-200">
                            <Info className="w-5 h-5 text-red-800 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="font-bold text-red-900 dark:text-red-100">
                                {concernTitle}
                              </div>
                              {concernDescription && (
                                <div className="text-black dark:text-[#D1D5DB] mt-1">
                                  {concernDescription}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {analysisData?.bottomLine && (
            <Alert className="mb-6 border-yellow-200 dark:border-yellow-800/50 bg-yellow-50 dark:bg-yellow-950/20">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription>
                <strong className="text-yellow-700 dark:text-[#FBBF24]">
                  {t("analysis.bottomLine")}
                </strong>{" "}
                <span className="text-[#b3621d] dark:text-[#ffc657]">
                  {analysisData.bottomLine}
                </span>
              </AlertDescription>
            </Alert>
          )}

          <Separator className="my-8 dark:bg-[#374151]" />

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-pdf-exclude="true"
          >
            <Button
              onClick={() => {
                localStorage.removeItem("analysisResult");
                localStorage.removeItem("analysisError");
                localStorage.removeItem("analysisErrorType");
                router.push("/");
              }}
              size="lg"
              variant="outline"
              className="px-8 border-yellow-200 dark:border-[#CA8A04] text-yellow-700 dark:text-[#FBBF24] hover:bg-yellow-50 dark:hover:bg-[#374151]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("analysis.goBackHomeButton")}
            </Button>
            <Button
              onClick={() => setShowAnalyzeUpload(true)}
              size="lg"
              className="bg-yellow-500 hover:bg-[#FACC15] text-white dark:text-[#111827] px-8"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t("analysis.analyzeAnotherButton")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-yellow-200 dark:border-[#CA8A04] text-yellow-700 dark:text-[#FBBF24] hover:bg-yellow-50 dark:hover:bg-[#374151]"
              onClick={() => analysisData && downloadAsPDF(analysisData, t)}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("analysis.downloadPdfButton")}
            </Button>
          </div>

          <Separator className="my-8 dark:bg-[#374151]" />

          {/* Show upload section when user clicks "Analyze Another Document" */}
          {showAnalyzeUpload && (
            <div className="mb-8">
              <FileUploadSection
                showTitle={false}
                containerWidth="full"
                onAnalysisStart={() => {
                  setShowAnalyzeUpload(false);
                  setIsLoading(true);
                }}
                onAnalysisComplete={() => {
                  setIsLoading(false);
                }}
              />
            </div>
          )}
          {isDev && (
            <Card
              className="border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20"
              data-pdf-exclude="true"
            >
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-300 text-lg">
                  {t("analysis.debugTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                      {t("analysis.rawAnalysisData")}
                    </h4>
                    <pre className="bg-white dark:bg-[#111827] p-3 rounded border text-xs overflow-x-auto max-h-60 dark:text-[#D1D5DB]">
                      {JSON.stringify(analysisData, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    );
  }

  // Render summary fallback (when AI didn't return structured JSON)
  if (summaryData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white dark:from-[#111827] dark:to-[#1F2937]">
        <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#111827]/85 backdrop-blur-sm border-b border-gray-200/30 dark:border-[#374151]/50 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-[#F9FAFB]">
                PropertyWise
              </span>
            </button>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <PropertyListingBadge />
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8 pt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-[#F9FAFB] flex items-center">
              <MapPin className="w-7 h-7 mr-3 text-yellow-600 dark:text-[#FBBF24]" />
              {t("summary.propertyAnalysisReportTitle")}
            </h1>
          </div>

          <Alert className="mb-6 border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/20">
            <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <strong>{t("summary.limitedAnalysisTitle")}</strong>{" "}
              {t("summary.limitedAnalysisMessage")}
            </AlertDescription>
          </Alert>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <Info className="w-5 h-5" />
              <span className="font-medium">
                {t("summary.dataSourceLabel")} {dataSource}
              </span>
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              {t("summary.formatLabel")}
            </div>
          </div>

          <Card className="mb-6 dark:bg-[#1F2937] dark:border-[#374151]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-[#F9FAFB]">
                <FileText className="w-5 h-5" />
                {t("summary.propertySummaryTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-[#D1D5DB] leading-relaxed whitespace-pre-wrap">
                  {summaryData}
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="mb-6 border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/20">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>{t("summary.tipTitle")}</strong> {t("summary.tipMessage")}
            </AlertDescription>
          </Alert>

          <Separator className="my-8 dark:bg-[#374151]" />

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-pdf-exclude="true"
          >
            <Button
              onClick={() => {
                localStorage.removeItem("analysisResult");
                localStorage.removeItem("analysisError");
                localStorage.removeItem("analysisErrorType");
                router.push("/");
              }}
              size="lg"
              variant="outline"
              className="px-8 border-yellow-200 dark:border-[#CA8A04] text-yellow-700 dark:text-[#FBBF24] hover:bg-yellow-50 dark:hover:bg-[#374151]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("summary.goBackHomeButton")}
            </Button>
            <Button
              onClick={() => setShowAnalyzeUpload(true)}
              size="lg"
              className="bg-yellow-500 hover:bg-[#FACC15] text-white dark:text-[#111827] px-8"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t("summary.analyzeAnotherButton")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-yellow-200 dark:border-[#CA8A04] text-yellow-700 dark:text-[#FBBF24] hover:bg-yellow-50 dark:hover:bg-[#374151] opacity-50 cursor-not-allowed"
              onClick={() => {
                // For summary data, we can't generate a proper PDF since we don't have structured data
                toast.error(t("summary.pdfNotAvailableMessage"));
              }}
              disabled={true}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("summary.downloadPdfButton")}
            </Button>
          </div>

          <Separator className="my-8 dark:bg-[#374151]" />

          {/* Show upload section when user clicks "Analyze Another Document" */}
          {showAnalyzeUpload && (
            <div className="mb-8">
              <FileUploadSection
                showTitle={false}
                containerWidth="full"
                onAnalysisStart={() => {
                  setShowAnalyzeUpload(false);
                  setIsLoading(true);
                }}
                onAnalysisComplete={() => {
                  setIsLoading(false);
                }}
              />
            </div>
          )}
          {isDev && (
            <Card
              className="border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20"
              data-pdf-exclude="true"
            >
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-300 text-lg">
                  {t("summary.debugTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                      {t("summary.rawSummaryData")}
                    </h4>
                    <pre className="bg-white dark:bg-[#111827] p-3 rounded border text-xs overflow-x-auto max-h-60 dark:text-[#D1D5DB]">
                      {summaryData}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    );
  }

  // Fallback (should never reach here)
  return null;
}
