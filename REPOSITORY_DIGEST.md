# Repository Digest: Playground Projects

> **Generated on**: June 22, 2025  
> **Purpose**: This document provides a comprehensive text digest of the entire codebase, making it easy to feed into LLMs for analysis, understanding, or development assistance.

## 📋 Project Overview

This is a **Next.js 15** application with **TypeScript** that implements a property analysis system using **Google Gemini AI**. The project features **internationalization (i18n)** support with English and Norwegian locales, modern UI components built with **Radix UI** and **Tailwind CSS**, and PDF processing capabilities with structured AI analysis specifically designed for property documents.

### Key Features
- 📄 PDF document upload and AI-powered property analysis using structured schema
- 🌍 Multi-language support (English/Norwegian) with language-specific AI responses
- 🎨 Modern UI with shadcn/ui components
- ⚡ Next.js 15 with App Router
- 🤖 Google Gemini AI integration with structured JSON output
- 📱 Responsive design with Tailwind CSS
- 🏠 Property analysis with categorized insights (strong points, concerns, recommendations)

---

## 🏗️ Project Structure

```
playground-projects/
├── app/                          # Next.js App Router
│   ├── favicon.ico
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout (minimal)
│   ├── page.tsx                 # Root page (redirects to /en)
│   ├── [locale]/                # Internationalized routes
│   │   ├── layout.tsx           # Locale-specific layout
│   │   ├── page.tsx             # Main app page (577 lines)
│   │   ├── analysis-result/     # Analysis results page
│   │   │   └── page.tsx
│   │   └── privacy/             # Privacy policy page
│   │       └── page.tsx
│   └── api/                     # API routes
│       └── analyze-pdf/         # PDF analysis endpoint
│           └── route.ts         # Main API logic (167 lines)
├── components/                  # React components
│   ├── customized/             # Custom components
│   │   └── spinner/            # Loading spinners
│   ├── locale/                 # Internationalization components
│   │   └── LocaleSwitcher.tsx  # Language switcher
│   ├── pdf/                    # PDF-related components
│   │   ├── AnalysisReportPDF.tsx
│   │   └── icons/              # PDF icons
│   └── ui/                     # shadcn/ui components
│       ├── alert.tsx
│       ├── button.tsx          # Button component with variants
│       ├── card.tsx
│       ├── input.tsx
│       └── [other ui components]
├── hooks/                      # Custom React hooks
│   └── useFileUpload.ts        # File upload logic (124 lines)
├── i18n/                       # Internationalization config
│   ├── request.ts              # Server-side i18n config
│   └── routing.ts              # Route configuration
├── lib/                        # Utility libraries
│   ├── navigation.ts           # Internationalized navigation
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Utility functions
├── messages/                   # Translation files
│   ├── en.json                 # English translations
│   └── no.json                 # Norwegian translations
├── public/                     # Static assets
└── documentation/              # Project documentation
    ├── Gemini API: PDF Document Processing documentation.md
    ├── nextintl-documentation.md
    └── [other docs]
```

---

## 🔧 Configuration Files

### package.json
```json
{
  "name": "playground-projects",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@google/genai": "^1.5.1",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@react-pdf/renderer": "^4.3.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dotenv": "^16.5.0",
    "flag-icons": "^7.5.0",
    "lucide-react": "^0.513.0",
    "next": "^15.3.3",
    "next-intl": "^4.1.0",
    "next-themes": "^0.4.6",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "sonner": "^2.0.5",
    "tailwind-merge": "^3.3.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20.19.0",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^9",
    "eslint-config-next": "15.1.3",
    "tailwindcss": "^4",
    "ts-node": "^10.9.2",
    "tw-animate-css": "^1.3.4",
    "typescript": "^5"
  }
}
```

### next.config.ts
```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: [
      '.mdx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
```

---

## 🌐 Core Application Code

### app/page.tsx (Root Redirect)
```tsx
"use client";

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to default locale (English)
    router.replace('/en')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg"></div>
        </div>
        <p className="text-gray-600">Redirecting to PropertyWise...</p>
      </div>
    </div>
  )
}
```

