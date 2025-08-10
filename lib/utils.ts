import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency with proper locale-specific formatting
 * @param amount - The numeric amount
 * @param currency - The currency code (e.g., "NOK", "USD", "EUR")
 * @param locale - The locale for formatting (defaults to 'nb-NO' for Norwegian)
 */
export function formatCurrency(amount: number, currency: string = 'NOK', locale: string = 'nb-NO'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback if currency is not recognized
    return `${amount.toLocaleString()} ${currency}`;
  }
}

/**
 * Get currency symbol for a given currency code
 * @param currency - The currency code (e.g., "NOK", "USD", "EUR")
 * @param locale - The locale for formatting (defaults to 'nb-NO' for Norwegian)
 */
export function getCurrencySymbol(currency: string = 'NOK', locale: string = 'nb-NO'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).formatToParts(0).find(part => part.type === 'currency')?.value || currency;
  } catch {
    // Fallback if currency is not recognized
    return currency;
  }
}
