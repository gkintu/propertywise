import { AnalyzePdfRequestSchema } from './validation'

describe('AnalyzePdfRequestSchema', () => {
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

  describe('file validation', () => {
    it('should accept valid PDF files', () => {
      const validFile = createMockFile('document.pdf', 1024 * 1024, 'application/pdf')
      const result = AnalyzePdfRequestSchema.safeParse({ 
        file: validFile, 
        language: 'en' 
      })
      
      expect(result.success).toBe(true)
    })

    it('should reject empty files', () => {
      const emptyFile = createMockFile('empty.pdf', 0, 'application/pdf')
      const result = AnalyzePdfRequestSchema.safeParse({ 
        file: emptyFile, 
        language: 'en' 
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File cannot be empty.')
      }
    })

    it('should reject files larger than 50MB', () => {
      const largeFile = createMockFile('large.pdf', 51 * 1024 * 1024, 'application/pdf')
      const result = AnalyzePdfRequestSchema.safeParse({ 
        file: largeFile, 
        language: 'en' 
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File size must be less than 50MB.')
      }
    })

    it('should reject non-PDF files', () => {
      const textFile = createMockFile('document.txt', 1024, 'text/plain')
      const result = AnalyzePdfRequestSchema.safeParse({ 
        file: textFile, 
        language: 'en' 
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid file type. Only PDFs are allowed.')
      }
    })

    it('should accept files at the 50MB limit', () => {
      const maxSizeFile = createMockFile('max.pdf', 50 * 1024 * 1024, 'application/pdf')
      const result = AnalyzePdfRequestSchema.safeParse({ 
        file: maxSizeFile, 
        language: 'en' 
      })
      
      expect(result.success).toBe(true)
    })
  })

  describe('language validation', () => {
    const validFile = createMockFile()

    it('should accept valid language codes', () => {
      const resultEn = AnalyzePdfRequestSchema.safeParse({ 
        file: validFile, 
        language: 'en' 
      })
      const resultNo = AnalyzePdfRequestSchema.safeParse({ 
        file: validFile, 
        language: 'no' 
      })
      
      expect(resultEn.success).toBe(true)
      expect(resultNo.success).toBe(true)
    })

    it('should default to "en" for empty or null language', () => {
      const resultEmpty = AnalyzePdfRequestSchema.safeParse({ 
        file: validFile, 
        language: '' 
      })
      const resultNull = AnalyzePdfRequestSchema.safeParse({ 
        file: validFile, 
        language: null 
      })
      
      expect(resultEmpty.success).toBe(true)
      expect(resultNull.success).toBe(true)
      
      if (resultEmpty.success) {
        expect(resultEmpty.data.language).toBe('en')
      }
      if (resultNull.success) {
        expect(resultNull.data.language).toBe('en')
      }
    })

    it('should reject invalid language codes', () => {
      const result = AnalyzePdfRequestSchema.safeParse({ 
        file: validFile, 
        language: 'fr' 
      })
      
      expect(result.success).toBe(false)
    })
  })

  describe('complete validation', () => {
    it('should require both file and language fields', () => {
      // Missing file
      const resultMissingFile = AnalyzePdfRequestSchema.safeParse({ 
        language: 'en' 
      })
      expect(resultMissingFile.success).toBe(false)

      // Missing language (should default to 'en')
      const validFile = createMockFile()
      const resultMissingLang = AnalyzePdfRequestSchema.safeParse({ 
        file: validFile 
      })
      expect(resultMissingLang.success).toBe(true)
      if (resultMissingLang.success) {
        expect(resultMissingLang.data.language).toBe('en')
      }
    })
  })
})
