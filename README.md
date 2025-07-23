# PropertyWise - AI-Powered Property Document Analysis

PropertyWise is a modern, AI-driven web application designed to streamline the analysis of property documents. By leveraging the power of Google's Gemini AI, users can upload PDF property reports and receive instant, insightful analysis. The application is built with Next.js 15 and supports both English and Norwegian languages, ensuring a seamless experience for a diverse user base.

## Key Features

- **AI-Powered PDF Analysis:** Upload property documents in PDF format and receive a comprehensive analysis powered by the Google Gemini AI model.
- **Internationalization (i18n):** Full support for English and Norwegian locales, allowing users to switch languages effortlessly.
- **Light & Dark Mode:** A beautifully designed interface with complete support for both light and dark themes.
- **Responsive Design:** A fully responsive layout that works on all devices, from desktops to mobile phones.
- **Modern Tech Stack:** Built with the latest technologies, including Next.js 15, React, and Tailwind CSS.
- **Rate Limiting:** Built-in rate limiting with Upstash Redis to ensure fair usage and prevent abuse.
- **Feature Flags:** Configurable features that can be enabled/disabled through environment variables.
- **PDF Report Generation:** Generate downloadable PDF reports of analysis results.
- **Demo Files:** Pre-loaded Norwegian property documents for testing the analysis functionality.
- **Animated UI:** Smooth animations using the Motion library (successor to Framer Motion).
- **Progress Tracking:** Real-time progress indicators during document analysis.
- **Testing Suite:** Comprehensive test coverage with Jest and React Testing Library.

## Getting Started

### Prerequisites

- Node.js (v20.x or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/gkintu/playground-projects.git
    cd playground-projects
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the necessary environment variables. You can use `.env.local.example` as a template.

    ```bash
    cp .env.local.example .env.local
    ```

    **Required environment variables:**
    - `GEMINI_API_KEY`: Your Google Gemini API key
    - `SITE_URL`: Your site URL (default: http://localhost:3000)
    - `APP_TITLE`: Application title (default: PropertyAI)
    
    **Optional environment variables (for enhanced features):**
    - `UPSTASH_REDIS_REST_URL`: Redis URL for rate limiting
    - `UPSTASH_REDIS_REST_TOKEN`: Redis token for rate limiting
    - Feature flags (set to 'true' to enable):
      - `FEATURE_PROPERTY_SEARCH`: Enable property search functionality
      - `FEATURE_RECENT_ANALYSIS`: Show recent analysis section
      - `FEATURE_DEMO_FILES`: Enable demo files section

### Running the Development Server

To run the application in development mode, use the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Technologies Used

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **AI:** [Google Gemini](https://ai.google.dev/)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
- **State Management:** [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- **Animation:** [Motion](https://motion.dev/) (successor to Framer Motion)
- **Theme Management:** [next-themes](https://github.com/pacocoursey/next-themes)
- **PDF Generation:** [@react-pdf/renderer](https://react-pdf.org/)
- **Rate Limiting:** [@upstash/ratelimit](https://github.com/upstash/ratelimit)
- **Validation:** [Zod](https://zod.dev/)
- **Testing:** [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Notifications:** [sonner](https://sonner.emilkowal.ski/)

## Project Structure

The project follows a standard Next.js App Router structure:

```
/
├── app/                  # Main application code
│   ├── [locale]/         # Internationalized routes
│   │   ├── page.tsx      # Home page
│   │   ├── analysis-result/ # Analysis results page
│   │   └── privacy/      # Privacy policy page
│   └── api/              # API routes
│       └── analyze-pdf/  # PDF analysis endpoint
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── upload/           # File upload components
│   ├── motion/           # Animation components
│   ├── theme/            # Theme-related components
│   ├── locale/           # Language switching components
│   ├── pdf/              # PDF report generation
│   └── hydration/        # SSR hydration utilities
├── hooks/                # Custom React hooks
├── i18n/                 # i18n configuration
├── lib/                  # Utility functions and types
├── messages/             # Translation files (en.json, no.json)
├── public/               # Static assets
│   └── demo-pdfs/        # Sample property documents
└── documentation/        # Project documentation
```

## Features

### AI-Powered Analysis
- Upload PDF property documents and receive comprehensive analysis
- Two-step analysis process: document classification → property analysis
- Structured JSON responses using Gemini's responseSchema
- Support for Norwegian property documents

### User Experience
- Progress bar with staged animations for long-running operations
- Real-time feedback and error handling
- Demo files available for testing
- Downloadable PDF reports of analysis results
- Toast notifications with custom icons

### Internationalization
- Full support for English and Norwegian languages
- Dynamic locale switching with persistent preferences
- Localized content and error messages

### Performance & Security
- Rate limiting (5 requests per 60 seconds) with Redis
- Content Security Policy (CSP) headers with nonces
- File validation (50MB limit, PDF-only)
- Graceful fallbacks for external service failures

### Developer Experience
- Feature flags for controlling UI elements
- Comprehensive test coverage
- TypeScript for type safety
- Modern motion animations
- Theme switching (light/dark mode)

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Localization

The application uses `next-intl` for internationalization. All user-facing text is stored in the `messages` directory.

- `messages/en.json`: English translations
- `messages/no.json`: Norwegian translations

When adding or updating text, be sure to update both files to maintain consistency.

## Theme Support

The application supports both light and dark themes using `next-themes`. Theme-related components and configuration can be found in `components/theme`. All motion components and UI elements are designed to work seamlessly with both themes.

## Animation System

The application uses the Motion library (successor to Framer Motion) for smooth animations:

- **Motion Components**: Pre-built animation components in `components/motion/`
- **Barrel Exports**: Consistent imports from `components/motion/index.ts`
- **Performance Optimized**: Uses proper animation properties for smooth performance
- **Theme Compatible**: All animations work with both light and dark themes

Available motion components:
- `FadeIn`, `SlideIn`, `ScaleIn` - Basic entrance animations
- `PageTransition` - Page-level transitions
- `CardMotion` - Card hover and entrance effects
- `StaggerContainer` - Staggered child animations
- `ShakeMotion` - Error feedback animations with imperative API

## Development

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

### Environment Setup
- Copy `.env.local.example` to `.env.local`
- Add required environment variables
- Feature flags require development server restart

### VS Code Integration
Use the provided VS Code task "Start Development Server" for optimal development experience.

## Deployment

The easiest way to deploy this Next.js application is to use the [Vercel Platform](https://vercel.com/new).

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📋 Portfolio Project

This is a portfolio project demonstrating modern full-stack development skills including:

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: API routes, server-side processing, file handling
- **AI Integration**: Google Gemini API integration with structured responses
- **Performance**: Rate limiting, caching, optimized animations
- **Security**: Input validation, CSP headers, secure file handling
- **Testing**: Jest, React Testing Library, comprehensive test coverage
- **Internationalization**: Multi-language support (English/Norwegian)
- **DevOps**: Feature flags, environment configuration, deployment ready

### Technical Highlights

- **AI-Powered Analysis**: Implemented two-step document classification and analysis
- **Real-time Progress**: Custom progress bar with staged animations
- **Theme System**: Complete light/dark mode with SSR-safe hydration
- **Motion Library**: Modern animations using Motion (Framer Motion successor)
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## License

This project is for portfolio and demonstration purposes. All rights reserved.

For inquiries about the code or collaboration opportunities, please contact: bolig47@gmail.com