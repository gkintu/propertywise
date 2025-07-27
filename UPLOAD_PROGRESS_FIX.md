# Upload Progress Indicator Implementation

## Changes Made

### Problem
Manual file uploads (drag & drop or file selection) had no loading indicators, leaving users unsure if the upload was in progress.

### Solution
Added comprehensive loading states for manual file uploads to match the demo file experience.

### FileUploadSection.tsx Updates

1. **Import Loader2 icon**: Added spinner icon for loading states
2. **Extract isUploading state**: Retrieved from useFileUpload hook
3. **Dynamic upload icon**: Shows spinner when uploading, upload icon when idle
4. **Dynamic text**: Shows "Uploading..." during upload, normal text when idle
5. **Disabled states**: Disables all interactions during upload:
   - File input
   - Browse button 
   - Drag & drop area
   - Demo files section
   - Remove file button

### Visual Changes
- **Upload area**: Spinner replaces upload icon, text changes to "Uploading..."
- **Browse button**: Changes text to "Uploading..." and gets disabled
- **Drag & drop**: Entire area becomes non-interactive during upload
- **Demo files**: Disabled during manual upload to prevent conflicts

### User Experience
- ✅ Clear visual feedback during upload
- ✅ Prevents multiple uploads simultaneously  
- ✅ Consistent with demo file loading experience
- ✅ Accessible with proper ARIA states

## Files Modified
- `components/upload/FileUploadSection.tsx` - Added upload loading states
- Translations already existed: `uploading: "Uploading..."` / `"Laster opp..."`

## Result
Users now see immediate feedback when uploading files manually, with clear loading indicators and disabled interactions during the upload process.
