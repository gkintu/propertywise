"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  RefreshCw, 
  Moon, 
  Sun, 
  Code2, 
  FileText,
  AlertTriangle,
  Info,
  ArrowLeft
} from "lucide-react";
import { PropertyAnalysis } from "@/lib/types";
import { PDFViewer } from "@react-pdf/renderer";
import { AnalysisReportPDF } from "@/components/pdf/AnalysisReportPDF";
import { ClientOnly } from "@/components/hydration";

// Sample data for PDF preview (matches the structure from analysis)
const sampleAnalysisData: PropertyAnalysis = {
  propertyDetails: {
    address: "Sanengveien 1, 1619 FREDRIKSTAD",
    bedrooms: 3,
    price: 4200000,
    currency: "NOK",
    size: 89.72,
    yearBuilt: 2025,
    propertyType: "semi-detached house",
  },
  summary: "A modern, newly built (2025) semi-detached house located at Sanengveien 1, 1619 FREDRIKSTAD, offering 3 bedrooms and 89.72 sqm of living space on a 629.1 sqm shared plot. The property boasts a well-thought-out design, bright interiors, a modern kitchen, and attractive outdoor spaces, situated in a child-friendly, central area with excellent access to amenities and nature. Key concerns for buyers include the absence of a final occupancy permit, unmeasured but high-risk radon exposure, and a tight maneuvering area for the garage. Additionally, some standard \"turnkey\" items like ground work and certain heating systems are excluded, and existing ash trees show signs of dieback. No condition report has been prepared for the sale. Prospective buyers should conduct thorough investigations and verify all pending documentation.",
  strongPoints: [
    {
      title: "Modern Design & Construction Quality",
      description: "Newly built (2025) with contemporary architecture and high-quality materials throughout",
      category: "condition" as const
    },
    {
      title: "Prime Location with Amenities",
      description: "Central location in child-friendly area with excellent access to nature and local amenities",
      category: "location" as const
    },
    {
      title: "Spacious Layout & Bright Interiors",
      description: "Well-designed 89.72 sqm living space with optimal natural light and functional room distribution",
      category: "other" as const
    },
    {
      title: "Modern Kitchen & Fixtures",
      description: "State-of-the-art kitchen with contemporary appliances and premium finishes",
      category: "kitchen" as const
    },
    {
      title: "Attractive Outdoor Spaces",
      description: "Well-planned outdoor areas on 629.1 sqm shared plot with landscaping potential",
      category: "outdoor" as const
    }
  ],
  concerns: [
    {
      title: "Missing Final Occupancy Permit",
      description: "Property lacks final occupancy permit which may delay move-in and affect financing",
      severity: "high" as const,
      estimatedCost: "Unknown - potential delays",
      category: "other" as const
    },
    {
      title: "High-Risk Radon Exposure",
      description: "Unmeasured but potentially dangerous radon levels requiring professional assessment",
      severity: "high" as const,
      estimatedCost: "15,000-50,000 NOK for mitigation",
      category: "safety" as const
    },
    {
      title: "Tight Garage Maneuvering",
      description: "Limited space for vehicle access and parking may cause daily inconvenience",
      severity: "medium" as const,
      estimatedCost: "Not applicable",
      category: "structural" as const
    },
    {
      title: "Excluded Turnkey Items",
      description: "Ground work and certain heating systems not included in purchase price",
      severity: "medium" as const,
      estimatedCost: "50,000-150,000 NOK additional",
      category: "other" as const
    },
    {
      title: "Ash Tree Disease Issues",
      description: "Existing trees showing signs of dieback requiring removal or treatment",
      severity: "low" as const,
      estimatedCost: "10,000-30,000 NOK",
      category: "maintenance" as const
    }
  ],
  hiddenDefects: [
    {
      category: "moisture_water_damage" as const,
      riskLevel: "medium" as const,
      briefExplanation: "New construction may have moisture issues from rushed drying or construction moisture",
      consequences: "Mold growth, structural damage, health issues, expensive remediation requiring specialized contractors",
      preventiveMeasures: "Professional moisture assessment, proper ventilation inspection, humidity monitoring systems",
      actionRequired: "Hire certified building inspector for comprehensive moisture evaluation before purchase"
    },
    {
      category: "electrical_faults" as const,
      riskLevel: "low" as const,
      briefExplanation: "New electrical systems may have installation defects or code violations that aren't immediately apparent",
      consequences: "Fire hazard, electrical shock risk, costly rewiring, potential insurance issues, safety violations",
      preventiveMeasures: "Professional electrical inspection, code compliance verification, load testing of circuits",
      actionRequired: "Schedule certified electrician inspection before purchase to verify all installations meet current codes"
    },
    {
      category: "roof_structural_issues" as const,
      riskLevel: "high" as const,
      briefExplanation: "Foundation settling or structural defects may not be visible but could affect long-term stability",
      consequences: "Major structural repairs, foundation replacement, safety hazards, significant property value loss",
      preventiveMeasures: "Professional structural engineer assessment, soil composition analysis, foundation inspection",
      actionRequired: "Hire licensed structural engineer for comprehensive evaluation of foundation and load-bearing elements"
    }
  ],
  bottomLine: "This newly built property offers excellent modern living potential but requires careful due diligence regarding permits, environmental hazards, and additional costs before purchase commitment. Consider hiring multiple specialists for thorough inspection."
};

