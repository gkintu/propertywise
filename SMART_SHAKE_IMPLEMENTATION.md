# Smart Shake Animation Implementation

## Problem
When users clicked "Start Free Analysis" button, it always shook the upload component, even when a file was already uploaded and ready for analysis. This was confusing because the user should be directed to the "Analyze Document" button instead.

## Solution
Implemented intelligent shake behavior that targets the appropriate UI element based on the current state:
- **No files uploaded**: Shake upload component to encourage file selection
- **Files ready**: Shake "Analyze Document" button to encourage analysis

## Changes Made

### 1. Enhanced FileUploadSection Interface
```tsx
export interface FileUploadSectionHandle {
  shake: () => void;                    // Shake upload component
  shakeAnalyzeButton: () => void;       // Shake analyze button
  hasFiles: () => boolean;              // Check if files are present
}
```

### 2. Added Analyze Button Reference
- Added `analyzeButtonRef` to track the analyze button
- Attached ref to the analyze button for direct animation control

### 3. Updated Imperative Handle
- **shake()**: Existing upload component shake (using ShakeMotion)
- **shakeAnalyzeButton()**: New inline CSS animation for analyze button
- **hasFiles()**: Returns current file state

### 4. CSS Animation
Added shake keyframes in `globals.css`:
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}
```

### 5. Smart Logic in Home Page
```tsx
const handleStartAnalysis = () => {
  if (fileUploadRef.current?.hasFiles()) {
    // Files exist → shake analyze button
    fileUploadRef.current?.shakeAnalyzeButton();
  } else {
    // No files → shake upload component
    fileUploadRef.current?.shake();
  }
  // Scroll to section
};
```

## User Experience Flow

### Scenario 1: No Files Uploaded
1. User clicks "Start Free Analysis"
2. 🔄 **Upload component shakes** (yellow border area)
3. 📜 Page scrolls to upload section
4. 👀 User sees they need to upload/select a file

### Scenario 2: File Ready for Analysis
1. User clicks "Start Free Analysis"
2. 🔄 **"Analyze Document" button shakes** (yellow button)
3. 📜 Page scrolls to upload section
4. 👀 User sees the analyze button is ready to click

## Benefits
- ✅ **Context-aware feedback**: Different animations for different states
- ✅ **Intuitive guidance**: Users understand exactly what to do next
- ✅ **Reduced confusion**: No conflicting UI signals
- ✅ **Smooth UX**: Appropriate feedback at each stage

## Files Modified
- `components/upload/FileUploadSection.tsx` - Added analyze button shake and state checking
- `app/[locale]/page.tsx` - Updated to use smart shake logic
- `app/globals.css` - Added shake animation keyframes

## Result
The "Start Free Analysis" button now provides intelligent feedback, shaking the appropriate UI element based on the current application state, creating a more intuitive and guided user experience.
