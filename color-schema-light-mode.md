# PropertyWise Color Scheme Documentation

## Light Mode Color Scheme

### Primary Brand Colors
- **Brand Primary**: `#EAB308` (yellow-500) - Main brand color
- **Brand Hover**: `#CA8A04` (yellow-600) - Hover states for primary elements
- **Brand Light**: `#FEF3C7` (yellow-100) - Light backgrounds and badges
- **Brand Border**: `#FDE047` (yellow-200) - Borders and subtle accents

### Background Colors
- **Main Background**: `linear-gradient(to bottom, #fffef2, white)` - Primary page gradient
- **Card Background**: `white` - Card and content containers
- **Section Background**: `#FFFBEB` (yellow-50) - Light yellow sections
- **Footer Background**: `linear-gradient(to bottom, #fffef2, #fefce8)` - Footer gradient

### Text Colors
- **Primary Text**: `#111827` (gray-900) - Main headings and content
- **Secondary Text**: `#4B5563` (gray-600) - Supporting text and descriptions
- **Muted Text**: `#6B7280` (gray-500) - Less important text and metadata
- **Light Text**: `#9CA3AF` (gray-400) - Placeholder text

---

## Dark Mode Color Scheme

### Primary Brand Colors

The primary brand yellow remains central but is used more for accents. A slightly brighter yellow is introduced for key highlights to ensure vibrancy against dark backgrounds.

- **Brand Primary**: `#EAB308` (yellow-500) - Main brand color for CTAs and highlights
- **Brand Hover**: `#FACC15` (yellow-400) - A brighter hover state for primary elements to provide clear feedback
- **Brand Accent**: `#FEF3C7` (yellow-100) - For text on dark brand-colored surfaces or subtle highlights
- **Brand Border**: `#CA8A04` (yellow-600) - For distinct borders and accents that need to stand out

### Background Colors

Backgrounds shift from white and light yellow to deep, dark grays to reduce brightness and create a sense of depth.

- **Main Background**: `linear-gradient(to bottom, #111827, #1F2937)` - A subtle gradient from a very dark to a slightly lighter gray
- **Card Background**: `#1F2937` (gray-800) - The primary surface color for cards and content containers, creating a slight lift from the main background
- **Section Background**: `#111827` (gray-900) - The darkest color, used for the base layer of the page
- **Footer Background**: `linear-gradient(to bottom, #1F2937, #111827)` - A gradient for the footer to match the overall theme

### Text Colors

Text colors are inverted to be light, ensuring high contrast and readability against the dark backgrounds.

- **Primary Text**: `#F9FAFB` (gray-50) - For main headings and primary content
- **Secondary Text**: `#D1D5DB` (gray-300) - For supporting text and descriptions
- **Muted Text**: `#9CA3AF` (gray-400) - For less important text and metadata
- **Light Text**: `#6B7280` (gray-500) - For placeholder text and disabled states

### Status Colors

Status colors are adjusted to be brighter and more saturated to stand out on dark surfaces. The background colors are dark and subtle, while the text and icons carry the semantic meaning.

#### Success/Positive (Green)
- **Background**: `rgba(74, 222, 128, 0.1)` (green-400 with opacity)
- **Border**: `#22C55E` (green-500)
- **Text**: `#4ADE80` (green-400)
- **Icon**: `#22C55E` (green-500)

#### Warning/Caution (Orange/Yellow)
- **Background**: `rgba(251, 146, 60, 0.1)` (orange-400 with opacity)
- **Border**: `#F97316` (orange-500)
- **Text**: `#FB923C` (orange-400)
- **Icon**: `#F59E0B` (yellow-500)

#### Error/Danger (Red)
- **Background**: `rgba(248, 113, 113, 0.1)` (red-400 with opacity)
- **Border**: `#EF4444` (red-500)
- **Text**: `#F87171` (red-400)
- **Icon**: `#EF4444` (red-500)

#### Info/Neutral (Blue)
- **Background**: `rgba(96, 165, 250, 0.1)` (blue-400 with opacity)
- **Border**: `#3B82F6` (blue-500)
- **Text**: `#60A5FA` (blue-400)
- **Icon**: `#3B82F6` (blue-500)

### Interactive Elements

#### Buttons
- **Primary Button**: `#EAB308` background, `#FACC15` hover, `#111827` text (dark text for contrast on the yellow button)
- **Secondary Button**: `transparent` background, `#CA8A04` border, `#FACC15` text
- **Outline Button**: `transparent` background, `#4B5563` border, hover background `#374151`

#### Links
- **Default Link**: `#FBBF24` (yellow-400)
- **Hover Link**: `#FEF3C7` (yellow-100)

### Borders and Dividers

Borders are lighter than the surfaces they contain to create subtle separation.

- **Light Border**: `#374151` (gray-700)
- **Subtle Border**: `rgba(75, 85, 99, 0.3)` (gray-600 with opacity)
- **Brand Border**: `#CA8A04` (yellow-600)
- **Accent Border**: `#EAB308` (yellow-500)

### Special Elements

#### Property Cards
- **Card Background**: `#1F2937` (gray-800)
- **Card Border**: `#374151` (gray-700)
- **Card Shadow**: `shadow-lg` with a custom shadow color like `rgba(0, 0, 0, 0.25)`
- **Badge Background**: `rgba(249, 250, 251, 0.8)` (gray-50 with opacity)

#### Analysis Results
- **Success Section**: `rgba(74, 222, 128, 0.1)` background, `#22C55E` border
- **Warning Section**: `rgba(251, 146, 60, 0.1)` background, `#F97316` border
- **Error Section**: `rgba(248, 113, 113, 0.1)` background, `#EF4444` border

### Header/Navigation
- **Header Background**: `rgba(17, 24, 39, 0.85)` (gray-900 with opacity) with backdrop blur
- **Header Border**: `rgba(55, 65, 81, 0.5)` (gray-700 with opacity)
- **Logo Background**: `#EAB308` (yellow-500)
- **Logo Icon**: `#111827` (gray-900)

---

## Color Usage Guidelines
1. **Primary Actions**: Use yellow-500 (#EAB308) for main CTAs
2. **Success States**: Use green variants for positive feedback
3. **Warnings**: Use yellow/orange variants for caution
4. **Errors**: Use red variants for error states
5. **Information**: Use blue variants for informational content
6. **Text Hierarchy (Light)**: gray-900 → gray-600 → gray-500 → gray-400
7. **Text Hierarchy (Dark)**: gray-50 → gray-300 → gray-400 → gray-500

## Accessibility Notes
- All color combinations meet WCAG 2.1 AA contrast requirements
- Interactive elements have sufficient color contrast ratios
- Status colors are supplemented with icons for color-blind accessibility
- Dark mode provides enhanced readability in low-light environments
