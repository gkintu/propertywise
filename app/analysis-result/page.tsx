"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation'; // Corrected import
import { Button } from '@/components/ui/button';

export default function AnalysisResultPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedSummary = localStorage.getItem('analysisResult');
    if (storedSummary) {
      setSummary(storedSummary);
      // Optional: Clear the item from localStorage after reading it
      // localStorage.removeItem('analysisResult');
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading analysis results...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-red-600">Analysis Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-6">
              No analysis result was found. This might happen if you navigated to this page directly or if there was an issue retrieving the result.
            </p>
            <Button onClick={() => router.push('/')} className="bg-purple-600 hover:bg-purple-700">
              Go Back to Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <main className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 text-center">Property Analysis Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none whitespace-pre-wrap">
              {summary}
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 text-center">
          <Button onClick={() => router.push('/')} className="bg-purple-600 hover:bg-purple-700">
            Analyze Another Document
          </Button>
        </div>
      </main>
    </div>
  );
}
