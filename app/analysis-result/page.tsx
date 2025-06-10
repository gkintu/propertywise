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
  AlertCircle,
  Bed,
  Square,
  Calendar,
  DollarSign
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
        localStorage.removeItem('analysisResult');
      } catch {
        // Fallback to treating it as plain text summary
        setSummary(storedAnalysis);
        localStorage.removeItem('analysisResult');
      }
    } else if (storedError) {
      setError(storedError);
      localStorage.removeItem('analysisError');
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
              <FileText className="w-8 h-8 text-yellow-600" />
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
                onClick={() => router.push('/')} 
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
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('Property Report Summary:') || trimmedLine.includes('Property:')) {
        result.propertyTitle = trimmedLine.replace(/Property Report Summary:|Property:|#/g, '').trim();
      } else if (trimmedLine.includes('Market Position:')) {
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

    // Fallback: if no structured data found, try to extract key information
    if (result.strongPoints.length === 0 && result.concerns.length === 0) {
      const keywords = {
        positive: ['good', 'excellent', 'strong', 'advantage', 'benefit', 'positive', 'upgraded', 'renovated', 'modern'],
        negative: ['concern', 'issue', 'problem', 'damage', 'repair', 'replace', 'old', 'outdated', 'alert']
      };

      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (keywords.positive.some(word => lowerLine.includes(word))) {
          result.strongPoints.push(line.trim());
        } else if (keywords.negative.some(word => lowerLine.includes(word))) {
          result.concerns.push(line.trim());
        }
      }
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
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
                  <p className="text-gray-600">Based on your uploaded property documents</p>
                </div>
              </div>
            </div>

            {/* Property Summary */}
            <Card className="mb-6 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-xl">
                    Property Report Summary: {analysisData.propertyDetails.address}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-3">Market Position:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800">{analysisData.propertyDetails.price.toLocaleString()} NOK</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800">{analysisData.propertyDetails.bedrooms} bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800">{analysisData.propertyDetails.size} sqm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800">Built {analysisData.propertyDetails.yearBuilt}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      {analysisData.strongPoints.length > 0 ? (
                        analysisData.strongPoints.map((point, index) => (
                          <Alert key={index} className="border-green-200 bg-green-50">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              <strong>{point.title}:</strong> {point.description}
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
                      {analysisData.concerns.length > 0 ? (
                        analysisData.concerns.map((concern, index) => (
                          <Alert key={index} className="border-red-200 bg-red-50">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                              <strong>{concern.title}:</strong> {concern.description}
                              {concern.estimatedCost && (
                                <div className="text-sm mt-1">
                                  <strong>Estimated cost:</strong> {concern.estimatedCost}
                                </div>
                              )}
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
                onClick={() => router.push('/')} 
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
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
                  <p className="text-gray-600">Based on your uploaded property documents</p>
                </div>
              </div>
            </div>

            {/* Property Summary */}
            <Card className="mb-6 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-xl">
                    {parsedData.propertyTitle || 'Property Report Summary'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {parsedData.marketPosition && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Market Position:</p>
                    <p className="text-blue-800">{parsedData.marketPosition}</p>
                  </div>
                )}
              </CardContent>
            </Card>

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
                onClick={() => router.push('/')} 
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
          </main>
        </div>
      );
    }
    
    return null;
  };

  return renderContent();
}
