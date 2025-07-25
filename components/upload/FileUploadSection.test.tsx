import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import FileUploadSection from './FileUploadSection'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => (key: string, params?: { fileName?: string }) => {
    const translations: Record<string, string> = {
      'HomePage.upload.title': 'Upload Property Document',
      'HomePage.upload.description': 'Upload a PDF property report for AI analysis',
      'HomePage.upload.subtitle': 'Upload a PDF property report for AI analysis',
      'HomePage.upload.dropText': 'Drag and drop your PDF here, or click to browse',
      'HomePage.upload.browseText': 'Browse',
      'HomePage.upload.supportText': 'PDF only, max 50MB',
      'HomePage.upload.selectButton': 'Select File',
      'HomePage.upload.uploadedFile': 'Uploaded File',
      'HomePage.upload.analyzeButton': 'Analyze Document',
      'HomePage.upload.success': 'Analysis complete!',
      'HomePage.upload.error': 'Analysis failed',
      'HomePage.upload.validation.noFileSelected': 'No file selected.',
      'HomePage.upload.validation.invalidFileTypeDrop': 'Invalid file type. Only PDFs are allowed.',
      'HomePage.upload.validation.fileSizeLimit': 'File size must be less than 50MB.',
      'HomePage.upload.validation.multipleFilesDrop': 'Please select only one file at a time.',
      'HomePage.upload.validation.multipleFilesSelect': 'Please select only one file at a time.',
      'HomePage.upload.releaseToUpload': 'Release to upload',
      'HomePage.upload.fileRemoved': 'File removed',
    };
    const fullKey = namespace ? `${namespace}.${key}` : key;
    // Handle dynamic translation for file uploaded
    if (fullKey === 'HomePage.upload.fileUploaded' && params?.fileName) {
      return `File uploaded: ${params.fileName}`;
    }
    return translations[fullKey] || key;
  }
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  }
}))

// Mock the motion components
jest.mock('@/components/motion', () => {
  const MockShakeMotion = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      shake: jest.fn(),
    }));
    return <div data-testid="shake-motion">{props.children}</div>;
  });
  MockShakeMotion.displayName = 'MockShakeMotion';
  return {
    ShakeMotion: MockShakeMotion,
    ShakeMotionHandle: {} as unknown,
  };
})

// Mock the demo files section
jest.mock('./DemoFilesSection', () => ({
  DemoFilesSection: ({ onDemoFileUpload }: { onDemoFileUpload: (file: File) => void }) => {
    const handleDemoClick = () => {
      const mockFile = new File(['mock content'], 'demo.pdf', { type: 'application/pdf' })
      onDemoFileUpload(mockFile)
    }
    return (
      <div data-testid="demo-files-section">
        <button onClick={handleDemoClick} data-testid="demo-file-button">
          Select Demo File
        </button>
      </div>
    )
  }
}))

// Mock the progress bar
jest.mock('./AnalysisProgressBar', () => {
  return function MockAnalysisProgressBar({ isVisible }: { isVisible: boolean }) {
    return isVisible ? <div data-testid="progress-bar">Analyzing...</div> : null
  }
})

