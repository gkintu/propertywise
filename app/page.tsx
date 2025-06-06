"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TriangleAlert, CircleCheck, Droplets, Home as HomeIcon, Upload, X } from "lucide-react"
import Image from "next/image"
import { useState, useRef } from "react"

export default function Home() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* HEADER */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PropertyAI</span>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            🏠 Sell property? Get quotes from agents →
          </Badge>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 text-purple-600 border-purple-200">
            AI for property buyers
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Avoid surprises
            <br />
            when buying property
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            AI analysis of properties that reveals hidden risks and questions you should ask during viewings.
          </p>

          {/* SEARCH SECTION */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Property listing URL or address..."
                  className="pl-4 pr-4 py-6 text-lg border-2 border-purple-200 rounded-full focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              <Button
                size="lg"
                className="px-8 py-6 bg-purple-600 hover:bg-purple-700 rounded-full text-lg font-medium"
              >
                Analyze Property
                <Search className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            PropertyAI is a government-approved service for property buyers, but does not replace professional advice.
            All decisions are based on your own research and assessment - we are not responsible for any errors in
            analyses.
          </p>
        </div>

        {/* PDF UPLOAD SECTION */}
        <section className="mt-24">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Upload Property Documents</h2>
            <p className="text-lg text-gray-600 mb-8">
              Drag and drop your property PDF documents for AI analysis
            </p>
            
            <Card className={`max-w-2xl mx-auto border-2 border-dashed transition-colors ${
              dragActive ? 'border-purple-400 bg-purple-50' : 'border-purple-200 hover:border-purple-400'
            }`}>
              <CardContent 
                className="p-12"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your PDF here</h3>
                  <p className="text-gray-500 mb-4">
                    or <span 
                      className="text-purple-600 font-medium cursor-pointer hover:text-purple-700"
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
                    className="mt-6 border-purple-200 text-purple-600 hover:bg-purple-50"
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
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  >
                    Analyze Documents
                    <Search className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RECENTLY ANALYZED PROPERTIES */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Recently Analyzed Properties</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Property 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Modern house with mountain view"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-black/70 text-white">3 min ago</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Mountain View Drive 60, 5563 Fjordtown</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">$634,840</span>
                  <span className="text-gray-500">365 m²</span>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">RISKS</div>
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <TriangleAlert className="w-4 h-4" />
                    <span>Moisture on doors and windows</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CircleCheck className="w-4 h-4" />
                    <span>No mechanical ventilation in bathroom</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Modern wooden house"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-black/70 text-white">16 min ago</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Oak Street 4, 2165 Riverside</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">$673,500</span>
                  <span className="text-gray-500">304 m²</span>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">RISKS</div>
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <TriangleAlert className="w-4 h-4" />
                    <span>Unclear roof leak safety on balcony</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <Droplets className="w-4 h-4" />
                    <span>Defects in gutters and downspouts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="House with large garden"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-black/70 text-white">35 min ago</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Garden Lane 382, 4934 Greenville</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">$445,740</span>
                  <span className="text-gray-500">184 m²</span>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">RISKS</div>
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <TriangleAlert className="w-4 h-4" />
                    <span>Outdated electrical/heating system</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CircleCheck className="w-4 h-4" />
                    <span>Bathroom with poor ventilation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property 4 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Modern townhouses"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-black/70 text-white">41 min ago</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Sunset Avenue 37, 1476 Hillside</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">$703,340</span>
                  <span className="text-gray-500">207 m²</span>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">RISKS</div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CircleCheck className="w-4 h-4" />
                    <span>Older windows</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CircleCheck className="w-4 h-4" />
                    <span>Defects in staircase railings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Droplets className="w-4 h-4" />
                    <span>Inadequate water drainage</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
