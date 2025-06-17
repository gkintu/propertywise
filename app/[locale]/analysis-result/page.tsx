"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '@/components/locale/LocaleSwitcher';
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
  Download
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { PropertyAnalysis } from '@/lib/types';

// Helper function to extract JSON from text that might be wrapped in markdown or have extra formatting
function tryExtractJsonFromText(text: string): PropertyAnalysis | null {
  try {
    // First try parsing directly
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && (parsed.propertyDetails || parsed.strongPoints || parsed.concerns)) {
      return parsed as PropertyAnalysis;
    }
  } catch {
    // If direct parsing fails, try to extract JSON from markdown code blocks or other formatting
  }

  // Remove common markdown formatting
  let cleanedText = text;
  
  // Remove markdown code blocks
  cleanedText = cleanedText.replace(/```json\s*/gi, '').replace(/```\s*$/g, '');
  cleanedText = cleanedText.replace(/```\s*/g, '');
  
  // Remove leading/trailing quotes and other formatting
  cleanedText = cleanedText.replace(/^["'`]+|["'`]+$/g, '');
  cleanedText = cleanedText.trim();
  
  // Try to find JSON-like structure in the text
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed && typeof parsed === 'object' && (parsed.propertyDetails || parsed.strongPoints || parsed.concerns)) {
        return parsed as PropertyAnalysis;
      }
    } catch (e) {
      console.log('Failed to parse extracted JSON:', e);
    }
  }
  
  return null;
}

