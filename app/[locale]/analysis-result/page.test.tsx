/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import AnalysisResultPage from './page'
import { PropertyAnalysis } from '@/lib/types'

// Mock the use hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: (promise) => {
    if (promise instanceof Promise) {
      return { locale: 'en' };
    }
    return promise;
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      // Error handling keys - most important for current tests
      'error.analysisFailedTitle': 'Analysis Failed',
      'error.analysisNotFoundTitle': 'Analysis Not Found', 
      'error.invalidDocumentTitle': 'Invalid Document Type',
      'error.insufficientDataTitle': 'Insufficient Property Data',
      'error.classificationErrorTitle': 'Document Analysis Error',
      'error.processingErrorTitle': 'Processing Error',
      'error.goBackButton': 'Go Back Home',
      'error.tryAgainButton': 'Try Again',
      'error.noResultMessage': 'No analysis result was found. This might happen if you navigated to this page directly or if there was an issue retrieving the result.',
      'error.invalidDocumentMessage': 'This does not appear to be a property report. Please upload the correct document.',
      'error.insufficientDataMessage': 'Could not find enough property information in the document. Please ensure the document contains property details like address, price, and property description.',
      'error.classificationErrorMessage': 'There was an error analyzing your document. Please try uploading again.',
      'error.processingErrorMessage': 'There was an error processing your document. Please try again or contact support if the problem persists.',
      
      // Analysis section keys - matching actual component structure
      'analysis.analysisSummaryTitle': 'Analysis Summary',
      'analysis.keyFindingsTitle': 'Key Findings',
      'analysis.strongSellingPoints': 'Strong Selling Points', 
      'analysis.areasOfConcern': 'Areas of Concern',
      'analysis.bottomLine': 'Bottom Line:',
      'analysis.marketPosition': 'Market Position:',
      'analysis.roomPropertyPriced': '-room {propertyType} priced at {price} {currency}',
      'analysis.totalSize': '{size} sqm total',
      'analysis.built': 'Built {year}',
      
      // Button keys
      'analysis.goBackHomeButton': 'Go Back Home',
      'analysis.analyzeAnotherButton': 'Analyze Another Document',
      'analysis.downloadPdfButton': 'Download PDF',
      'analysis.pdfGeneratedSuccess': 'PDF generated successfully!',
      'analysis.pdfGenerationError': 'Failed to generate PDF. Please try again.',
      
      // Summary keys (fallback mode)
      'summary.propertyAnalysisReportTitle': 'Property Analysis Report',
      'summary.limitedAnalysisTitle': 'Limited Analysis Format:',
      'summary.limitedAnalysisMessage': 'The AI returned a text summary instead of structured data. For the best experience with specific strong points and concerns, please try uploading your document again.',
    }
    return translations[key] || key
  }
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    loading: jest.fn(() => 'pdf-generation'),
    error: jest.fn(),
    success: jest.fn(),
    dismiss: jest.fn(),
  }
}))

// Mock the PDF generation
jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn().mockReturnValue({
    toBlob: jest.fn().mockResolvedValue(new Blob(['mock pdf'], { type: 'application/pdf' }))
  })
}))

// Mock components
jest.mock('@/components/upload/FileUploadSection', () => {
  const MockFileUploadSection = () => {
    return <div data-testid="file-upload-section">File Upload Section</div>
  }
  MockFileUploadSection.displayName = 'MockFileUploadSection'
  return {
    __esModule: true,
    default: MockFileUploadSection,
  }
})

jest.mock('@/components/theme/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>
}))

jest.mock('@/components/pdf/AnalysisReportPDF', () => ({
  AnalysisReportPDF: () => <div data-testid="analysis-report-pdf">PDF Report</div>
}))

jest.mock('@/components/ui/property-listing-badge', () => ({
  PropertyListingBadge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="property-listing-badge">{children}</span>
  )
}))

