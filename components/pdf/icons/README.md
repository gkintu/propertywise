# PDF Icons Usage Guide

This document explains how to use Lucide React icons in PDF documents rendered with @react-pdf/renderer.

## Problem

Lucide React icons are SVG-based components that work perfectly in regular React applications but don't render in PDFs generated with @react-pdf/renderer. This is because @react-pdf/renderer has its own rendering engine that doesn't support React SVG components directly.

## Solution

We've created a custom icon system that translates Lucide React icons into @react-pdf/renderer compatible SVG components.

## Components

### 1. `PDFIcon`

The core component that renders SVG icons compatible with @react-pdf/renderer.

```tsx
import { PDFIcon } from '@/components/pdf/icons';

// Basic usage
<PDFIcon name="CheckCircle" size={16} color="#059669" />
```

### 2. `LucideIconForPDF`

A wrapper component that converts Lucide icon names to PDF-compatible icons.

```tsx
import { LucideIconForPDF } from '@/components/pdf/icons';

// Convert Lucide icon names
<LucideIconForPDF iconName="CheckCircle" size={16} color="#059669" />
<LucideIconForPDF iconName="AlertTriangle" size={14} color="#DC2626" />
```

### 3. Pre-built Icon Components

Ready-to-use icon components with sensible defaults:

```tsx
import { 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  HomeIcon,
  ClockIcon,
  MapPinIcon,
  BedIcon,
  BathIcon,
  CarIcon 
} from '@/components/pdf/icons';

// With default colors and sizes
<CheckCircleIcon />
<AlertTriangleIcon />

// With custom props
<CheckCircleIcon size={20} color="#10B981" />
```

## Available Icons

| Icon Name | Lucide Equivalent | Default Color | Usage |
|-----------|------------------|---------------|--------|
| CheckCircle | CheckCircle, CircleCheck | #059669 | Success states |
| AlertTriangle | AlertTriangle, TriangleAlert | #DC2626 | Warnings, errors |
| Home | Home | #000000 | Property, home icons |
| Clock | Clock | #6B7280 | Time, timestamps |
| MapPin | MapPin | #6B7280 | Location markers |
| Bed | Bed | #6B7280 | Bedroom count |
| Bath | Bath | #6B7280 | Bathroom count |
| Car | Car | #6B7280 | Parking, garage |
| Search | Search | #000000 | Search functionality |
| Upload | Upload | #000000 | File uploads |
| X | X | #000000 | Close, delete |

## Implementation Example

Here's how the icons are used in the `AnalysisReportPDF` component:

```tsx
import { CheckCircleIcon, AlertTriangleIcon, HomeIcon } from './icons';

// PropertyWise brand header
<View style={styles.brandHeader}>
  <HomeIcon size={16} color="#EAB308" />
  <Text style={styles.brandText}>PropertyWise</Text>
</View>

// Strong points with check icons
{analysisData?.strongPoints?.map((point, idx) => (
  <View key={idx} style={styles.strongPointItem}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
      <CheckCircleIcon size={12} color="#059669" />
      <Text style={styles.strongPointTitle}>{point.title}</Text>
    </View>
  </View>
))}

// Concerns with warning icons
{analysisData?.concerns?.map((concern, idx) => (
  <View key={idx} style={styles.concernItem}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
      <AlertTriangleIcon size={12} color="#DC2626" />
      <Text style={styles.concernTitle}>{concern.title}</Text>
    </View>
  </View>
))}

// Bottom line alert
<View style={styles.bottomLineAlert}>
  <View style={styles.bottomLineIcon}>
    <AlertTriangleIcon size={14} color="#CA8A04" />
  </View>
  <View style={styles.bottomLineContent}>
    <Text>{analysisData.bottomLine}</Text>
  </View>
</View>
```

## Adding New Icons

To add a new icon:

1. Extract the SVG path data from the Lucide React icon
2. Add it to the `iconPaths` object in `PDFIcon.tsx`
3. Add the mapping in `LucideIconForPDF.tsx`
4. Optionally create a convenience component in `index.tsx`

Example:

```tsx
// 1. Add to iconPaths in PDFIcon.tsx
NewIcon: {
  paths: ['M12 2L2 7v10c0 5.55 3.84 10 9 11 1.54.18 3.07.18 4.61 0C21.16 27 25 22.55 25 17V7l-10-5z'],
  viewBox: '0 0 24 24'
}

// 2. Add to lucideToIconName in LucideIconForPDF.tsx
'NewIcon': 'NewIcon',

// 3. Create convenience component in index.tsx
export const NewIconComponent = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="NewIcon" size={size} color={color} />
);
```

## Best Practices

1. **Size Guidelines**: Use 12-16px for inline icons, 20-24px for prominent icons
2. **Color Consistency**: Match your app's color scheme
3. **Performance**: Icons are lightweight and don't impact PDF generation performance
4. **Accessibility**: Consider using consistent colors that work in both light and dark themes

## Troubleshooting

### Icon Not Rendering
- Check that the icon name exists in the `iconPaths` object
- Verify the path data is correct
- Ensure proper import statements

### Styling Issues
- Use `flexDirection: 'row'` for horizontal layouts with icons
- Add `gap` or margin for proper spacing
- Use `alignItems: 'flex-start'` or `'center'` for alignment

### Missing Icons
- Check the console for warnings about missing icons
- Add the icon mapping if it doesn't exist
- Use the fallback Info icon for unknown icons

This icon system provides a seamless way to use familiar Lucide React icons in PDF documents while maintaining consistency with your web application's design.
