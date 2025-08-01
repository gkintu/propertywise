# Currency Support Documentation

## Overview
The PropertyWise application now supports multiple currencies for property listings. This allows users to upload property reports from different countries with their respective currencies.

## Supported Features

### Dynamic Currency Display
- The application automatically detects and displays the currency from the property data
- Falls back to NOK (Norwegian Kroner) if no currency is specified
- Supports all standard ISO currency codes (USD, EUR, SEK, DKK, etc.)

### Currency Implementation

#### PropertyDetails Interface
```typescript
export interface PropertyDetails {
  address: string;
  bedrooms: number;
  price: number;
  currency?: string; // Optional currency field (e.g., "NOK", "USD", "EUR")
  size: number;
  yearBuilt: number;
  propertyType: string;
}
```

#### Example Usage
```typescript
// Norwegian property (default)
const norwegianProperty: PropertyDetails = {
  address: "Storgata 1, Oslo",
  bedrooms: 3,
  price: 4500000,
  currency: "NOK", // or omit for default
  size: 85,
  yearBuilt: 2010,
  propertyType: "Apartment"
};

// Swedish property
const swedishProperty: PropertyDetails = {
  address: "Västerlånggatan 7, Stockholm",
  bedrooms: 2,
  price: 3200000,
  currency: "SEK",
  size: 72,
  yearBuilt: 2015,
  propertyType: "Apartment"
};

// US property
const usProperty: PropertyDetails = {
  address: "123 Main St, New York",
  bedrooms: 2,
  price: 850000,
  currency: "USD",
  size: 75,
  yearBuilt: 2018,
  propertyType: "Condo"
};
```

### Utility Functions

#### formatCurrency()
Formats currency with proper locale-specific formatting:
```typescript
formatCurrency(1234567, 'NOK', 'nb-NO') // "kr 1 234 567"
formatCurrency(1234567, 'USD', 'en-US') // "$1,234,567"
formatCurrency(1234567, 'EUR', 'de-DE') // "1.234.567 €"
```

#### getCurrencySymbol()
Gets the currency symbol for display:
```typescript
getCurrencySymbol('NOK', 'nb-NO') // "kr"
getCurrencySymbol('USD', 'en-US') // "$"
getCurrencySymbol('EUR', 'de-DE') // "€"
```

### UI Implementation

The currency is displayed in the analysis results:
- **Price section**: Shows formatted price with dynamic currency
- **PDF reports**: Include currency in property summary
- **Translation support**: Currency labels are properly localized

### Fallback Behavior

- If no currency is provided, defaults to "NOK"
- If an unrecognized currency code is used, displays the code as-is
- Graceful error handling for currency formatting issues

### Testing

Currency functionality is tested in `lib/utils.test.ts` with comprehensive test cases for:
- Different currency formatting
- Fallback scenarios
- Symbol extraction
- Locale-specific formatting