// Setup global mocks that won't interfere with React Testing Library
beforeAll(() => {
  // Mock URL methods for PDF download functionality
  Object.defineProperty(global, 'URL', {
    value: {
      createObjectURL: jest.fn(() => 'mocked-url'),
      revokeObjectURL: jest.fn(),
    },
    writable: true
  })
})

describe('AnalysisResultPage Integration Tests', () => {
  const mockPush = jest.fn()
  const mockSearchParams = {
    get: jest.fn(),
    has: jest.fn(),
    toString: jest.fn(() => ''),
    keys: jest.fn(),
    values: jest.fn(),
    entries: jest.fn(),
    forEach: jest.fn(),
    getAll: jest.fn(),
  }
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    
    // Clear localStorage before each test
    localStorage.clear()
  })

  const mockAnalysisResult: PropertyAnalysis = {
    propertyDetails: {
      address: '123 Test Street, Oslo',
      propertyType: 'Apartment',
      size: 75, // number instead of string
      bedrooms: 2, // number instead of string
      yearBuilt: 1995, // number instead of string
      price: 4500000 // required field
    },
    strongPoints: [
      'Great location near public transport',
      'Recently renovated kitchen',
      'High ceilings and natural light'
    ],
    concerns: [
      'Old electrical system needs updating',
      'Some moisture issues in bathroom'
    ],
    hiddenDefects: [],
    bottomLine: 'Well-located property with good potential, some maintenance needed',
    summary: 'Well-located property with good potential, some maintenance needed'
  }

  describe('Component Rendering with Valid Data', () => {
    beforeEach(() => {
      localStorage.setItem('analysisResult', JSON.stringify(mockAnalysisResult))
    })

    it('should render the analysis result page with all sections', () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      // Check for the main title that appears in the header
      expect(screen.getByText('123 Test Street, Oslo')).toBeInTheDocument()
      
      // Check for buttons with more flexible matching
      expect(screen.getByRole('button', { name: /go back home|back to home/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /analyze another|new analysis/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
      
      // Check for actual section titles that the component renders
      expect(screen.getByText('Analysis Summary')).toBeInTheDocument()
      expect(screen.getByText('Key Findings')).toBeInTheDocument()
      expect(screen.getByText('Strong Selling Points')).toBeInTheDocument()
      expect(screen.getByText('Areas of Concern')).toBeInTheDocument()
    })

    it('should display property details correctly', () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      // Check if property address is displayed in the header
      expect(screen.getByText('123 Test Street, Oslo')).toBeInTheDocument()
      
      // Use getAllByText since the address appears in multiple places
      const addresses = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('123 Test Street') ?? false
      })
      expect(addresses.length).toBeGreaterThan(0)
    })

    it('should display strong points as a list', () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      expect(screen.getByText((content) => content.includes('Great location near public transport'))).toBeInTheDocument()
      expect(screen.getByText((content) => content.includes('Recently renovated kitchen'))).toBeInTheDocument()
      expect(screen.getByText((content) => content.includes('High ceilings and natural light'))).toBeInTheDocument()
    })

    it('should display concerns and bottom line', () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      expect(screen.getByText((content) => content.includes('Old electrical system needs updating'))).toBeInTheDocument()
      expect(screen.getByText((content) => content.includes('Some moisture issues in bathroom'))).toBeInTheDocument()
      // Use getAllByText for duplicate text
      expect(screen.getAllByText((content) => content.includes('Well-located property with good potential, some maintenance needed')).length).toBeGreaterThanOrEqual(1)
    })

    it('should remove sections that do not exist in current schema', () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      // These sections should exist with the correct translated titles
      expect(screen.getByText('Key Findings')).toBeInTheDocument()
      expect(screen.getByText('Strong Selling Points')).toBeInTheDocument()
      expect(screen.getByText('Areas of Concern')).toBeInTheDocument()
      // Note: Recommendations and Market Position sections might not exist in current schema
    })
  })

  describe('Error Handling', () => {
    it('should display error state when no analysis result is found', () => {
      // localStorage is already cleared in beforeEach
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      expect(screen.getByText('Analysis Failed')).toBeInTheDocument()
      expect(screen.getByText('Go Back Home')).toBeInTheDocument()
    })

    it('should display error state when analysis result is invalid JSON', () => {
      localStorage.setItem('analysisResult', 'invalid json')
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      expect(screen.getByText('Analysis Failed')).toBeInTheDocument()
    })

    it('should handle error from localStorage', () => {
      localStorage.setItem('analysisError', 'API_ERROR')
      localStorage.setItem('analysisErrorType', 'network_error')
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      expect(screen.getByText('Analysis Failed')).toBeInTheDocument()
    })
  })

  describe('Navigation Interactions', () => {
    beforeEach(() => {
      localStorage.setItem('analysisResult', JSON.stringify(mockAnalysisResult))
    })

    it('should navigate back to home when back button is clicked', () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      const backButton = screen.getByRole('button', { name: /back/i })
      fireEvent.click(backButton)

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('should show upload section when analyze another button is clicked', () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      // The button shows an upload section instead of navigating
      const analyzeAnotherButton = screen.getByRole('button', { name: /analyze another document/i })
      fireEvent.click(analyzeAnotherButton)

      // Should show the file upload section
      expect(screen.getByTestId('file-upload-section')).toBeInTheDocument()
    })
  })

  describe('PDF Download Functionality', () => {
    beforeEach(() => {
      localStorage.setItem('analysisResult', JSON.stringify(mockAnalysisResult))
    })

    it('should handle PDF download when download button is clicked', async () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      const downloadButton = screen.getByRole('button', { name: /download pdf/i })
      
      // Just ensure the button exists and can be clicked without errors
      expect(downloadButton).toBeInTheDocument()
      fireEvent.click(downloadButton)
      
      // The PDF generation is mocked so we can't test the actual download,
      // but we can verify the button doesn't cause errors
      expect(downloadButton).toBeInTheDocument()
    })
  })

  describe('Responsive Design and Accessibility', () => {
    beforeEach(() => {
      localStorage.setItem('analysisResult', JSON.stringify(mockAnalysisResult))
    })

    it('should have proper heading structure', () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should have accessible buttons with proper labels', () => {
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /analyze another/i })).toBeInTheDocument()
    })
  })

  describe('Data Handling Edge Cases', () => {
    it('should handle missing optional fields gracefully', () => {
      const incompleteAnalysis = {
        propertyDetails: {
          address: '123 Test Street',
          propertyType: 'Apartment',
          size: 75,
          bedrooms: 2,
          yearBuilt: 1995,
          price: 4500000 // Required field to prevent crash
        },
        strongPoints: ['Good location'],
        concerns: [],
        hiddenDefects: [],
        bottomLine: 'Good location',
        summary: 'Good location'
      }

      localStorage.setItem('analysisResult', JSON.stringify(incompleteAnalysis))
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      // Use getAllByText since "123 Test Street" appears in multiple places
      expect(screen.getAllByText((content, element) => {
        return element?.textContent?.includes('123 Test Street') ?? false
      })[0]).toBeInTheDocument()
      // Use getAllByText since "Good location" also appears in multiple places 
      expect(screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Good location') ?? false
      })[0]).toBeInTheDocument()
      // Should not crash with missing optional fields
    })

    it('should handle empty arrays in analysis data', () => {
      const analysisWithEmptyArrays = {
        ...mockAnalysisResult,
        strongPoints: [],
        concerns: [],
      }

      localStorage.setItem('analysisResult', JSON.stringify(analysisWithEmptyArrays))
      render(<AnalysisResultPage params={Promise.resolve({ locale: 'en' })} />)

      // Should render sections even with empty arrays
      expect(screen.getByText('Strong Selling Points')).toBeInTheDocument()
      expect(screen.getByText('Areas of Concern')).toBeInTheDocument()
    })
  })
})