// Mock translation function for development
const mockT = (key: string, params?: Record<string, string | number>) => {
  const translations: Record<string, string> = {
    'analysis.strongSellingPoints': 'Strong Selling Points',
    'analysis.areasOfConcern': 'Areas of Concern',
    'analysis.analysisSummaryTitle': 'Analysis Summary',
    'analysis.keyFindingsTitle': 'Key Findings',
    'analysis.marketPosition': 'Market Position',
    'analysis.bottomLine': 'Bottom Line',
    'analysis.reportGeneratedOn': `Report generated on ${params?.date || new Date().toLocaleDateString()}`,
    'hiddenDefects.title': 'Hidden Defects',
    'hiddenDefects.description': 'Potential hidden defects to consider during inspection',
    'hiddenDefects.consequences': 'Consequences',
    'hiddenDefects.preventiveMeasures': 'Preventive measures',
    'hiddenDefects.noSignsAvailable': 'No signs specified',
    'hiddenDefects.categories.moisture_water_damage.title': 'Moisture & Water Damage',
    'hiddenDefects.categories.electrical_faults.title': 'Electrical Faults',
    'hiddenDefects.categories.roof_structural_issues.title': 'Roof & Structural Issues',
    'hiddenDefects.riskLevels.low': 'Low Risk',
    'hiddenDefects.riskLevels.medium': 'Medium Risk',
    'hiddenDefects.riskLevels.high': 'High Risk',
  };
  return translations[key] || key;
};

