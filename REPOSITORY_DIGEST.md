# Playground Projects

## User Flow (Executive Summary)

1. **Visit Site**: User lands on the homepage, which adapts to their language and theme preferences (light/dark, English/Norwegian).
2. **Upload PDF**: User uploads a property report PDF (only housing reports, max 50MB, PDF only).
3. **AI Analysis**: The app extracts text and sends it to Google Gemini AI for analysis.
4. **Results**: User receives a clear summary with key findings and recommendations, structured as JSON.
5. **Localization & Theming**: All content is available in English/Norwegian and supports light/dark mode.

**Outcome:**
- Fast, AI-powered property document analysis
- Consistent, accessible, and localized user experience
- Robust error handling and user feedback

## 🚀 Features

- Analyze property PDF documents using Google Gemini AI (migrated from OpenAI/OpenRouter)
- Strict PDF validation: housing reports only, max 50MB
- File upload with drag-and-drop, validation, and toast notifications (sonner)
- Supports English and Norwegian with next-intl i18n (all user-facing text localized)
- Theme support for light and dark modes (Tailwind CSS)
- Yellow button styling for consistent UI
- Actionable property analysis with AI-generated summaries (JSON output)
- Default test PDFs included for demo/testing
- Modern motion/animation components (motion package)
- Accessibility and mobile responsiveness

## 📚 Requirements

- Node.js (v18+ recommended)
- npm or yarn
- For AI features: Google Gemini API key (set as environment variable)

## 📦 Installation

```bash
git clone <this-repo-url>
cd playground-projects
npm install
```

## 💡 Usage

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### PDF Analysis
- Upload a property PDF (housing report)
- The app extracts text and sends it to Gemini AI
- Get a summary with key findings, risks, and recommendations

### Internationalization
- Switch between English and Norwegian
- All user-facing text is localized

### Theming
- Toggle between light and dark mode
- UI adapts using CSS variables

## 📁 Folder Structure

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

## 🛠️ Stack

- [Next.js 15](https://nextjs.org/)
- [next-intl](https://github.com/amannn/next-intl)
- [Tailwind CSS](https://tailwindcss.com/)
- Google Gemini API

## 📝 License

MIT

## 🌐 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://github.com/amannn/next-intl)
- [Google Gemini API](https://ai.google.dev/)

---

> Replace 'hub' with 'ingest' in any GitHub URL to get a prompt-friendly extract of a codebase (see [gitingest](https://github.com/cyclotruc/gitingest)).

---

## 🆕 Recent Changes

- Migrated backend from OpenAI/OpenRouter to Google Gemini API (`@google/genai`)
- Improved file upload: PDF only, max 50MB, housing reports only, robust validation
- All user-facing text localized (English/Norwegian) via `next-intl`
- Full dark mode support and theme toggle on all pages
- Toast notifications for user feedback (sonner)
- Default test PDFs included for demo/testing
- Modernized motion/animation components (motion package)
- Accessibility and mobile responsiveness improvements
- Pending: Rate limiting, security features, further style and accessibility refinements
