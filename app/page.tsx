"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Home as HomeIcon, AlertTriangle, CheckCircle, Clock, MapPin, Bed, Bath, Car, Upload, X } from "lucide-react"
import Image from "next/image"
import { useState, useRef } from "react"
import { useRouter } from 'next/navigation'

export default function Home() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    const pdfFiles = files.filter(file => file.type === "application/pdf")
    setUploadedFiles(prev => [...prev, ...pdfFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter(file => file.type === "application/pdf")
    setUploadedFiles(prev => [...prev, ...pdfFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyzeDocuments = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one PDF file.")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", uploadedFiles[0])

    try {
      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze document")
      }

      const data = await response.json()
      localStorage.setItem('analysisResult', data.summary)
      router.push('/analysis-result')
    } catch (error) {
      console.error("Error analyzing document:", error)
      localStorage.setItem('analysisError', error instanceof Error ? error.message : "Unknown error")
      router.push('/analysis-result')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-4 py-3">
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

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="mb-12">
          <Badge variant="outline" className="mb-6 text-yellow-600 border-yellow-200">
            AI-powered property analysis
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Smart property insights
            <br />
            before you buy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get comprehensive property analysis with AI that uncovers potential issues, market trends, and investment
            opportunities in minutes.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative flex items-center bg-white border-2 border-yellow-200 rounded-full p-2 shadow-lg">
            <div className="flex-1 px-4">
              <Input
                type="text"
                placeholder="Enter property address or listing URL..."
                className="border-0 text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full">
              Get Analysis
              <Search className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4 max-w-lg mx-auto">
            PropertyWise provides detailed insights but should complement professional advice. All analyses are based on
            available data - we&apos;re not liable for any decisions made.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Risk Detection</h3>
            <p className="text-gray-600">Identify structural, legal, and financial risks before making an offer</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Analysis</h3>
            <p className="text-gray-600">Compare prices and trends with similar properties in the area</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Investment Insights</h3>
            <p className="text-gray-600">Understand potential returns and long-term value appreciation</p>
          </div>
        </div>

        {/* PDF Upload Section */}
        <section className="text-left">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Upload Property Documents</h2>
            <p className="text-lg text-gray-600 mb-8">
              Drag and drop your property PDF documents for AI analysis
            </p>
            
            <Card className={`max-w-2xl mx-auto border-2 border-dashed transition-colors ${
              dragActive ? 'border-yellow-400 bg-yellow-50' : 'border-yellow-200 hover:border-yellow-400'
            }`}>
              <CardContent 
                className="p-12"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your PDF here</h3>
                  <p className="text-gray-500 mb-4">
                    or <span 
                      className="text-yellow-600 font-medium cursor-pointer hover:text-yellow-700"
                      onClick={openFileDialog}
                    >browse files</span>
                  </p>
                  <div className="text-sm text-gray-400">
                    Supports PDF files up to 10MB
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    multiple
                    onChange={handleFileSelect}
                  />
                  
                  {/* Upload button */}
                  <Button 
                    variant="outline" 
                    className="mt-6 border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                    onClick={openFileDialog}
                  >
                    Select PDF Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded files display */}
            {uploadedFiles.length > 0 && (
              <div className="max-w-2xl mx-auto mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h4>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-red-600"
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
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-gray-500 hover:text-red-600"
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8"
                    onClick={handleAnalyzeDocuments}
                    disabled={isLoading || uploadedFiles.length === 0}
                  >
                    {isLoading ? "Analyzing..." : "Analyze Documents"}
                    <Search className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Recent Analysis Section */}
        <section className="text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Recent Property Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Property 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Modern family home"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-gray-900/80 text-white">
                  <Clock className="w-3 h-3 mr-1" />3 hours ago
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Oakwood Drive 15</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  Portland, OR 97201
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">$425,000</span>
                  <span className="text-sm text-gray-500">1,850 sq ft</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">KEY FINDINGS</div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Well-maintained HVAC system</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-700">Roof replacement needed soon</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3" />3
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3" />2
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    Good Buy
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Property 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Downtown condo"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-gray-900/80 text-white">
                  <Clock className="w-3 h-3 mr-1" />5 hours ago
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Broadway Street 42</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  Seattle, WA 98102
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">$680,000</span>
                  <span className="text-sm text-gray-500">1,200 sq ft</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">KEY FINDINGS</div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-700">High HOA fees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Excellent location score</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3" />2
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3" />2
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                    Consider
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Property 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Suburban house"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-gray-900/80 text-white">
                  <Clock className="w-3 h-3 mr-1" />1 day ago
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Maple Avenue 128</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  Austin, TX 78704
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">$520,000</span>
                  <span className="text-sm text-gray-500">2,100 sq ft</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">KEY FINDINGS</div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Recently renovated kitchen</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">Large garage and driveway</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3" />4
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3" />3
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    Great Deal
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Property 4 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Townhouse"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-gray-900/80 text-white">
                  <Clock className="w-3 h-3 mr-1" />2 days ago
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Pine Street 67</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  Denver, CO 80202
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">$395,000</span>
                  <span className="text-sm text-gray-500">1,650 sq ft</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">KEY FINDINGS</div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-700">Foundation issues detected</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Good school district</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3" />3
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3" />2
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                    Caution
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="bg-yellow-50 rounded-2xl p-12 max-w-4xl mx-auto border border-yellow-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to make informed property decisions?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of smart buyers who use PropertyWise to avoid costly mistakes and find great deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 px-8">
                Start Free Analysis
              </Button>
              <Button size="lg" variant="outline" className="px-8 border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                See Sample Report
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