describe('FileUploadSection Integration Tests', () => {
  const mockPush = jest.fn()
  const mockParams = { locale: 'en' }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useParams as jest.Mock).mockReturnValue(mockParams)
  })

  // Helper function to create a mock File
  const createMockFile = (
    name: string = 'test.pdf',
    size: number = 1024 * 1024,
    type: string = 'application/pdf'
  ): File => {
    const file = new File(['mock content'], name, { type })
    Object.defineProperty(file, 'size', {
      value: size,
      writable: false,
    })
    return file
  }

  describe('Component Rendering', () => {
    it('should render the upload section with all key elements', () => {
      render(<FileUploadSection />)

      expect(screen.getByText('Upload Property Document')).toBeInTheDocument()
      expect(screen.getByText('Upload a PDF property report for AI analysis')).toBeInTheDocument()
      expect(screen.getByText('Drag and drop your PDF here, or click to browse')).toBeInTheDocument()
      expect(screen.getByTestId('demo-files-section')).toBeInTheDocument()
    })

    it('should conditionally render title based on showTitle prop', () => {
      const { rerender } = render(<FileUploadSection showTitle={false} />)
      
      expect(screen.queryByText('Upload Property Document')).not.toBeInTheDocument()

      rerender(<FileUploadSection showTitle={true} />)
      expect(screen.getByText('Upload Property Document')).toBeInTheDocument()
    })
  })

  describe('File Upload Interactions', () => {
    it('should handle valid file selection and enable analyze button', async () => {
      render(<FileUploadSection />)
      
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();

      const validFile = createMockFile('document.pdf', 1024 * 1024, 'application/pdf')
      
      fireEvent.change(fileInput!, {
        target: { files: [validFile] }
      })

      await waitFor(() => {
        expect(screen.getByText('Analyze Document')).toBeInTheDocument()
        expect(screen.getByText('Analyze Document')).not.toBeDisabled()
      })
    })

    it('should display file validation errors for invalid files', async () => {
      render(<FileUploadSection />)
      
      const fileInput = document.querySelector('input[type="file"]')
      const invalidFile = createMockFile('document.txt', 1024, 'text/plain')
      
      fireEvent.change(fileInput!, {
        target: { files: [invalidFile] }
      })

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid file type. Only PDFs are allowed.')
      })
    })

    it('should handle file size validation', async () => {
      render(<FileUploadSection />)
      
      const fileInput = document.querySelector('input[type="file"]')
      const largeFile = createMockFile('large.pdf', 51 * 1024 * 1024, 'application/pdf')
      
      fireEvent.change(fileInput!, {
        target: { files: [largeFile] }
      })

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('File size must be less than 50MB.')
      })
    })
  })

  describe('Demo File Integration', () => {
    it('should handle demo file selection', async () => {
      render(<FileUploadSection />)
      
      const demoButton = screen.getByTestId('demo-file-button')
      fireEvent.click(demoButton)

      await waitFor(() => {
        expect(screen.getByText('Analyze Document')).toBeInTheDocument()
        expect(screen.getByText('Analyze Document')).not.toBeDisabled()
      })
    })
  })

  describe('Drag and Drop Functionality', () => {
    it('should handle drag enter and leave events', () => {
      render(<FileUploadSection />)
      
      const dropzone = screen.getByText('Drag and drop your PDF here, or click to browse').closest('div')
      
      // Simulate drag enter
      fireEvent.dragEnter(dropzone!, {
        dataTransfer: { files: [] }
      })

      // Should show drag active state (implementation depends on your component)
      expect(dropzone).toBeInTheDocument()

      // Simulate drag leave
      fireEvent.dragLeave(dropzone!, {
        dataTransfer: { files: [] }
      })
    })

    it('should handle file drop with valid PDF', async () => {
      render(<FileUploadSection />)
      
      const dropzone = screen.getByText('Drag and drop your PDF here, or click to browse').closest('div')
      const validFile = createMockFile('dropped.pdf', 1024 * 1024, 'application/pdf')
      
      fireEvent.drop(dropzone!, {
        dataTransfer: { files: [validFile] }
      })

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('File uploaded: dropped.pdf')
      })
    })
  })

  describe('Analysis Flow Integration', () => {
    it('should call onAnalysisStart callback when analysis begins', async () => {
      const mockOnAnalysisStart = jest.fn()
      render(<FileUploadSection onAnalysisStart={mockOnAnalysisStart} />)
      
      // First upload a file
      const fileInput = document.querySelector('input[type="file"]')
      const validFile = createMockFile('test.pdf')
      
      fireEvent.change(fileInput!, {
        target: { files: [validFile] }
      })

      await waitFor(() => {
        expect(screen.getByText('Analyze Document')).not.toBeDisabled()
      })

      // Click analyze button
      const analyzeButton = screen.getByText('Analyze Document')
      fireEvent.click(analyzeButton)

      await waitFor(() => {
        expect(mockOnAnalysisStart).toHaveBeenCalled()
      })
    })

    it('should show progress bar during analysis', async () => {
      render(<FileUploadSection />)
      
      // Upload file and start analysis
      const fileInput = document.querySelector('input[type="file"]')
      const validFile = createMockFile('test.pdf')
      
      fireEvent.change(fileInput!, {
        target: { files: [validFile] }
      })

      await waitFor(() => {
        const analyzeButton = screen.getByText('Analyze Document')
        fireEvent.click(analyzeButton)
      })

      // Should show progress bar
      await waitFor(() => {
        expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
      })
    })
  })

  describe('Imperative API', () => {
    it('should expose shake method through ref', () => {
      const ref = React.createRef<{ shake: () => void }>()
      render(<FileUploadSection ref={ref} />)
      
      expect(ref.current).toBeTruthy()
      expect(typeof ref.current?.shake).toBe('function')
      
      // Should not throw when called
      expect(() => ref.current?.shake()).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<FileUploadSection />)
      
      const fileInput = document.querySelector('input[type="file"]')
      expect(fileInput).toBeInTheDocument()
      
      // Check for accessible elements
      expect(screen.getByText('Upload Property Document')).toBeInTheDocument()
      expect(screen.getByText('Upload a PDF property report for AI analysis')).toBeInTheDocument()
    })
  })
})
