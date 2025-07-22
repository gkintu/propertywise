import { AnalyzePdfRequestSchema } from '@/lib/validation'
import { cn } from '@/lib/utils'

describe('Integration: Validation and Utils Working Together', () => {
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

  describe('File validation with UI state management', () => {
    it('should validate file and generate appropriate CSS classes', () => {
      const validFile = createMockFile('document.pdf', 1024 * 1024, 'application/pdf')
      const validationResult = AnalyzePdfRequestSchema.safeParse({
        file: validFile,
        language: 'en'
      })

      // File validation passes
      expect(validationResult.success).toBe(true)

      // Generate CSS classes based on validation state
      const uploadZoneClasses = cn(
        'border-2 rounded-lg p-6 transition-colors',
        validationResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
      )

      expect(uploadZoneClasses).toContain('border-green-500')
      expect(uploadZoneClasses).toContain('bg-green-50')
      expect(uploadZoneClasses).not.toContain('border-red-500')
    })

    it('should handle validation errors with appropriate styling', () => {
      const invalidFile = createMockFile('document.txt', 1024, 'text/plain')
      const validationResult = AnalyzePdfRequestSchema.safeParse({
        file: invalidFile,
        language: 'en'
      })

      // File validation fails
      expect(validationResult.success).toBe(false)

      // Generate error state CSS classes
      const uploadZoneClasses = cn(
        'border-2 rounded-lg p-6 transition-colors',
        validationResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
      )

      expect(uploadZoneClasses).toContain('border-red-500')
      expect(uploadZoneClasses).toContain('bg-red-50')
      expect(uploadZoneClasses).not.toContain('border-green-500')

      // Verify error message
      if (!validationResult.success) {
        expect(validationResult.error.issues[0].message).toBe('Invalid file type. Only PDFs are allowed.')
      }
    })

    it('should handle file size validation with dynamic styling', () => {
      const largeFile = createMockFile('large.pdf', 51 * 1024 * 1024, 'application/pdf')
      const validationResult = AnalyzePdfRequestSchema.safeParse({
        file: largeFile,
        language: 'en'
      })

      expect(validationResult.success).toBe(false)

      // Generate button state classes based on validation
      const analyzeButtonClasses = cn(
        'px-6 py-2 rounded font-medium transition-all',
        validationResult.success 
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      )

      expect(analyzeButtonClasses).toContain('bg-gray-300')
      expect(analyzeButtonClasses).toContain('cursor-not-allowed')
      expect(analyzeButtonClasses).not.toContain('bg-yellow-500')
    })

    it('should demonstrate complete upload flow validation', () => {
      // Test multiple files and validation states
      const testCases = [
        {
          file: createMockFile('valid.pdf', 1024 * 1024, 'application/pdf'),
          language: 'en',
          shouldPass: true,
          expectedButtonState: 'enabled'
        },
        {
          file: createMockFile('invalid.doc', 1024 * 1024, 'application/msword'),
          language: 'en', 
          shouldPass: false,
          expectedButtonState: 'disabled'
        },
        {
          file: createMockFile('large.pdf', 51 * 1024 * 1024, 'application/pdf'),
          language: 'no',
          shouldPass: false,
          expectedButtonState: 'disabled'
        }
      ]

      testCases.forEach(({ file, language, shouldPass, expectedButtonState }) => {
        const result = AnalyzePdfRequestSchema.safeParse({ file, language })
        
        expect(result.success).toBe(shouldPass)
        
        const buttonClasses = cn(
          'analyze-button',
          result.success ? 'enabled' : 'disabled'
        )
        
        expect(buttonClasses).toContain(expectedButtonState)
      })
    })

    it('should handle language preprocessing correctly with utils', () => {
      const validFile = createMockFile()
      
      // Test language preprocessing (empty string should default to 'en')
      const resultWithEmptyLang = AnalyzePdfRequestSchema.safeParse({
        file: validFile,
        language: ''
      })
      
      expect(resultWithEmptyLang.success).toBe(true)
      if (resultWithEmptyLang.success) {
        expect(resultWithEmptyLang.data.language).toBe('en')
      }

      // Generate locale-specific CSS classes
      const localeClasses = cn(
        'text-base',
        resultWithEmptyLang.success && resultWithEmptyLang.data.language === 'en' 
          ? 'font-sans' 
          : 'font-serif'
      )

      expect(localeClasses).toContain('font-sans')
    })
  })

  describe('Error state management integration', () => {
    it('should create consistent error styling across different validation failures', () => {
      const errors = [
        { file: createMockFile('', 0, 'application/pdf'), errorType: 'empty' },
        { file: createMockFile('wrong.txt', 1024, 'text/plain'), errorType: 'type' },
        { file: createMockFile('huge.pdf', 60 * 1024 * 1024, 'application/pdf'), errorType: 'size' }
      ]

      errors.forEach(({ file, errorType }) => {
        const result = AnalyzePdfRequestSchema.safeParse({ file, language: 'en' })
        expect(result.success).toBe(false)

        // All errors should get consistent error styling
        const errorClasses = cn(
          'alert',
          'error-state',
          errorType === 'size' && 'size-error',
          errorType === 'type' && 'type-error',
          errorType === 'empty' && 'empty-error'
        )

        expect(errorClasses).toContain('alert')
        expect(errorClasses).toContain('error-state')
        expect(errorClasses).toContain(`${errorType}-error`)
      })
    })
  })
})
