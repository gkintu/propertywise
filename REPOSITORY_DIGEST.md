# PropertyWise: Repository Digest

---

```
propertywise/
├── app/
│   ├── [locale]/
│   │   ├── analysis-result/
│   │   ├── privacy/
│   │   ├── layout.tsx
│   └── page.tsxtive Summary

PropertyWise is a Next.js 15 application for AI-powered property document analysis. Users can upload Norwegian or English housing report PDFs, which are processed using Google Gemini AI to extract actionable insights. The app is fully localized (English/Norwegian), supports light/dark themes, and provides a modern, accessible UI. The backend is fully migrated to Gemini API, with robust PDF validation, rate limiting, and structured JSON output. Demo PDFs are included for testing, and all user-facing text is internationalized.

---


## Key Features

- **AI-Powered PDF Analysis**: Upload property documents in PDF format and receive a comprehensive analysis powered by the Google Gemini AI model. The backend is fully migrated to Gemini, with direct PDF-to-Gemini processing and structured JSON output.
- **Strict PDF Validation**: Only housing report PDFs are accepted (max 50MB). Robust client and server-side validation using Zod schemas. Non-housing PDFs are rejected with clear error messages.
- **Internationalization (i18n)**: All user-facing text is localized using `next-intl` (English/Norwegian). Language switcher included. Both `messages/en.json` and `messages/no.json` are always updated for new features.
- **Light & Dark Mode**: Full support for both themes, with a theme toggle and hydration-safe components. Consistent color scheme using Tailwind CSS and `next-themes`.
- **Modern UI & UX**: Uses shadcn/ui components, yellow button styling, and motion/animation for a polished experience. All visual changes are tested in both light and dark modes.
- **Accessibility & Responsiveness**: Mobile-friendly, keyboard accessible, and visually consistent across themes.
- **Feature Flags**: Static feature flag system (set via `.env.local`, requires server restart) controls UI features like property search and recent analysis.
- **Demo PDFs**: Two default test PDFs included in `public/demo-pdfs/` for demonstration and testing.
- **Comprehensive Testing Suite**: 23 automated tests covering validation, UI utilities, and integration workflows. Jest + React Testing Library setup ensures code quality without over-engineering.
- **Security & Rate Limiting**: Upstash Redis-based rate limiting (5 requests/60s), CSP headers, and robust error handling. API routes are excluded from i18n middleware for reliability.

---


## User Flow

1. **Visit Site**: Homepage adapts to language and theme preferences. Theme and locale switchers are available on all pages.
2. **Upload PDF**: User uploads a housing report PDF (max 50MB, only valid property reports accepted). Demo PDFs are available for quick testing.
3. **AI Analysis**: PDF is sent directly to Gemini API for analysis. The backend handles conversion, validation, and structured JSON output.
4. **Results**: User receives a structured summary with actionable insights (key findings, risks, recommendations, market position, etc.).
5. **Localization & Theming**: All content is available in both supported languages and themes. UI adapts instantly to user preferences.

---


## Project Structure

```
playground-projects/
├── app/
│   ├── [locale]/
│   │   ├── analysis-result/
│   │   ├── privacy/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── analyze-pdf/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── customized/
│   ├── hydration/
│   ├── locale/
│   ├── motion/
│   ├── pdf/
│   ├── theme/
│   ├── ui/
│   └── upload/
├── documentation/
├── hooks/
├── i18n/
├── lib/
│   ├── validation.test.ts
│   ├── utils.test.ts
│   ├── integration.test.ts
│   └── ...
├── messages/
├── public/
│   └── demo-pdfs/
├── snapshot/
├── MIGRATION_SUMMARY.md
├── PRIVACY_POLICY_README.md
├── README.md
├── REPOSITORY_DIGEST.md
├── ...
```

---


## Stack

- **Next.js 15** (App Router, TypeScript)
- **next-intl** (i18n)
- **Tailwind CSS** (theming, utility classes)
- **shadcn/ui** (UI components)
- **Jest + React Testing Library** (testing framework)
- **Google Gemini API** (AI analysis)
- **Vercel Blob**: Large file uploads and storage bypassing function payload limits
- **Upstash Redis** (rate limiting)

---


## Environment & Feature Flags

- **Feature Flags**: Set in `.env.local` (e.g., `NEXT_PUBLIC_ENABLE_PROPERTY_SEARCH`). Changes require a server restart.
- **Sensitive Data**: Never commit API keys or secrets. See `.env.local.example` for configuration. All environment variables are documented in `MIGRATION_SUMMARY.md`.

---


## Usage

### Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Testing

```bash
npm test           # Run all tests (23 tests)
npm test -- --watch    # Run tests in watch mode
```

**Test Coverage:**
- Validation tests (9): PDF upload security, file type/size validation
- UI utility tests (8): Tailwind CSS class management, styling consistency  
- Integration tests (6): Complete user workflows, validation + UI interactions

### PDF Analysis
- Upload a housing report PDF (max 50MB, only valid property reports accepted)
- The app sends the PDF directly to Gemini AI for analysis
- Receive a structured summary with key findings, risks, recommendations, and market position

### Internationalization
- Switch between English and Norwegian
- All user-facing text is localized and kept in sync

### Theming
- Toggle between light and dark mode
- UI adapts using CSS variables and is hydration-safe

---


## Best Practices

- **Keep digests concise and structured**: Use clear sections (summary, features, structure, usage, stack).
- **Show folder tree**: Provide a high-level directory tree for fast codebase orientation.
- **Highlight unique flows**: Summarize the main user journey and technical flow.
- **Document environment/config**: Note how to set up and run the project, and how to handle secrets/flags.
- **Update regularly**: Keep the digest in sync with major codebase changes.
- **Always update both translation files**: All user-facing text must be present in both `messages/en.json` and `messages/no.json`.
- **Test with demo PDFs**: Use the provided demo files in `public/demo-pdfs/` for consistent testing.
- **Run tests before commits**: Use `npm test` to ensure all 23 tests pass - covers validation, UI, and integration scenarios.
- **Keep tests focused**: Avoid the "hiring a security team for a lemonade stand" approach - test what matters without over-engineering.
- **Never commit secrets**: API keys and sensitive data must never be committed.

---


## License

MIT

---

## References
- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://github.com/amannn/next-intl)
- [Google Gemini API](https://ai.google.dev/)
- [Gitingest](https://github.com/cyclotruc/gitingest)