### app/[locale]/page.tsx (Main App Page - Abbreviated)
```tsx
"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Home as HomeIcon, AlertTriangle, CheckCircle, Clock, MapPin, Bed, Bath, Car, Upload, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, use } from "react"
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from "sonner"
import { useFileUpload } from '@/hooks/useFileUpload'
import LocaleSwitcher from '@/components/locale/LocaleSwitcher'
import Spinner from "@/components/customized/spinner/spinner-05";

interface PageProps {
  params: Promise<{locale: string}>;
}

export default function Home({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations('HomePage');
  const f = useTranslations('Footer');
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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAnalyzeDocuments = async () => {
    if (uploadedFiles.length === 0) {
      toast.error(t('upload.validation.noFileSelected'))
      return
    }

    // Clear any previous analysis results when starting a new analysis
    localStorage.removeItem('analysisResult')
    localStorage.removeItem('analysisError')

    setIsLoading(true)
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
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use the text as error message
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Validate that we have actual data before storing
      if (data && (data.analysis || data.summary)) {
        localStorage.setItem('analysisResult', JSON.stringify(data))
        toast.success(t('upload.success'))
        router.push('/analysis-result')
      } else {
        throw new Error("No analysis data received from server")
      }
    } catch (error) {
      console.error("Error analyzing document:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error(`${t('upload.error')}: ${errorMessage}`)
      localStorage.setItem('analysisError', errorMessage)
      router.push('/analysis-result')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white">
      {/* Screen reader status announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>
      
      {/* Main content with file upload UI, property listing interface, etc. */}
      {/* ... (577 total lines with complex UI) */}
    </div>
  )
}
```

### app/api/analyze-pdf/route.ts (PDF Analysis API)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function GET() {
  // Simple test endpoint to check if API is working
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ 
      error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.',
      status: 'API key missing'
    }, { status: 500 });
  }

  return NextResponse.json({ 
    message: 'PDF Analysis API is working',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received');
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.log('Missing API key');
      return NextResponse.json({ 
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.' 
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const language = formData.get('language') as string || 'en';

    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'Invalid file type. Only PDFs are allowed.' }, { status: 400 });
    }

    // Convert file to buffer and create PDF part for Gemini
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const pdfPart = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: file.type,
      },
    };

    // Determine language instruction for AI prompt
    const languageInstruction = language === 'no' 
      ? 'Respond in Norwegian (Bokmål). All text fields including titles, descriptions, and the summary should be in Norwegian.'
      : 'Respond in English. All text fields should be in English.';

    // Define structured output schema for property analysis
    const propertyAnalysisSchema = {
      type: "object",
      properties: {
        propertyDetails: {
          type: "object",
          properties: {
            address: { type: "string", description: "Full property address" },
            bedrooms: { type: "number", description: "Number of bedrooms" },
            price: { type: "number", description: "Price in NOK" },
            size: { type: "number", description: "Size in square meters" },
            yearBuilt: { type: "number", description: "Year the property was built" },
            propertyType: { 
              type: "string", 
              enum: ["apartment", "house", "condo"],
              description: "Type of property" 
            }
          },
          required: ["address", "propertyType"]
        },
        strongPoints: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Brief title of the strong point" },
              description: { type: "string", description: "Detailed description" },
              category: { 
                type: "string", 
                enum: ["kitchen", "location", "fees", "outdoor", "storage", "condition", "other"]
              }
            },
            required: ["title", "description", "category"]
          }
        },
        concerns: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Brief title of the concern" },
              description: { type: "string", description: "Detailed description" },
              severity: { 
                type: "string", 
                enum: ["low", "medium", "high"]
              },
              estimatedCost: { type: "string", description: "Estimated cost to address (optional)" },
              category: { 
                type: "string", 
                enum: ["electrical", "structural", "safety", "pest", "maintenance", "age", "other"]
              }
            },
            required: ["title", "description", "severity", "category"]
          }
        },
        bottomLine: { type: "string", description: "Overall recommendation and key points" },
        summary: { type: "string", description: "Brief overview of the property analysis" }
      },
      required: ["propertyDetails", "strongPoints", "concerns", "bottomLine", "summary"]
    };

    // Call Gemini API with structured output schema
    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash-lite-preview-06-17',
      contents: [
        { text: `You are an AI assistant specialized in analyzing property reports. Given the attached PDF property document, extract key information and provide structured analysis.\n\n${languageInstruction}\n\nFocus on actionable insights for a potential buyer. If you cannot extract structured data from the document, provide a brief summary in the summary field.` },
        pdfPart
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: propertyAnalysisSchema,
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking for faster response
        },
      },
    });

    const aiSummary = response.text;
    if (!aiSummary) {
      return NextResponse.json({ error: 'AI failed to generate a summary.' }, { status: 500 });
    }

    // Parse structured JSON response
    const parsedAnalysis = JSON.parse(aiSummary);
    return NextResponse.json({ analysis: parsedAnalysis });
    
  } catch (error) {
    console.error('Error in /api/analyze-pdf:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process file: ${errorMessage}` }, { status: 500 });
  }
}
```

---

## 🎣 Custom Hooks

### hooks/useFileUpload.ts
```typescript
import { useState, useRef } from 'react'
import { toast } from "sonner"
import { useTranslations } from 'next-intl'