export default function PDFPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  // Note: locale is not used in this dev-only component but required for route structure
  use(params);
  const [pdfTheme, setPdfTheme] = useState<'light' | 'dark'>('dark');
  const [refreshKey, setRefreshKey] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const isDev = process.env.NODE_ENV === "development";
  
  // Development-only check - redirect if not in development
  useEffect(() => {
    if (!isDev) {
      router.push('/');
    }
  }, [isDev, router]);

  // Client-side initialization to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setLastRefresh(new Date().toLocaleTimeString());
  }, []);

  const refreshPDF = () => {
    setRefreshKey(prev => prev + 1);
    setLastRefresh(new Date().toLocaleTimeString());
  };

  const togglePdfTheme = () => {
    setPdfTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  // Auto-refresh functionality for development
  useEffect(() => {
    if (autoRefresh && isDev) {
      const interval = setInterval(() => {
        // Check for file system changes would go here in a real implementation
        // For now, we'll just refresh every 30 seconds if autoRefresh is enabled
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isDev]);

  // Keyboard shortcuts for development
  useEffect(() => {
    if (!isDev) return;

    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + R to refresh
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshPDF();
      }
      // Ctrl/Cmd + D to toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        togglePdfTheme();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isDev]);

  // Don't render in production (following debug component pattern)
  if (!isDev) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white dark:from-[#111827] dark:to-[#1F2937]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#111827]/85 backdrop-blur-sm border-b border-gray-200/30 dark:border-[#374151]/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <FileText className="w-6 h-6 text-yellow-600 dark:text-[#FBBF24]" />
              <span className="text-xl font-bold text-gray-900 dark:text-[#F9FAFB]">
                PDF Preview
              </span>
            </button>
            <Badge variant="secondary" className="gap-1 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
              <Code2 className="w-3 h-3" />
              Dev Only
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {isClient && (
              <div className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                Last refresh: {lastRefresh}
              </div>
            )}
            
            <Button
              onClick={toggleAutoRefresh}
              variant="outline"
              size="sm"
              className={`gap-2 ${autoRefresh ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`} />
              Auto
            </Button>
            
            <Button
              onClick={refreshPDF}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            
            <Button
              onClick={togglePdfTheme}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {pdfTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {pdfTheme === 'light' ? 'Dark' : 'Light'} PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/20">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>🚧 Development PDF Preview</strong> - This page shows PDF changes in real-time. 
            Edit <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-xs">AnalysisReportPDF.tsx</code> and see changes instantly.
            Use keyboard shortcut <kbd className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-xs">Ctrl+S</kbd> (or <kbd className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-xs">Cmd+S</kbd>) to save and refresh.
          </AlertDescription>
        </Alert>

        {/* PDF Preview */}
        <Card className="bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-[#374151]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-[#F9FAFB]">
              <Eye className="w-5 h-5 text-yellow-600 dark:text-[#FBBF24]" />
              Live PDF Preview - {pdfTheme === 'light' ? 'Light' : 'Dark'} Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[800px] border border-gray-300 dark:border-[#4B5563] rounded-lg overflow-hidden bg-gray-100 dark:bg-[#374151]">
              <ClientOnly>
                <PDFViewer 
                  key={refreshKey} 
                  width="100%" 
                  height="100%"
                  showToolbar={true}
                >
                  <AnalysisReportPDF 
                    analysisData={sampleAnalysisData}
                    t={mockT}
                    isDarkMode={pdfTheme === 'dark'}
                  />
                </PDFViewer>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 bg-gray-50 dark:bg-[#1F2937] border border-gray-200 dark:border-[#374151]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-[#F9FAFB]">
              How to Use PDF Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700 dark:text-[#D1D5DB]">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-yellow-600 dark:text-[#FBBF24]">1.</span>
              <span>Make changes to the PDF component (<code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">components/pdf/AnalysisReportPDF.tsx</code>)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-yellow-600 dark:text-[#FBBF24]">2.</span>
              <span>Save the file - the preview will update automatically in most cases</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-yellow-600 dark:text-[#FBBF24]">3.</span>
              <span>Use the <strong>&quot;Refresh&quot;</strong> button if changes don&apos;t appear immediately</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-yellow-600 dark:text-[#FBBF24]">4.</span>
              <span>Toggle between <strong>light and dark PDF themes</strong> to test both modes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-yellow-600 dark:text-[#FBBF24]">5.</span>
              <span>Preview includes comprehensive sample data with hidden defects, strong points, and concerns</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-yellow-600 dark:text-[#FBBF24]">6.</span>
              <span>Use keyboard shortcuts: <kbd className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">Ctrl+R</kbd> to refresh, <kbd className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">Ctrl+D</kbd> to toggle theme</span>
            </div>
            
            <Separator className="my-4 dark:bg-[#374151]" />
            
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>This preview page is only available in development mode and will not be accessible in production.</span>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/50 rounded-md">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Sample Data Included:</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Property details (address, price, size, bedrooms, etc.)</li>
                <li>• 5 strong selling points with descriptions</li>
                <li>• 5 areas of concern</li>
                <li>• 3 hidden defects (moisture, electrical, structural)</li>
                <li>• Bottom line recommendation</li>
                <li>• Comprehensive analysis summary</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
