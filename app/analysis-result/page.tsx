"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Home as HomeIcon, 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  MapPin,
  Eye,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { PropertyAnalysis, AnalysisResponse } from '@/lib/types';

export default function AnalysisResultPage() {
  const [analysisData, setAnalysisData] = useState<PropertyAnalysis | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAnalysis = localStorage.getItem('analysisResult');
    const storedError = localStorage.getItem('analysisError');
    
    if (storedAnalysis) {
      try {
        const parsed: AnalysisResponse = JSON.parse(storedAnalysis);
        if (parsed.analysis) {
          setAnalysisData(parsed.analysis);
        } else if (parsed.summary) {
          setSummary(parsed.summary);
        }
        // Keep the analysis result in localStorage for page refreshes
        // Only remove it when user explicitly goes back to upload or uploads new document
      } catch {
        // Fallback to treating it as plain text summary
        setSummary(storedAnalysis);
      }
    } else if (storedError) {
      setError(storedError);
      // Keep error in localStorage as well for consistency
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-gray-200/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PropertyWise</span>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
              🏡 List your property? Get instant valuation →
            </Badge>
          </div>
        </header>
        
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileText className="w-12 h-12 text-yellow-600" />
            </div>
            <p className="text-xl text-gray-600">Loading analysis results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!summary && !analysisData)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-gray-200/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PropertyWise</span>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
              🏡 List your property? Get instant valuation →
            </Badge>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="w-full max-w-2xl border-2 border-yellow-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">
                {error ? 'Analysis Failed' : 'Analysis Not Found'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 mb-6">
                {error || 'No analysis result was found. This might happen if you navigated to this page directly or if there was an issue retrieving the result.'}
              </p>
              <Button 
                onClick={() => {
                  // Clear analysis results when user explicitly chooses to analyze another document
                  localStorage.removeItem('analysisResult');
                  localStorage.removeItem('analysisError');
                  router.push('/');
                }} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back to Upload
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Parse the summary to extract structured data for fallback rendering
  const parseAnalysisResult = (summary: string) => {
    const lines = summary.split('\n');
    const result = {
      propertyTitle: '',
      marketPosition: '',
      strongPoints: [] as string[],
      concerns: [] as string[],
      bottomLine: ''
    };

    let currentSection = '';
    
    // Try to extract property title from the first few meaningful lines
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const trimmedLine = lines[i].trim();
      if (trimmedLine && !result.propertyTitle) {
        // Look for JSON-like address pattern first
        const addressMatch = trimmedLine.match(/"address":\s*"([^"]+)"/);
        if (addressMatch) {
          result.propertyTitle = addressMatch[1];
          break;
        }
        
        // Look for address patterns, property titles, or meaningful headers
        if (trimmedLine.includes('Property Report Summary:') || 
            trimmedLine.includes('Property:') ||
            trimmedLine.includes('Address:') ||
            trimmedLine.includes('Property Analysis') ||
            (trimmedLine.length > 10 && trimmedLine.length < 100 && 
             (trimmedLine.includes('gate') || trimmedLine.includes('vei') || 
              trimmedLine.includes('street') || trimmedLine.includes('Avenue') ||
              /\d+/.test(trimmedLine)))) {
          result.propertyTitle = trimmedLine
            .replace(/Property Report Summary:|Property:|Address:|Property Analysis|#/g, '')
            .trim();
          break;
        }
      }
    }
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('Market Position:')) {
        result.marketPosition = trimmedLine.replace('Market Position:', '').trim();
      } else if (trimmedLine.includes('Strong Selling Points') || trimmedLine.includes('Strengths')) {
        currentSection = 'strengths';
      } else if (trimmedLine.includes('Areas of Concern') || trimmedLine.includes('Concerns')) {
        currentSection = 'concerns';
      } else if (trimmedLine.includes('Bottom Line') || trimmedLine.includes('Conclusion')) {
        currentSection = 'bottomLine';
      } else if (trimmedLine.includes('Broker') && trimmedLine.includes('Bottom Line')) {
        currentSection = 'bottomLine';
      } else if (trimmedLine && currentSection === 'strengths' && (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.includes('✓'))) {
        result.strongPoints.push(trimmedLine.replace(/^[-•✓]\s*/, ''));
      } else if (trimmedLine && currentSection === 'concerns' && (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.includes('⚠'))) {
        result.concerns.push(trimmedLine.replace(/^[-•⚠]\s*/, ''));
      } else if (trimmedLine && currentSection === 'bottomLine') {
        result.bottomLine += trimmedLine + ' ';
      }
    }

    // Enhanced parsing for JSON-like content
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip JSON structure lines
      if (trimmedLine.match(/^"(strongPoints|concerns|address|title|description|bottomLine|summary)":\s*[\[\{"]?$/)) {
        continue;
      }
      
      // Extract values from JSON key-value pairs
      const jsonValueMatch = trimmedLine.match(/^"[^"]*":\s*"([^"]+)"[,}]?$/);
      if (jsonValueMatch) {
        const value = jsonValueMatch[1];
        const lowerValue = value.toLowerCase();
        
        // Skip summary/overview statements that contain multiple concepts or pricing
        if (lowerValue.includes('however') || lowerValue.includes('prospective buyers') ||
            lowerValue.includes('good opportunity') || lowerValue.includes('nok') ||
            lowerValue.includes('built in') || lowerValue.includes('apartment') ||
            lowerValue.includes('first-time buyer') || lowerValue.includes('take note') ||
            value.length > 100 || // Skip very long descriptions that are likely summaries
            (lowerValue.includes('but') && lowerValue.includes('should'))) {
          continue;
        }
        
        // Categorize based on specific, focused content
        if ((lowerValue.includes('upgraded') || lowerValue.includes('modern') || lowerValue.includes('good') || 
            lowerValue.includes('excellent') || lowerValue.includes('benefit') || lowerValue.includes('advantage') ||
            lowerValue.includes('storage') || lowerValue.includes('renovated')) &&
            !lowerValue.includes('however') && !lowerValue.includes('but') && !lowerValue.includes('should') &&
            value.length < 80) { // Keep only focused, specific points
          result.strongPoints.push(value);
        } else if ((lowerValue.includes('cracked') || lowerValue.includes('punctured') || lowerValue.includes('pest') ||
                   lowerValue.includes('alert') || lowerValue.includes('damage') || 
                   (lowerValue.includes('window') && lowerValue.includes('replacement'))) &&
                   !lowerValue.includes('however') && !lowerValue.includes('should budget') &&
                   value.length < 80) { // Keep only specific issues, not general advice
          result.concerns.push(value);
        }
        continue;
      }
    }

    // Fallback: if no structured data found, try to extract key information
    if (result.strongPoints.length === 0 && result.concerns.length === 0) {
      const keywords = {
        positive: ['good', 'excellent', 'strong', 'advantage', 'benefit', 'positive', 'upgraded', 'renovated', 'modern'],
        negative: ['concern', 'issue', 'problem', 'damage', 'repair', 'replace', 'old', 'outdated', 'alert']
      };

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip JSON structure lines
        if (trimmedLine.match(/^[\{\}]$/) || 
            trimmedLine.match(/^"[^"]*":\s*[\[\{"]?$/) ||
            trimmedLine.match(/^\]?\s*[,}]?$/)) {
          continue;
        }
        
        // Clean the line from JSON artifacts
        const cleanedLine = trimmedLine
          .replace(/^"[^"]*":\s*"?/, '') // Remove "key": "
          .replace(/"?\s*,?\s*$/, '') // Remove trailing ", 
          .replace(/^["']|["']$/g, '') // Remove quotes
          .trim();
        
        if (cleanedLine.length < 5) continue;
        
        // Skip summary/overview statements
        const lowerCleaned = cleanedLine.toLowerCase();
        if (lowerCleaned.includes('however') || lowerCleaned.includes('prospective buyers') ||
            lowerCleaned.includes('good opportunity') || lowerCleaned.includes('nok') ||
            lowerCleaned.includes('built in') || lowerCleaned.includes('apartment') ||
            lowerCleaned.includes('first-time buyer') || lowerCleaned.includes('take note') ||
            cleanedLine.length > 100 || // Skip very long descriptions
            (lowerCleaned.includes('but') && lowerCleaned.includes('should'))) {
          continue;
        }
        
        // Only categorize specific, focused points
        if (keywords.positive.some(word => lowerCleaned.includes(word)) &&
            !lowerCleaned.includes('however') && !lowerCleaned.includes('but') &&
            cleanedLine.length < 80) {
          result.strongPoints.push(cleanedLine);
        } else if (keywords.negative.some(word => lowerCleaned.includes(word)) &&
                   !lowerCleaned.includes('should budget') && !lowerCleaned.includes('however') &&
                   cleanedLine.length < 80) {
          result.concerns.push(cleanedLine);
        }
      }
    }

    // If still no property title found, use the first meaningful line as fallback
    if (!result.propertyTitle) {
      const firstMeaningfulLine = lines.find(line => {
        const trimmed = line.trim();
        return trimmed.length > 5 && 
               !trimmed.toLowerCase().includes('summary') &&
               !trimmed.toLowerCase().includes('analysis') &&
               !trimmed.toLowerCase().includes('report') &&
               !trimmed.toLowerCase().includes('property') &&
               !trimmed.startsWith('{') &&
               !trimmed.startsWith('"');
      });
      if (firstMeaningfulLine) {
        let cleaned = firstMeaningfulLine.trim();
        // Remove any JSON-like formatting
        cleaned = cleaned.replace(/^"[^"]*":\s*"?/, '').replace(/"?\s*,?\s*$/, '');
        result.propertyTitle = cleaned.substring(0, 80); // Limit length
      }
    }

    // Final cleanup of property title to remove any remaining JSON artifacts
    if (result.propertyTitle) {
      result.propertyTitle = result.propertyTitle
        .replace(/^"[^"]*":\s*"?/, '') // Remove "key": " at start
        .replace(/"?\s*,?\s*$/, '') // Remove ", at end
        .replace(/^["']|["']$/g, '') // Remove quotes
        .trim();
    }

    return result;
  };

  // Render with structured data if available, otherwise parse from summary
  const renderContent = () => {
    if (analysisData) {
      // Render structured data
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-gray-200/30 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PropertyWise</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                🏡 List your property? Get instant valuation →
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto max-w-6xl py-8 px-4">
            {/* Property Report Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Property Report Summary: {analysisData.propertyDetails.address}
                </h1>
              </div>
              
              {/* Market Position Bar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Market Position:</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-blue-800">
                  <span className="font-medium">
                    {analysisData.propertyDetails.bedrooms}-room {analysisData.propertyDetails.propertyType} priced at {analysisData.propertyDetails.price.toLocaleString()} NOK
                  </span>
                  <span>•</span>
                  <span>{analysisData.propertyDetails.size} sqm total</span>
                  <span>•</span>
                  <span>Built {analysisData.propertyDetails.yearBuilt}</span>
                </div>
              </div>
            </div>

            {/* Broker's Key Findings */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-xl">Broker&apos;s Key Findings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strong Selling Points */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-700">Strong Selling Points</h3>
                    </div>
                    <div className="space-y-3">
                      {analysisData.strongPoints && analysisData.strongPoints.length > 0 ? (
                        analysisData.strongPoints.map((point, index) => (
                          <Alert key={index} className="border-green-200 bg-green-50">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              {typeof point === 'string' ? point : (
                                <>
                                  {point.title && <strong>{point.title}:</strong>} {point.description || point.title}
                                </>
                              )}
                            </AlertDescription>
                          </Alert>
                        ))
                      ) : (
                        <Alert className="border-green-200 bg-green-50">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            No specific strong points identified
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  {/* Areas of Concern */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-semibold text-red-700">Areas of Concern</h3>
                    </div>
                    <div className="space-y-3">
                      {analysisData.concerns && analysisData.concerns.length > 0 ? (
                        analysisData.concerns.map((concern, index) => (
                          <Alert key={index} className="border-red-200 bg-red-50">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                              {typeof concern === 'string' ? concern : (
                                <>
                                  {concern.title && <strong>{concern.title}:</strong>} {concern.description || concern.title}
                                  {concern.estimatedCost && (
                                    <div className="text-sm mt-1">
                                      <strong>Estimated cost:</strong> {concern.estimatedCost}
                                    </div>
                                  )}
                                </>
                              )}
                            </AlertDescription>
                          </Alert>
                        ))
                      ) : (
                        <Alert className="border-gray-200 bg-gray-50">
                          <AlertCircle className="w-4 h-4 text-gray-600" />
                          <AlertDescription className="text-gray-800">
                            No major concerns identified
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Section */}
            {analysisData.summary && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Analysis Summary
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

            {/* Broker's Bottom Line */}
            {analysisData.bottomLine && (
              <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Broker&apos;s Bottom Line:</strong> {analysisData.bottomLine}
                </AlertDescription>
              </Alert>
            )}

            <Separator className="my-8" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  // Clear analysis results when user explicitly chooses to analyze another document
                  localStorage.removeItem('analysisResult');
                  localStorage.removeItem('analysisError');
                  router.push('/');
                }} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Analyze Another Document
              </Button>
              <Button 
                variant="outline" 
                className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 px-8"
                onClick={() => window.print()}
              >
                <FileText className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>

            {/* Debug Section - Raw Data (TODO: Remove before deployment) */}
            <Separator className="my-8" />
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700 text-lg">🚧 Debug Data (Remove before deployment)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Raw Summary:</h4>
                    <pre className="bg-white p-3 rounded border text-xs overflow-x-auto max-h-60">
                      {summary}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      );
    } else if (summary) {
      // Fallback to parsed summary data
      const parsedData = parseAnalysisResult(summary);
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-gray-200/30 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PropertyWise</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                🏡 List your property? Get instant valuation →
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto max-w-6xl py-8 px-4">
            {/* Property Report Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  {parsedData.propertyTitle || 'Property Report Summary'}
                </h1>
              </div>
              
              {/* Market Position Bar */}
              {parsedData.marketPosition && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Market Position:</p>
                  <p className="text-sm text-blue-800">{parsedData.marketPosition}</p>
                </div>
              )}
            </div>

            {/* Broker's Key Findings */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-xl">Broker&apos;s Key Findings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strong Selling Points */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-700">Strong Selling Points</h3>
                    </div>
                    <div className="space-y-3">
                      {parsedData.strongPoints.length > 0 ? (
                        parsedData.strongPoints.map((point, index) => (
                          <Alert key={index} className="border-green-200 bg-green-50">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              {point}
                            </AlertDescription>
                          </Alert>
                        ))
                      ) : (
                        <Alert className="border-green-200 bg-green-50">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Property analysis completed successfully
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  {/* Areas of Concern */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-semibold text-red-700">Areas of Concern</h3>
                    </div>
                    <div className="space-y-3">
                      {parsedData.concerns.length > 0 ? (
                        parsedData.concerns.map((concern, index) => (
                          <Alert key={index} className="border-red-200 bg-red-50">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                              {concern}
                            </AlertDescription>
                          </Alert>
                        ))
                      ) : (
                        <Alert className="border-gray-200 bg-gray-50">
                          <AlertCircle className="w-4 h-4 text-gray-600" />
                          <AlertDescription className="text-gray-800">
                            No major concerns identified in the analysis
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Broker's Bottom Line */}
            {parsedData.bottomLine && (
              <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Broker&apos;s Bottom Line:</strong> {parsedData.bottomLine.trim()}
                </AlertDescription>
              </Alert>
            )}

            {/* Full Analysis (Fallback) */}
            {(!parsedData.strongPoints.length && !parsedData.concerns.length) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Complete Analysis Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {summary}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator className="my-8" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  // Clear analysis results when user explicitly chooses to analyze another document
                  localStorage.removeItem('analysisResult');
                  localStorage.removeItem('analysisError');
                  router.push('/');
                }} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Analyze Another Document
              </Button>
              <Button 
                variant="outline" 
                className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 px-8"
                onClick={() => window.print()}
              >
                <FileText className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>

            {/* Debug Section - Raw Data (TODO: Remove before deployment) */}
            <Separator className="my-8" />
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700 text-lg">🚧 Debug Data (Remove before deployment)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Raw Summary:</h4>
                    <pre className="bg-white p-3 rounded border text-xs overflow-x-auto max-h-60">
                      {summary}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      );
    }
    
    return null;
  };

  return renderContent();
}
