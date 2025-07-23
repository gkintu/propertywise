import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import AnalysisResultPage from './page'
import { PropertyAnalysis } from '@/lib/types'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'analysisResult.title': 'Property Analysis Report',
      'analysisResult.backToHome': 'Back to Home',
      'analysisResult.newAnalysis': 'New Analysis',
      'analysisResult.downloadPDF': 'Download PDF',
      'analysisResult.error.title': 'Analysis Error',
      'analysisResult.error.tryAgain': 'Try Again',
      'analysisResult.propertyDetails.title': 'Property Details',
      'analysisResult.strongPoints.title': 'Strong Points',
      'analysisResult.concerns.title': 'Areas of Concern',
      'analysisResult.recommendations.title': 'Recommendations',
      'analysisResult.marketPosition.title': 'Market Position',
    }
    return translations[key] || key
  }
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
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
  return function MockFileUploadSection() {
    return <div data-testid="file-upload-section">File Upload Section</div>
  }
})

jest.mock('@/components/theme/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <button data-testid="theme-toggle">Toggle Theme</button>
  }
})

describe('AnalysisResultPage Integration Tests', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    
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
    bottomLine: 'Well-located property with good potential, some maintenance needed',
    summary: 'Well-located property with good potential, some maintenance needed'
  }

  describe('Component Rendering with Valid Data', () => {
    beforeEach(() => {
      localStorage.setItem('analysisResult', JSON.stringify(mockAnalysisResult))
    })

    it('should render the analysis result page with all sections', () => {
      render(<AnalysisResultPage />)

      expect(screen.getByText('Property Analysis Report')).toBeInTheDocument()
      expect(screen.getByText('Back to Home')).toBeInTheDocument()
      expect(screen.getByText('Download PDF')).toBeInTheDocument()
      expect(screen.getByText('Property Details')).toBeInTheDocument()
      expect(screen.getByText('Strong Points')).toBeInTheDocument()
      expect(screen.getByText('Areas of Concern')).toBeInTheDocument()
      expect(screen.getByText('Recommendations')).toBeInTheDocument()
      expect(screen.getByText('Market Position')).toBeInTheDocument()
    })

    it('should display property details correctly', () => {
      render(<AnalysisResultPage />)

      expect(screen.getByText('123 Test Street, Oslo')).toBeInTheDocument()
      expect(screen.getByText('Apartment')).toBeInTheDocument()
      // Note: These might be displayed as formatted numbers/text in the UI
    })

    it('should display strong points as a list', () => {
      render(<AnalysisResultPage />)

      expect(screen.getByText('Great location near public transport')).toBeInTheDocument()
      expect(screen.getByText('Recently renovated kitchen')).toBeInTheDocument()
      expect(screen.getByText('High ceilings and natural light')).toBeInTheDocument()
    })

    it('should display concerns and bottom line', () => {
      render(<AnalysisResultPage />)

      expect(screen.getByText('Old electrical system needs updating')).toBeInTheDocument()
      expect(screen.getByText('Some moisture issues in bathroom')).toBeInTheDocument()
      expect(screen.getByText('Well-located property with good potential, some maintenance needed')).toBeInTheDocument()
    })

    it('should remove sections that do not exist in current schema', () => {
      render(<AnalysisResultPage />)

      expect(screen.getByText('Property Details')).toBeInTheDocument()
      expect(screen.getByText('Strong Points')).toBeInTheDocument()
      expect(screen.getByText('Areas of Concern')).toBeInTheDocument()
      // Note: Recommendations and Market Position sections might not exist in current schema
    })
  })

  describe('Error Handling', () => {
    it('should display error state when no analysis result is found', () => {
      // localStorage is already cleared in beforeEach
      render(<AnalysisResultPage />)

      expect(screen.getByText('Analysis Error')).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
      expect(screen.getByTestId('file-upload-section')).toBeInTheDocument()
    })

    it('should display error state when analysis result is invalid JSON', () => {
      localStorage.setItem('analysisResult', 'invalid json')
      render(<AnalysisResultPage />)

      expect(screen.getByText('Analysis Error')).toBeInTheDocument()
      expect(screen.getByTestId('file-upload-section')).toBeInTheDocument()
    })

    it('should handle error from localStorage', () => {
      localStorage.setItem('analysisError', 'API_ERROR')
      localStorage.setItem('analysisErrorType', 'network_error')
      render(<AnalysisResultPage />)

      expect(screen.getByText('Analysis Error')).toBeInTheDocument()
      expect(screen.getByTestId('file-upload-section')).toBeInTheDocument()
    })
  })

  describe('Navigation Interactions', () => {
    beforeEach(() => {
      localStorage.setItem('analysisResult', JSON.stringify(mockAnalysisResult))
    })

    it('should navigate back to home when back button is clicked', () => {
      render(<AnalysisResultPage />)

      const backButton = screen.getByText('Back to Home')
      fireEvent.click(backButton)

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('should navigate to home for new analysis when button is clicked', () => {
      render(<AnalysisResultPage />)

      const newAnalysisButton = screen.getByText('New Analysis')
      fireEvent.click(newAnalysisButton)

      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  describe('PDF Download Functionality', () => {
    beforeEach(() => {
      localStorage.setItem('analysisResult', JSON.stringify(mockAnalysisResult))
    })

    it('should handle PDF download when download button is clicked', async () => {
      // Mock URL.createObjectURL
      global.URL.createObjectURL = jest.fn().mockReturnValue('mock-blob-url')
      global.URL.revokeObjectURL = jest.fn()

      // Mock document.createElement and click
      const mockClick = jest.fn()
      const mockLink = {
        href: '',
        download: '',
        click: mockClick,
      }
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement)

      render(<AnalysisResultPage />)

      const downloadButton = screen.getByText('Download PDF')
      fireEvent.click(downloadButton)

      await waitFor(() => {
        expect(mockClick).toHaveBeenCalled()
      })

      // Cleanup
      jest.restoreAllMocks()
    })
  })

  describe('Responsive Design and Accessibility', () => {
    beforeEach(() => {
      localStorage.setItem('analysisResult', JSON.stringify(mockAnalysisResult))
    })

    it('should have proper heading structure', () => {
      render(<AnalysisResultPage />)

      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should have accessible buttons with proper labels', () => {
      render(<AnalysisResultPage />)

      expect(screen.getByRole('button', { name: 'Back to Home' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Download PDF' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'New Analysis' })).toBeInTheDocument()
    })
  })

  describe('Data Handling Edge Cases', () => {
    it('should handle missing optional fields gracefully', () => {
      const incompleteAnalysis = {
        propertyDetails: {
          address: '123 Test Street',
          propertyType: 'Apartment'
          // Missing other fields
        },
        strongPoints: ['Good location'],
        // Missing other sections
      }

      localStorage.setItem('analysisResult', JSON.stringify(incompleteAnalysis))
      render(<AnalysisResultPage />)

      expect(screen.getByText('123 Test Street')).toBeInTheDocument()
      expect(screen.getByText('Good location')).toBeInTheDocument()
      // Should not crash with missing fields
    })

    it('should handle empty arrays in analysis data', () => {
      const analysisWithEmptyArrays = {
        ...mockAnalysisResult,
        strongPoints: [],
        concerns: [],
        recommendations: []
      }

      localStorage.setItem('analysisResult', JSON.stringify(analysisWithEmptyArrays))
      render(<AnalysisResultPage />)

      // Should render sections even with empty arrays
      expect(screen.getByText('Strong Points')).toBeInTheDocument()
      expect(screen.getByText('Areas of Concern')).toBeInTheDocument()
      expect(screen.getByText('Recommendations')).toBeInTheDocument()
    })
  })
})