// PDF download function using html2canvas-pro
async function downloadAsPDF() {
  try {
    // Wait a bit to ensure DOM is fully loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find the main content area to capture
    const element = document.querySelector('main') as HTMLElement;
    if (!element) {
      console.error('Main element not found');
      alert('Unable to find content to export. Please try again.');
      return;
    }

    console.log('Element found:', element);
    console.log('Element dimensions:', element.offsetWidth, 'x', element.offsetHeight);

    // Create a wrapper div to capture only the content we want
    const contentDiv = document.createElement('div');
    contentDiv.style.position = 'absolute';
    contentDiv.style.left = '-9999px';
    contentDiv.style.top = '0';
    contentDiv.style.width = element.offsetWidth + 'px';
    contentDiv.style.backgroundColor = 'white';
    contentDiv.style.padding = '20px';
    
    // Clone the main content without excluded elements
    const clonedMain = element.cloneNode(true) as HTMLElement;
    
    // Remove excluded elements
    const excludedElements = clonedMain.querySelectorAll('[data-pdf-exclude="true"]');
    excludedElements.forEach(el => el.remove());
    
    // Remove buttons that contain specific text
    const allButtons = clonedMain.querySelectorAll('button');
    allButtons.forEach(button => {
      const text = button.textContent || '';
      if (text.includes('Download PDF') || text.includes('Analyze Another Document')) {
        button.remove();
      }
    });
    
    // Remove debug cards
    const debugCards = clonedMain.querySelectorAll('.border-red-200');
    debugCards.forEach(card => card.remove());
    
    contentDiv.appendChild(clonedMain);
    document.body.appendChild(contentDiv);

    // Use html2canvas-pro to capture the content
    const canvas = await html2canvas(contentDiv, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: true,
      imageTimeout: 15000,
      width: contentDiv.offsetWidth,
      height: contentDiv.offsetHeight,
      foreignObjectRendering: false
    });

    // Remove the temporary div
    document.body.removeChild(contentDiv);

    // Create PDF with jsPDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png', 0.8);
    
    // Calculate dimensions to fit the page
    const imgWidth = 190; // A4 width in mm with margins
    const pageHeight = 277; // A4 height in mm with margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 10; // Start with 10mm margin
    
    // Add the image to PDF
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Download the PDF
    const propertyAddress = document.querySelector('h1')?.textContent
      ?.replace('Property Analysis', '')
      ?.replace(/[^a-zA-Z0-9\s]/g, '')
      ?.trim() || 'Property';
    
    const filename = `${propertyAddress}_Analysis_Report.pdf`;
    pdf.save(filename);
    
    console.log('PDF generated successfully:', filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
}

export default function AnalysisResultPage() {
  const t = useTranslations('AnalysisResult');
  const [analysisData, setAnalysisData] = useState<PropertyAnalysis | null>(null);
  const [summaryData, setSummaryData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const storedAnalysis = localStorage.getItem('analysisResult');
    const storedError = localStorage.getItem('analysisError');
    
    if (storedAnalysis && storedAnalysis !== 'undefined' && storedAnalysis !== 'null') {
      try {
        const parsed = JSON.parse(storedAnalysis);
        console.log('📊 Parsed data structure:', parsed);
        
        // Check if it's an AnalysisResponse wrapper or direct PropertyAnalysis
        if (parsed.analysis && typeof parsed.analysis === 'object') {
          // It's wrapped in AnalysisResponse from API - PREFERRED FORMAT
          console.log('✅ Loading wrapped AnalysisResponse data', {
            strongPoints: parsed.analysis.strongPoints?.length || 0,
            concerns: parsed.analysis.concerns?.length || 0,
            hasPropertyDetails: !!parsed.analysis.propertyDetails
          });
          setAnalysisData(parsed.analysis);
          setDataSource('API Response (structured JSON)');
        } else if (parsed.propertyDetails && (parsed.strongPoints || parsed.concerns)) {
          // It's a direct PropertyAnalysis object - PREFERRED FORMAT
          console.log('✅ Loading direct PropertyAnalysis data', {
            strongPoints: parsed.strongPoints?.length || 0,
            concerns: parsed.concerns?.length || 0,
            hasPropertyDetails: !!parsed.propertyDetails
          });
          setAnalysisData(parsed);
          setDataSource('Direct PropertyAnalysis (structured JSON)');
        } else if (parsed.summary && typeof parsed.summary === 'string') {
          // It's a summary fallback from API when AI didn't return JSON - FALLBACK FORMAT
          console.log('⚠️ Loading summary fallback data (AI did not return structured JSON)');
          
          // Try to extract JSON from the summary if it contains structured data
          const cleanedSummary = tryExtractJsonFromText(parsed.summary);
          if (cleanedSummary) {
            console.log('✅ Successfully extracted structured data from summary text');
            setAnalysisData(cleanedSummary);
            setDataSource('Extracted from summary text (structured JSON)');
          } else {
            setSummaryData(parsed.summary);
            setDataSource('Summary fallback (AI returned text instead of JSON)');
          }
        } else {
          // Try to parse the raw stored analysis as JSON if it looks like structured data
          const directParsed = tryExtractJsonFromText(storedAnalysis);
          if (directParsed) {
            console.log('✅ Successfully extracted structured data from raw stored analysis');
            setAnalysisData(directParsed);
            setDataSource('Extracted from raw analysis (structured JSON)');
          } else {
            // No valid data found
            console.log('❌ No structured data found in:', parsed);
            setError('No valid analysis data found. The API may have returned an unexpected format.');
            setDataSource('Unknown format');
          }
        }
      } catch (parseError) {
        console.error('❌ Error parsing analysis result:', parseError);
        
        // If parsing fails, try to extract JSON directly from the stored analysis
        const directParsed = tryExtractJsonFromText(storedAnalysis);
        if (directParsed) {
          console.log('✅ Successfully extracted structured data from unparseable stored analysis');
          setAnalysisData(directParsed);
          setDataSource('Extracted from raw text (structured JSON)');
        } else {
          setError('Invalid analysis result format');
          setDataSource('Parse Error');
        }
      }
    } else if (storedError && storedError !== 'undefined' && storedError !== 'null') {
      setError(storedError);
      setDataSource('Stored Error');
    } else {
      // No valid data found
      setError('No analysis result found. Please upload and analyze a document first.');
      setDataSource('No Data');
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-gray-200/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => router.push('/')} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PropertyWise</span>
            </button>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                {t('headerBadge')}
              </Badge>
            </div>
          </div>
        </header>
        
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileText className="w-12 h-12 text-yellow-600" />
            </div>
            <p className="text-xl text-gray-600">{t('loading.loadingText')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!analysisData && !summaryData)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-gray-200/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => router.push('/')} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PropertyWise</span>
            </button>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                {t('headerBadge')}
              </Badge>
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="w-full max-w-2xl border-2 border-yellow-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">
                {error ? t('error.analysisFailedTitle') : t('error.analysisNotFoundTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 mb-6">
                {error || t('error.noResultMessage')}
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-700 mb-2">{t('error.debugInfo')}</h4>
                <p className="text-sm text-gray-600">{t('error.dataSource')} {dataSource}</p>
                <p className="text-sm text-gray-600">{t('error.expected')}</p>
              </div>

              <Button 
                onClick={() => {
                  localStorage.removeItem('analysisResult');
                  localStorage.removeItem('analysisError');
                  router.push('/');
                }} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('error.goBackButton')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render structured data (preferred)
  if (analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-gray-200/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => router.push('/')} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PropertyWise</span>
            </button>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                {t('headerBadge')}
              </Badge>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8 pt-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-7 h-7 mr-3 text-yellow-600" />
              {analysisData?.propertyDetails?.address || t('analysis.propertyAnalysisTitle')}
            </h1>
          </div>

          {analysisData?.summary && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('analysis.analysisSummaryTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {analysisData.summary}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisData?.propertyDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm font-medium text-blue-900 mb-2">{t('analysis.marketPosition')}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-800">
                <span className="font-medium">
                  {analysisData.propertyDetails.bedrooms}{t('analysis.roomPropertyPriced', {
                    propertyType: analysisData.propertyDetails.propertyType,
                    price: analysisData.propertyDetails.price.toLocaleString()
                  })}
                </span>
                <span>•</span>
                <span>{t('analysis.totalSize', { size: analysisData.propertyDetails.size })}</span>
                <span>•</span>
                <span>{t('analysis.built', { year: analysisData.propertyDetails.yearBuilt })}</span>
              </div>
            </div>
          )}

          <Card className="mb-6 border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-600 flex-shrink-0" />
                {t('analysis.keyFindingsTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-green-700 text-lg font-semibold">{t('analysis.strongSellingPoints')}</span>
                  </div>
                  <div className="space-y-2">
                    {analysisData?.strongPoints?.map((point, idx) => {
                      const title = typeof point === 'string' ? point : point.title;
                      const description = typeof point === 'string' ? '' : point.description;
                      return (
                        <div key={idx} className="bg-green-50 p-3 rounded border border-green-200">
                          <div className="flex items-start gap-2 text-green-800">
                            <CheckCircle className="w-5 h-5 text-green-800 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="font-bold text-green-900">{title}</div>
                              {description && (
                                <div className="text-black mt-1">{description}</div>
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
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-700 text-lg font-semibold">{t('analysis.areasOfConcern')}</span>
                  </div>
                  <div className="space-y-2">
                    {analysisData?.concerns?.map((concern, idx) => {
                      const title = typeof concern === 'string' ? concern : concern.title;
                      const description = typeof concern === 'string' ? '' : concern.description;
                      return (
                        <div key={idx} className="bg-red-50 p-3 rounded border border-red-200">
                          <div className="flex items-start gap-2 text-red-800">
                            <Info className="w-5 h-5 text-red-800 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="font-bold text-red-900">{title}</div>
                              {description && (
                                <div className="text-black mt-1">{description}</div>
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
            <Alert className="mb-6 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>{t('analysis.bottomLine')}</strong> {analysisData.bottomLine}
              </AlertDescription>
            </Alert>
          )}

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-pdf-exclude="true">
            <Button 
              onClick={() => {
                localStorage.removeItem('analysisResult');
                localStorage.removeItem('analysisError');
                router.push('/');
              }} 
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('analysis.analyzeAnotherButton')}
            </Button>
            <Button 
              variant="outline" 
              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 px-8"
              onClick={downloadAsPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              {t('analysis.downloadPdfButton')}
            </Button>
          </div>

          <Separator className="my-8" />
          <Card className="border-red-200 bg-red-50" data-pdf-exclude="true">
            <CardHeader>
              <CardTitle className="text-red-700 text-lg">{t('analysis.debugTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">{t('analysis.rawAnalysisData')}</h4>
                  <pre className="bg-white p-3 rounded border text-xs overflow-x-auto max-h-60">
                    {JSON.stringify(analysisData, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Render summary fallback (when AI didn't return structured JSON)
  if (summaryData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-gray-200/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => router.push('/')} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PropertyWise</span>
            </button>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                {t('headerBadge')}
              </Badge>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8 pt-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-7 h-7 mr-3 text-yellow-600" />
              {t('summary.propertyAnalysisReportTitle')}
            </h1>
          </div>

          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{t('summary.limitedAnalysisTitle')}</strong> {t('summary.limitedAnalysisMessage')}
            </AlertDescription>
          </Alert>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-orange-800">
              <Info className="w-5 h-5" />
              <span className="font-medium">{t('summary.dataSourceLabel')} {dataSource}</span>
            </div>
            <div className="text-sm text-orange-700 mt-1">
              {t('summary.formatLabel')}
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('summary.propertySummaryTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {summaryData}
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>{t('summary.tipTitle')}</strong> {t('summary.tipMessage')}
            </AlertDescription>
          </Alert>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-pdf-exclude="true">
            <Button 
              onClick={() => {
                localStorage.removeItem('analysisResult');
                localStorage.removeItem('analysisError');
                router.push('/');
              }} 
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('summary.tryAgainButton')}
            </Button>
            <Button 
              variant="outline" 
              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 px-8"
              onClick={downloadAsPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              {t('summary.downloadPdfButton')}
            </Button>
          </div>

          <Separator className="my-8" />
          <Card className="border-red-200 bg-red-50" data-pdf-exclude="true">
            <CardHeader>
              <CardTitle className="text-red-700 text-lg">{t('summary.debugTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">{t('summary.rawSummaryData')}</h4>
                  <pre className="bg-white p-3 rounded border text-xs overflow-x-auto max-h-60">
                    {summaryData}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Fallback (should never reach here)
  return null;
}
