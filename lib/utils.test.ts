import { cn, formatCurrency, getCurrencySymbol } from './utils'

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

describe('Currency Utils', () => {
  describe('formatCurrency', () => {
    it('should format NOK currency correctly', () => {
      const result = formatCurrency(1234567, 'NOK', 'nb-NO');
      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('567');
    });

    it('should format USD currency correctly', () => {
      const result = formatCurrency(1234567, 'USD', 'en-US');
      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('567');
    });

    it('should format EUR currency correctly', () => {
      const result = formatCurrency(1234567, 'EUR', 'de-DE');
      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('567');
    });

    it('should fallback to basic formatting for unknown currency', () => {
      const result = formatCurrency(1234567, 'UNKNOWN');
      expect(result).toBe('1,234,567 UNKNOWN');
    });

    it('should default to NOK when no currency provided', () => {
      const result = formatCurrency(100000);
      expect(result).toContain('100');
      expect(result).toContain('000');
    });
  });

  describe('getCurrencySymbol', () => {
    it('should return currency symbol for NOK', () => {
      const symbol = getCurrencySymbol('NOK', 'nb-NO');
      expect(typeof symbol).toBe('string');
      expect(symbol.length).toBeGreaterThan(0);
    });

    it('should return currency symbol for USD', () => {
      const symbol = getCurrencySymbol('USD', 'en-US');
      expect(typeof symbol).toBe('string');
      expect(symbol.length).toBeGreaterThan(0);
    });

    it('should fallback to currency code for unknown currency', () => {
      const symbol = getCurrencySymbol('UNKNOWN');
      expect(symbol).toBe('UNKNOWN');
    });

    it('should default to NOK when no currency provided', () => {
      const symbol = getCurrencySymbol();
      expect(typeof symbol).toBe('string');
      expect(symbol.length).toBeGreaterThan(0);
    });
  });
})
