import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from './useFileUpload'
import { toast } from 'sonner'

// Mock Vercel Blob
jest.mock('@vercel/blob/client', () => ({
  upload: jest.fn().mockResolvedValue({
    url: 'https://mock-blob-url.com/file.pdf'
  })
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: { fileName?: string }) => {
    const translations: Record<string, string> = {
      'upload.validation.invalidFileTypeDrop': 'Invalid file type. Only PDFs are allowed.',
      'upload.validation.fileSizeLimit': 'File size must be less than 50MB.',
      'upload.validation.multipleFilesDrop': 'Please select only one file at a time.',
      'upload.validation.multipleFilesSelect': 'Please select only one file at a time.',
      'upload.releaseToUpload': 'Release to upload',
      'upload.fileUploaded': `File uploaded: ${params?.fileName}`,
      'upload.fileSelected': `File selected: ${params?.fileName}`,
      'upload.fileRemoved': 'File removed',
      'upload.uploadFailed': 'Upload failed. Please try again.',
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

// Mock global fetch for blob verification and cleanup
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
  } as Response)
)

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
})

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => '[]'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
})

describe('useFileUpload', () => {
  // Common fixtures used across tests
  const validFile = new File(['%PDF-1.4 mock'], 'document.pdf', { type: 'application/pdf' })
  const invalidFile = new File(['i am not pdf'], 'image.png', { type: 'image/png' })
  const largeFile = new File(['x'.repeat(10)], 'large.pdf', { type: 'application/pdf' })
  // Override size to > 50MB
  Object.defineProperty(largeFile, 'size', { value: 52 * 1024 * 1024, writable: false })
  const file1 = new File(['%PDF-1.4'], 'a.pdf', { type: 'application/pdf' })
  const file2 = new File(['%PDF-1.4'], 'b.pdf', { type: 'application/pdf' })

  beforeEach(() => {
    jest.clearAllMocks()
    // Clear any timers or async operations
    jest.clearAllTimers()
    // Use fake timers to speed up tests
    jest.useFakeTimers()
    // Reset localStorage and sessionStorage mocks
    ;(window.localStorage.getItem as jest.Mock).mockReturnValue('[]')
    ;(window.sessionStorage.getItem as jest.Mock).mockReturnValue(null)
  })

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers()
  })

  // Helper function to create a mock File
  const createMockFile = (
    name: string = 'test.pdf',
    size: number = 1024 * 1024, // 1MB by default
    type: string = 'application/pdf'
  ): File => {
    const file = new File(['mock content'], name, { type })
    Object.defineProperty(file, 'size', {
      value: size,
      writable: false,
    })
    return file
  }

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFileUpload())

    expect(result.current.dragActive).toBe(false)
    expect(result.current.uploadedFiles).toEqual([])
    expect(result.current.statusMessage).toBe('')
    expect(result.current.fileInputRef.current).toBeNull()
  })

  describe('file management', () => {
    it('should add files using setUploadedFiles', () => {
      const { result } = renderHook(() => useFileUpload())
      const file = createMockFile('test.pdf')

      act(() => {
        result.current.setUploadedFiles([file])
      })

      expect(result.current.uploadedFiles).toHaveLength(1)
      expect(result.current.uploadedFiles[0]).toBe(file)
    })

    it('should remove files and clear status', () => {
      const { result } = renderHook(() => useFileUpload())
      const file = createMockFile('test.pdf')

      // First add a file
      act(() => {
        result.current.setUploadedFiles([file])
      })

      expect(result.current.uploadedFiles).toHaveLength(1)

      // Then remove it
      act(() => {
        result.current.removeFile()
      })

      expect(result.current.uploadedFiles).toHaveLength(0)
      expect(result.current.statusMessage).toBe('File removed')
    })

    it('should open file dialog', () => {
      const { result } = renderHook(() => useFileUpload())
      
      // Should not throw an error when called
      expect(() => {
        result.current.openFileDialog()
      }).not.toThrow()
    })
  })

  describe('drag state management', () => {
    it('should handle drag enter events', () => {
      const { result } = renderHook(() => useFileUpload())

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        type: 'dragenter'
      }

      act(() => {
        result.current.handleDrag(mockEvent as unknown as React.DragEvent)
      })

      expect(result.current.dragActive).toBe(true)
      expect(result.current.statusMessage).toBe('Release to upload')
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockEvent.stopPropagation).toHaveBeenCalled()
    })

    it('should handle drag leave events', () => {
      const { result } = renderHook(() => useFileUpload())

      // First activate drag
      const enterEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        type: 'dragenter'
      }

      act(() => {
        result.current.handleDrag(enterEvent as unknown as React.DragEvent)
      })

      // Then deactivate
      const leaveEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        type: 'dragleave'
      }

      act(() => {
        result.current.handleDrag(leaveEvent as unknown as React.DragEvent)
      })

      expect(result.current.dragActive).toBe(false)
      expect(result.current.statusMessage).toBe('')
    })
  })

  describe('file drop handling', () => {
    it('should handle valid PDF file drop', async () => {
      const { result } = renderHook(() => useFileUpload())
      
      // Fast-forward past the cleanup timeout
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          files: [validFile]
        }
      }

      await act(async () => {
        await result.current.handleDrop(mockEvent as unknown as React.DragEvent)
        // Fast-forward any internal timers
        jest.advanceTimersByTime(1000)
      })

      expect(result.current.uploadedFiles).toHaveLength(1)
      expect(result.current.uploadedFiles[0]).toBe(validFile)
      expect(result.current.dragActive).toBe(false)
      expect(result.current.statusMessage).toBe('File uploaded: document.pdf')
      expect(toast.success).toHaveBeenCalledWith('File uploaded: document.pdf')
    })

    it('should reject non-PDF files', async () => {
      const { result } = renderHook(() => useFileUpload())
      
      // Fast-forward past the cleanup timeout
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          files: [invalidFile]
        }
      }

      await act(async () => {
        await result.current.handleDrop(mockEvent as unknown as React.DragEvent)
      })

      expect(result.current.uploadedFiles).toHaveLength(0)
      expect(toast.error).toHaveBeenCalledWith('Invalid file type. Only PDFs are allowed.')
    })

    it('should reject files larger than 50MB', async () => {
      const { result } = renderHook(() => useFileUpload())
      
      // Fast-forward past the cleanup timeout
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          files: [largeFile]
        }
      }

      await act(async () => {
        await result.current.handleDrop(mockEvent as unknown as React.DragEvent)
      })

      expect(result.current.uploadedFiles).toHaveLength(0)
      expect(toast.error).toHaveBeenCalledWith('File size must be less than 50MB.')
    })

    it('should reject multiple files', async () => {
      const { result } = renderHook(() => useFileUpload())
      
      // Fast-forward past the cleanup timeout
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          files: [file1, file2]
        }
      }

      await act(async () => {
        await result.current.handleDrop(mockEvent as unknown as React.DragEvent)
      })

      expect(result.current.uploadedFiles).toHaveLength(0)
      expect(toast.error).toHaveBeenCalledWith('Please select only one file at a time.')
    })
  })

  describe('file input selection', () => {
    it('should handle valid file selection', async () => {
      const { result } = renderHook(() => useFileUpload())
  const validFile = new File(['%PDF-1.4'], 'selected.pdf', { type: 'application/pdf' })
      
      // Fast-forward past the cleanup timeout
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      const mockEvent = {
        target: {
          files: [validFile],
          value: ''
        }
      }

      await act(async () => {
        await result.current.handleFileSelect(mockEvent as unknown as React.ChangeEvent<HTMLInputElement>)
        // Fast-forward any internal timers
        jest.advanceTimersByTime(1000)
      })

      expect(result.current.uploadedFiles).toHaveLength(1)
      expect(result.current.uploadedFiles[0]).toBe(validFile)
      expect(result.current.statusMessage).toBe('File selected: selected.pdf')
      expect(toast.success).toHaveBeenCalledWith('File selected: selected.pdf')
    })

    it('should clear input on validation error', () => {
      const { result } = renderHook(() => useFileUpload())
      
      // Fast-forward past the cleanup timeout
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      const mockTarget = {
  files: [invalidFile],
        value: 'some-value'
      }

      const mockEvent = {
        target: mockTarget
      }

      act(() => {
        result.current.handleFileSelect(mockEvent as unknown as React.ChangeEvent<HTMLInputElement>)
      })

      expect(result.current.uploadedFiles).toHaveLength(0)
      expect(mockTarget.value).toBe('')
      expect(toast.error).toHaveBeenCalledWith('Invalid file type. Only PDFs are allowed.')
    })
  })
})
