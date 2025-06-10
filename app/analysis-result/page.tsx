"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, ArrowLeft, FileText } from 'lucide-react';

export default function AnalysisResultPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedSummary = localStorage.getItem('analysisResult');
    const storedError = localStorage.getItem('analysisError');
    
    if (storedSummary) {
      setSummary(storedSummary);
      localStorage.removeItem('analysisResult');
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

  if (error || !summary) {
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
      <main className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-yellow-600 border-yellow-200">
            Analysis Complete
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Analysis Report</h1>
          <p className="text-lg text-gray-600">
            Here's your comprehensive property analysis powered by AI
          </p>
        </div>

        <Card className="border-2 border-yellow-200 shadow-lg">
          <CardHeader className="bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Analysis Results</CardTitle>
                <p className="text-gray-600">Based on your uploaded property documents</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {summary}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
