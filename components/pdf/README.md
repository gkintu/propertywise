# AnalysisReportPDF Component

This document provides an overview of the `AnalysisReportPDF` component, its purpose, structure, and usage.

## Overview

The `AnalysisReportPDF` component is a React component designed to generate a professional, well-formatted PDF document from property analysis data. It uses `@react-pdf/renderer` to construct the PDF, ensuring a consistent and high-quality output that mirrors the design of the web interface.

The component takes property analysis data and a translation function as props and renders a multi-section report, complete with branding, dynamic content, and a clean layout.

## Component Structure

The generated PDF is structured into several distinct sections:

1.  **Header**: Displays the "PropertyWise" branding with a logo.
2.  **Main Title**: Shows the property address and the date the report was generated.
3.  **Summary Card**: A brief, high-level summary of the analysis.
4.  **Market Position**: A concise overview of the property's key details (e.g., bedrooms, price, size, year built).
5.  **Key Findings**: The core of the report, split into two columns:
    *   **Strong Selling Points**: A list of positive aspects of the property.
    *   **Areas of Concern**: A list of potential issues or drawbacks.
6.  **Bottom Line**: A concluding summary or final assessment.
7.  **Footer**: Contains a static credit to the "AI Property Analysis Tool."

## Key Features

### Dynamic Content Rendering

The component is designed to handle dynamic data. The "Strong Selling Points," "Areas of Concern," and "Summary" sections are rendered conditionally based on the `analysisData` prop.

### Page Break Prevention with `wrap={false}`

A critical feature of this component is the use of the `wrap={false}` prop on certain `<View>` elements. Specifically, it is applied to:

-   Each item card within "Strong Selling Points" (`strongPointItem`).
-   Each item card within "Areas of Concern" (`concernItem`).
-   The "Bottom Line" alert box (`bottomLineAlert`).

**Reasoning**: The content for these sections is dynamic and can vary in length. Without `wrap={false}`, `@react-pdf/renderer` might split a single card or the bottom line text across two pages if it falls near a page break. This would result in a disjointed and unprofessional-looking report. By setting `wrap={false}`, we instruct the renderer to treat each of these elements as an atomic unit, ensuring they are never broken apart. If an element doesn't fit on the current page, it is moved to the next page entirely.

### Styling

The component uses the `StyleSheet` object from `@react-pdf/renderer` to define styles that closely match the web application's UI, ensuring brand consistency between the on-screen view and the generated PDF.

## Props

| Prop          | Type                 | Description                                             |
|---------------|----------------------|---------------------------------------------------------|
| `analysisData`| `PropertyAnalysis`   | An object containing all the data for the report.       |
| `t`           | `TranslationFunction`| A function for internationalization (i18n) of static text. |

## Usage Example

Here is a basic example of how to use the `AnalysisReportPDF` component:

```tsx
import { PDFViewer } from '@react-pdf/renderer';
import { AnalysisReportPDF } from './AnalysisReportPDF';
import { useTranslation } from 'your-i18n-library';
import { PropertyAnalysis } from '@/lib/types';

const MyReportPage = () => {
  const { t } = useTranslation();
  
  const sampleData: PropertyAnalysis = {
    // ... your analysis data object
  };

  return (
    <PDFViewer width="1000" height="600">
      <AnalysisReportPDF analysisData={sampleData} t={t} />
    </PDFViewer>
  );
};
```
