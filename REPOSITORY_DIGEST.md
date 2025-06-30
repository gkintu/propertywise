# Playground Projects: Repository Digest

---

## Executive Summary

This repository is a Next.js 15 application for AI-powered property document analysis. It enables users to upload Norwegian or English housing report PDFs, which are processed using Google Gemini AI to extract actionable insights. The app is fully localized (English/Norwegian), supports light/dark themes, and provides a modern, accessible UI.

---

## Key Features

- **PDF Upload & Validation**: Drag-and-drop upload, strict PDF validation (housing reports only, max 50MB), robust error handling.
- **AI Analysis**: Extracts text from PDFs and analyzes them with Google Gemini AI, returning structured JSON summaries (key findings, risks, recommendations).
- **Internationalization (i18n)**: All user-facing text is localized using `next-intl` (English/Norwegian). Language switcher included.
- **Theming**: Full support for light and dark modes with a theme toggle. UI adapts using CSS variables and Tailwind CSS.
- **Consistent UI**: Yellow button styling and shadcn/ui components for a cohesive look.
- **Accessibility & Responsiveness**: Mobile-friendly, keyboard accessible, and visually consistent across themes.
- **Feature Flags**: Static feature flag system (set via `.env.local`, requires server restart).
- **Demo PDFs**: Default test PDFs included for demonstration and testing.

---

## User Flow

1. **Visit Site**: Homepage adapts to language and theme preferences.
2. **Upload PDF**: User uploads a property report (PDF, max 50MB).
3. **AI Analysis**: Text is extracted and analyzed by Gemini AI.
4. **Results**: User receives a structured summary with actionable insights.
5. **Localization & Theming**: All content is available in both supported languages and themes.

---

## Project Structure

```
playground-projects/
├── app/
│   ├── [locale]/
│   │   ├── analysis-result/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── analyze-pdf/
│   │       └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── customized/
│   │   └── spinner/
│   │       └── spinner-05.tsx
│   ├── hydration/
│   │   ├── ClientOnly.tsx
│   │   ├── HydrationSafe.tsx
│   │   └── index.ts
│   ├── locale/
│   │   └── LocaleSwitcher.tsx
│   ├── motion/
│   │   ├── CardMotion.tsx
│   │   ├── FadeIn.tsx
│   │   ├── PageTransition.tsx
│   │   ├── ScaleIn.tsx
│   │   ├── ShakeMotion.tsx
│   │   ├── ShakeMotionAlternative.tsx
│   │   ├── SlideIn.tsx
│   │   ├── StaggerContainer.tsx
│   │   ├── examples/
│   │   │   └── AnimatedFeatureCard.tsx
│   │   └── index.ts
│   ├── pdf/
│   │   ├── AnalysisReportPDF.tsx
│   │   ├── README.md
│   │   └── icons/
│   │       ├── IconDemoPDF.tsx
│   │       ├── LucideIconForPDF.tsx
│   │       ├── PDFIcon.tsx
│   │       ├── README.md
│   │       └── index.tsx
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── index.ts
│   ├── ui/
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── property-listing-badge.tsx
│   │   ├── separator.tsx
│   │   ├── sonner.tsx
│   │   └── textarea.tsx
│   └── upload/
│       └── FileUploadSection.tsx
├── documentation/
│   ├── Gemini API: PDF Document Processing documentation.md
│   ├── Gemini PDF Document Processing tasklist.md
│   ├── gemini-api-sdk-documentation
│   ├── html2pdf-pro.md
│   └── nextintl-documentation.md
├── hooks/
│   └── useFileUpload.ts
├── i18n/
│   ├── request.ts
│   └── routing.ts
├── lib/
│   ├── feature-flags.ts
│   ├── i18n-types.ts
│   ├── navigation.ts
│   ├── types.ts
│   └── utils.ts
├── messages/
│   ├── en.json
│   └── no.json
├── public/
│   └── ...
├── snapshot/
│   └── ...
├── MIGRATION_SUMMARY.md
├── PRIVACY_POLICY_README.md
├── README.md
├── REPOSITORY_DIGEST.md
├── REPOSITORY_SUMMARY.md
├── color-schema-light-mode.md
├── commands.md
├── components.json
├── features implementation.md
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── open-ai-sdk-docs.ts
├── package.json
├── pdf2jason-docu.md
├── postcss.config.mjs
├── task.txt
├── test_analysis_data.js
├── test_data_flow.js
├── tsconfig.json
```

---

## Stack

- **Next.js 15** (App Router, TypeScript)
- **next-intl** (i18n)
- **Tailwind CSS** (theming, utility classes)
- **shadcn/ui** (UI components)
- **Google Gemini API** (AI analysis)

---

## Environment & Feature Flags

- **Feature Flags**: Set in `.env.local` (e.g., `NEXT_PUBLIC_ENABLE_PROPERTY_SEARCH`). Changes require a server restart.
- **Sensitive Data**: Never commit API keys or secrets. See `.env.example` for configuration.

---

## Usage

### Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### PDF Analysis
- Upload a property PDF (housing report)
- The app extracts text and analyzes it with Gemini AI
- Get a summary with key findings, risks, and recommendations

### Internationalization
- Switch between English and Norwegian
- All user-facing text is localized

### Theming
- Toggle between light and dark mode
- UI adapts using CSS variables

---

## Best Practices (Inspired by Gitingest)

- **Keep digests concise and structured**: Use clear sections (summary, features, structure, usage, stack).
- **Show folder tree**: Provide a high-level directory tree for fast codebase orientation.
- **Highlight unique flows**: Summarize the main user journey and technical flow.
- **Document environment/config**: Note how to set up and run the project, and how to handle secrets/flags.
- **Update regularly**: Keep the digest in sync with major codebase changes.

---

## License

MIT

---

## References
- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://github.com/amannn/next-intl)
- [Google Gemini API](https://ai.google.dev/)
- [Gitingest](https://github.com/cyclotruc/gitingest)
