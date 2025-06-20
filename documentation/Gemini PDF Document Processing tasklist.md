
### Task List: Upgrading to Gemini API Document Processing 

**Phase 1: Backend Integration with Gemini API (Core - `app/api/analyze-pdf/route.ts`)**

1.  **Refactor Imports if not done already, check if its done first:**
    *   [ ] Remove `PDFParser`, `fs`, `path`, `os` imports.
    *   [ ] Change `import { GoogleGenAI } from '@google/genai';` to `import { GoogleGenerativeAI, Part } from '@google/generative-ai';` (Note: `GoogleGenAI` might be an older or custom wrapper, ensure you're using the official `GoogleGenerativeAI`).

2.  **Initialize Gemini Client:**
    *   [ ] Update initialization if needed: `const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');` (You already have this mostly correct, just ensure `GoogleGenerativeAI` is used).

3.  **Update `POST` Function:**
    *   [ ] **Remove `pdf2json` Logic:**
        *   [ ] Delete all code related to `pdf2json` instantiation, event listeners (`pdfParser.on`), `parseBuffer`, `loadPDF`, and temporary file handling (`fs`, `os`, `path`). This includes the `new Promise<string>` block.
    *   [ ] **Direct PDF to Gemini:**
        *   [ ] After getting `file` as `File | null`, convert the file to a `Buffer` and then directly create a `Part` object suitable for Gemini.
            *   Replace:
                ```typescript
                const fileBuffer = Buffer.from(await file.arrayBuffer());
                // ... pdf2json logic ...
                const pdfText = await new Promise<string>(...);
                ```
            *   With:
                ```typescript
                const fileBuffer = Buffer.from(await file.arrayBuffer());
                const pdfPart = {
                    inlineData: {
                        data: Buffer.from(fileBuffer).toString('base64'),
                        mimeType: file.type, // 'application/pdf'
                    },
                };
                ```
            *   *Consideration for large files (optional):* If files can exceed ~20MB regularly (even though your frontend limits to 50MB), you'd use the Gemini File API for truly large documents, as discussed previously. For now, `inlineData` should be sufficient given the 50MB frontend limit.
    *   [ ] **Adjust `generateContent` Call:**
        
        *   [ ] **Contents:** Pass the `pdfPart` directly along with your `systemPrompt`.
            *   Replace:
                ```typescript
                contents: `${systemPrompt}\n\nDocument text to analyze:\n${truncatedText}`,
                ```
            *   With:
                ```typescript
                contents: [pdfPart, { text: systemPrompt }], // Or text: `${systemPrompt}\n\nAnalyze the attached document:`
                ```
            *   *Refinement:* Instead of embedding the system prompt into the `contents` string, it's better to pass it as a separate `text` part or utilize the `systemInstruction` parameter if your SDK version supports it. For `gemini-2.5-flash-lite-preview-06-17`, a `text` part with the instruction usually works well.
  
    *   [ ] **Response Parsing:** Keep your existing JSON parsing logic for `aiSummary` as it's robust for handling potential non-JSON responses from the AI.

**Phase 2: Frontend Refinements (User Experience & Robustness)**

1.  **Enhanced Error Handling & User Feedback:**
    *   [ ] **Toast Notifications:** Integrate a toast notification library (e.g., `sonner`) for more user-friendly error and success messages instead of `alert()`. can install it using npx shadcn@latest add sonner make the sure the styling and colors adheres to the rest of the page.
    *   [ ] **Specific Validation Messages:** Display more precise error messages for file type, size, and count directly in the UI, perhaps near the upload area or as toasts.
    *   [ ] **Visual Loading States:** Ensure buttons and input fields are disabled while `isLoading` is true.

2.  **Accessibility (A11y):**
    *   [ ] **ARIA Attributes for Drag & Drop:** Add `aria-live="polite"` to an element that displays dynamic messages (e.g., file upload status, errors) to ensure screen readers announce changes.
    *   [ ] **Keyboard Navigation:** Verify that all interactive elements (buttons, links, draggable area) are focusable and usable with a keyboard.
    *   [ ] **Semantic HTML:** Review if any elements can be replaced with more semantic HTML tags for better structure.

3.  **Component Structure & Reusability:**
    *   [ ] **Extract Upload Logic:** Create a separate custom hook (e.g., `useFileUpload`) or a dedicated `FileUpload` component to encapsulate the drag/drop, file selection, and validation logic. This will declutter the `Home` component.

4.  **Internationalization (i18n) Completion:**
    *   [ ] **Translate All Strings:** Review all hardcoded strings (e.g., "KEY FINDINGS" in recent analysis cards) and replace them with `t('...')` calls.

**Phase 3: Testing & Deployment**

1.  **Test Backend Integration:**
    *   [ ] Test the `/api/analyze-pdf` endpoint with various PDF files (valid, invalid types, oversized) to ensure it correctly interacts with the Gemini API and handles errors.
2.  **Test Frontend Functionality:**
    *   [ ] Test the entire upload flow with different scenarios (drag/drop, select, multiple files, wrong file type, large file) to verify frontend validation and error display.
3.  **End-to-End Testing:**
    *   [ ] Conduct end-to-end tests to ensure the complete process from file upload to displaying analysis results works seamlessly.
4.  **Deployment Considerations:**
    *   [ ] Ensure your environment variables for the Gemini API key are correctly configured for your deployment environment.
    *   [ ] Monitor backend logs for any API errors or issues.

This revised list provides a much clearer path to leveraging the Gemini API's native PDF understanding, which will make your backend cleaner, potentially faster, and less reliant on external PDF parsing libraries.