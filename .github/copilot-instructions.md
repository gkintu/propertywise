# Repository Custom Instructions for GitHub Copilot

## Project Overview
This is a Next.js 15 property analysis application that uses Google Gemini AI to analyze PDF property documents. The app supports English and Norwegian locales with internationalization (i18n) using next-intl.

## Extras
- Never run npm run build automatically without confirming with me first.
- Start all your answers with 🤖 emoji

## Architecture Patterns

### Next.js App Router Structure
- Use the `[locale]` dynamic route structure for i18n: `app/[locale]/page.tsx`
- API routes in `app/api/` handle server-side logic (e.g., `/api/analyze-pdf/route.ts`)
- **Critical**: Middleware handles rate limiting, CSP headers, and locale routing BUT API routes (`/api/*`) bypass i18n middleware to prevent routing conflicts
- Use `use(params)` pattern for accessing route params in async components

### Component Architecture
- Components organized by function: `ui/`, `upload/`, `motion/`, `theme/`, `locale/`
- Use `forwardRef` with TypeScript interfaces for imperative component APIs (see `FileUploadSection`)
- Motion components follow a barrel export pattern from `components/motion/index.ts`
- **Hydration-safe components**: Use `ClientOnly` wrapper to prevent SSR mismatches for theme-dependent or browser-only features

### State Management & Data Flow
- React hooks pattern with custom hooks (e.g., `useFileUpload`) for complex logic
- Form handling with Zod validation schemas in `lib/validation.ts`
- Type definitions centralized in `lib/types.ts` with strict interfaces (`PropertyAnalysis`, `AnalysisResponse`)
- Feature flags system in `lib/feature-flags.ts` using environment variables - **requires dev server restart** for changes
- LocalStorage used for analysis results persistence between navigation (`analysisResult`, `analysisError`, `analysisErrorType`)

## Development Guidelines

### Internationalization (i18n)
- Always update both `messages/no.json` and `messages/en.json` for user-facing text
- Use `useTranslations('HomePage')` hook pattern for component translations
- Locale routing handled by `next-intl` middleware in `i18n/routing.ts` config
- **Critical**: API routes are excluded from i18n middleware to prevent 404 errors

### Theme Support
- Implement dual theme support: `bg-white/85 dark:bg-[#111827]/85` pattern
- Use `next-themes` with `ThemeProvider` wrapper in app layout
- **Wrap theme-dependent components in `ClientOnly`** to prevent hydration issues
- Test all visual changes in both light and dark theme modes

### Motion & Animations
- Motion components use the new `motion` package (successor to framer-motion): import from `motion/react`
- Barrel exports from `components/motion/index.ts` for consistent imports
- `ShakeMotion` with imperative API via `useImperativeHandle` for error feedback
- Performance: Use `whileHover`, `initial`, `animate` props consistently across motion components

### API & External Integrations
- Google Gemini API integration in `/api/analyze-pdf/route.ts` with two-step analysis (document classification → property analysis)
- Rate limiting with Upstash Redis using sliding window (5 requests/60s) - gracefully handles Redis unavailability
- File upload validation: 50MB size limit, PDF-only MIME types, validated with Zod schemas
- Environment variable checks before API calls with descriptive error messages
- **Structured JSON responses** using Gemini's `responseSchema` for consistent data parsing

### Security & Performance
- CSP headers with nonces generated in middleware - **API routes get separate CSP handling**
- Rate limiting by IP address for API endpoints with fallback when Redis unavailable
- Form validation with Zod schemas on both client and server
- File size and type validation on both client and server

### Yellow Button Styling
- Every yellow button uses: `className="bg-yellow-500 hover:bg-[#FACC15] dark:hover:bg-[#f6c40c] text-white dark:text-[#111827] px-8"`
- This ensures consistent appearance across themes and hover states

### Development Workflow
- Use the existing VS Code task "Start Development Server" (`npm run dev`)
- Never expose secret keys or modify .env files without confirmation
- Feature flags control UI elements (property search, recent analysis, etc.) - **restart required for changes**
- Demo PDF files available in `public/demo-pdfs/` for testing analysis flow
- Debug mode controlled by `NODE_ENV=development` shows additional analysis metadata

### Error Handling & User Experience
- Analysis errors stored in localStorage with specific error types (`invalid_document_type`, `insufficient_property_data`, etc.)
- Progress bar component (`AnalysisProgressBar`) with staged animation for long-running operations
- Toast notifications using `sonner` with custom icons and theme awareness
- Graceful fallbacks for feature flags, Redis unavailability, and API errors