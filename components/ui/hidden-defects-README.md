# Hidden Defects Component

## Overview

The Hidden Defects feature adds a new section to PropertyWise that highlights common "hidden" property defects that buyers should be aware of when purchasing real estate. This feature helps users identify potential issues that may not be immediately visible during property viewings but could significantly impact their purchase decision.

## Features

### 📋 Hidden Defect Categories

The component identifies and analyzes seven key categories of hidden defects:

1. **Shared Debt (Fellesgjeld)** - Financial obligations shared with other owners
2. **Legal Deficiencies** - Permits, zoning violations, or legal compliance issues  
3. **Moisture & Water Damage** - Water damage, leaks, or moisture problems
4. **Rot, Fungus & Pests** - Structural damage from biological causes
5. **Electrical Faults** - Electrical system issues or code violations
6. **Drainage & Leaks** - Plumbing, drainage, or water system problems
7. **Roof & Structural Issues** - Roof damage, leaks, structural problems, or aging materials
8. **Environmental Hazards** - Asbestos, lead, PCBs, or other toxic materials

### 🎨 UI/UX Features

- **Accordion/Collapsible Design**: Each defect category is wrapped in a collapsible section for better organization
- **Visual Icons**: Each category has distinct icons for quick visual identification
- **Risk Level Indicators**: Color-coded badges showing low/medium/high risk levels
- **Progressive Disclosure**: Users can expand specific categories to see detailed information
- **Mobile-Friendly**: Responsive design that works on all screen sizes
- **Dark Mode Support**: Consistent theming across light and dark modes

### 📊 Structured Information

For each defect category, the component provides:

- **Signs to Look For**: 2-3 specific indicators to watch for during property inspection
- **Consequences**: Description of potential impact (financial, health, structural)
- **Preventive Measures**: Recommended actions before purchase (inspection, expert consultation)
- **Action Required**: Specific steps if defect is suspected or confirmed
- **Help Me Assess**: Interactive button for guided checklists (future enhancement)

## Technical Implementation

### API Schema Updates

The Gemini API schema now includes a `hiddenDefects` array with structured data for each defect:

```typescript
hiddenDefects: {
  type: "array",
  items: {
    type: "object", 
    properties: {
      category: { type: "string", enum: [...] },
      riskLevel: { type: "string", enum: ["low", "medium", "high"] },
      signsToLookFor: { type: "array", items: { type: "string" } },
      consequences: { type: "string" },
      preventiveMeasures: { type: "string" },
      actionRequired: { type: "string" }
    }
  }
}
```

### TypeScript Types

```typescript
interface HiddenDefect {
  category: 'shared_debt' | 'legal_deficiencies' | 'moisture_water_damage' | 'rot_fungus_pests' | 'electrical_faults' | 'drainage_leaks' | 'roof_structural_issues' | 'environmental_hazards';
  riskLevel: 'low' | 'medium' | 'high';
  signsToLookFor: string[];
  consequences: string;
  preventiveMeasures: string;
  actionRequired?: string;
}
```

### Component Architecture

```
components/ui/hidden-defects-section.tsx
├── HiddenDefectsSection (Main component)
├── Accordion from shadcn/ui
├── Card layout with purple theme
├── Risk level badges
└── Icon mapping for categories
```

## Files Modified

### Core Implementation
- `app/api/analyze-pdf/route.ts` - Updated Gemini API schema and system prompt
- `lib/types.ts` - Added HiddenDefect interface and updated PropertyAnalysis
- `components/ui/hidden-defects-section.tsx` - New component implementation
- `app/[locale]/analysis-result/page.tsx` - Integrated component into results page
- `components/pdf/AnalysisReportPDF.tsx` - Added PDF generation support

### Translations
- `messages/en.json` - English translations for all defect categories and UI text
- `messages/no.json` - Norwegian translations (Bokmål)

### Testing
- `components/ui/hidden-defects-section.test.tsx` - Component unit tests
- `app/[locale]/analysis-result/page.test.tsx` - Updated integration tests

### Dependencies
- Added `shadcn/ui accordion` component

## Usage

The Hidden Defects section automatically appears on analysis result pages when the AI identifies potential hidden defects in the property document. The component is positioned between the "Areas of Concern" section and the "Bottom Line" summary for optimal information flow.

### Integration Example

```tsx
{/* Hidden Defects Section */}
{analysisData?.hiddenDefects && analysisData.hiddenDefects.length > 0 && (
  <HiddenDefectsSection hiddenDefects={analysisData.hiddenDefects} />
)}
```

## Accessibility

- **Keyboard Navigation**: Full keyboard support for accordion interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure
- **Color Contrast**: Risk level colors meet WCAG accessibility standards
- **Focus Management**: Clear visual focus indicators for all interactive elements

## Testing

The feature includes comprehensive test coverage:

- ✅ Component rendering with various defect configurations
- ✅ Accordion expand/collapse functionality  
- ✅ Risk level display and color coding
- ✅ Responsive design and mobile compatibility
- ✅ Integration with analysis results page
- ✅ PDF generation with hidden defects section
- ✅ Empty state handling
- ✅ Accessibility compliance

## Future Enhancements

1. **Guided Assessment**: Interactive checklists for each defect category
2. **External Resources**: Links to relevant inspection services and guides
3. **Risk Calculator**: Dynamic risk scoring based on property age, location, etc.
4. **Expert Network**: Connect users with certified inspectors and specialists
5. **Historical Data**: Track common defects by property type and region

## Performance Considerations

- **Lazy Loading**: Component only renders when defects are present
- **Optimized Icons**: Lucide React icons are tree-shaken for minimal bundle size
- **Efficient Accordion**: Uses native browser capabilities for smooth animations
- **Responsive Images**: Icons scale appropriately across all device sizes

## Localization

The component supports full internationalization with:
- Norwegian (Bokmål) and English translations
- Culturally appropriate defect categories for Norwegian real estate market
- Localized risk terminology and action recommendations