export function useFileUpload() {
  const t = useTranslations('HomePage')
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [statusMessage, setStatusMessage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (file.type !== "application/pdf") {
      return t('upload.validation.invalidFileTypeDrop')
    }
    
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return t('upload.validation.fileSizeLimit')
    }
    
    return null
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
      setStatusMessage(t('upload.releaseToUpload'))
    } else if (e.type === "dragleave") {
      setDragActive(false)
      setStatusMessage('')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setStatusMessage('')
    
    const files = Array.from(e.dataTransfer.files)
    
    // Validate file count
    if (files.length > 1) {
      toast.error(t('upload.validation.multipleFilesDrop'))
      return
    }
    
    // Validate and process files
    // ... (124 total lines with file handling logic)
  }

  // Additional methods: handleFileSelect, removeFile, openFileDialog, etc.
  
  return {
    dragActive,
    uploadedFiles,
    statusMessage,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removeFile,
    openFileDialog,
  }
}
```

---

## 🌍 Internationalization Setup

### i18n/routing.ts
```typescript
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'no'],

  // Used when no locale matches
  defaultLocale: 'en'
});
```

### middleware.ts
```typescript
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

---

## 🎨 UI Components

### components/ui/button.tsx
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Environment Variables Required
```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Key Dependencies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety
- **next-intl**: Internationalization
- **@google/genai**: Google Gemini AI integration
- **@radix-ui**: Headless UI components
- **Tailwind CSS**: Utility-first CSS framework
- **lucide-react**: Icon library
- **sonner**: Toast notifications
- **@react-pdf/renderer**: PDF generation

---

## 📁 File Tree Summary

```
📁 playground-projects (Next.js 15 + TypeScript + i18n)
├── 📁 app/ (App Router structure)
│   ├── 📄 page.tsx (redirect to /en)
│   ├── 📁 [locale]/ (internationalized routes)
│   │   ├── 📄 layout.tsx (locale layout)
│   │   ├── 📄 page.tsx (main app - 577 lines)
│   │   ├── 📁 analysis-result/
│   │   └── 📁 privacy/
│   └── 📁 api/
│       └── 📁 analyze-pdf/ (Gemini AI integration)
├── 📁 components/
│   ├── 📁 customized/ (custom components)
│   ├── 📁 locale/ (i18n components)
│   ├── 📁 pdf/ (PDF components)
│   └── 📁 ui/ (shadcn/ui components)
├── 📁 hooks/
│   └── 📄 useFileUpload.ts (file handling - 124 lines)
├── 📁 i18n/ (internationalization)
│   ├── 📄 request.ts
│   └── 📄 routing.ts
├── 📁 lib/ (utilities)
├── 📁 messages/ (translations)
│   ├── 📄 en.json
│   └── 📄 no.json
├── 📁 public/ (static assets)
├── 📁 documentation/ (project docs)
├── 📄 package.json (dependencies & scripts)
├── 📄 next.config.ts (Next.js config)
├── 📄 middleware.ts (i18n middleware)
├── 📄 tsconfig.json (TypeScript config)
└── 📄 tailwind.config.js (Tailwind config)
```

---

## 🔍 Key Technical Insights

1. **Modern Next.js Architecture**: Uses App Router with Server/Client Components
2. **AI Integration**: Google Gemini API with structured JSON schema for property analysis
3. **Property Analysis Schema**: Structured output with property details, strong points, concerns, and recommendations
4. **Internationalization**: Full i18n support with language-specific AI responses
5. **Type Safety**: Comprehensive TypeScript implementation
6. **Modern UI**: shadcn/ui components with Radix UI primitives
7. **File Handling**: Drag-and-drop PDF upload with validation
8. **Error Handling**: Comprehensive error management throughout the app
9. **Responsive Design**: Mobile-first approach with Tailwind CSS
10. **Structured AI Output**: Uses Gemini's responseSchema for consistent JSON responses

This digest represents the complete codebase structure and key functionality, optimized for LLM consumption and development assistance.
