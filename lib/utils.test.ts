import { cn } from './utils'

describe('cn utility function', () => {
  it('should merge basic class names', () => {
    const result = cn('flex', 'items-center', 'justify-center')
    expect(result).toBe('flex items-center justify-center')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const isDisabled = false
    
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    )
    
    expect(result).toBe('base-class active-class')
  })

  it('should merge conflicting Tailwind classes correctly', () => {
    // twMerge should resolve conflicting classes, keeping the last one
    const result = cn('p-4', 'p-8')
    expect(result).toBe('p-8')
  })

  it('should handle empty and falsy values', () => {
    const result = cn('valid-class', '', null, undefined, false, 'another-class')
    expect(result).toBe('valid-class another-class')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['flex', 'items-center'], 'justify-center')
    expect(result).toBe('flex items-center justify-center')
  })

  it('should handle objects with conditional classes', () => {
    const result = cn({
      'flex': true,
      'hidden': false,
      'items-center': true
    }, 'justify-center')
    
    expect(result).toBe('flex items-center justify-center')
  })

  it('should return empty string for no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle complex Tailwind merge scenarios', () => {
    // Testing responsive and variant merging
    const result = cn(
      'bg-red-500 hover:bg-red-600',
      'bg-blue-500 hover:bg-blue-600'
    )
    
    // Should keep the last conflicting classes
    expect(result).toBe('bg-blue-500 hover:bg-blue-600')
  })
})
