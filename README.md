# PropertyWise - AI-Powered Property Document Analysis

PropertyWise is a modern, AI-driven web application designed to streamline the analysis of property documents. By leveraging the power of Google's Gemini AI, users can upload PDF property reports and receive instant, insightful analysis. The application is built with Next.js 15 and supports both English and Norwegian languages, ensuring a seamless experience for a diverse user base.

## Key Features

- **AI-Powered PDF Analysis:** Upload property documents in PDF format and receive a comprehensive analysis powered by the Google Gemini AI model.
- **Internationalization (i18n):** Full support for English and Norwegian locales, allowing users to switch languages effortlessly.
- **Light & Dark Mode:** A beautifully designed interface with complete support for both light and dark themes.
- **Responsive Design:** A fully responsive layout that works on all devices, from desktops to mobile phones.
- **Modern Tech Stack:** Built with the latest technologies, including Next.js 15, React, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js (v20.x or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/propertywise.git
    cd propertywise
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the necessary environment variables. You can use `.env.local.example` as a template.

    ```bash
    cp .env.local.example .env.local
    ```

    You will need to add your Google Gemini API key to the `.env.local` file.

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

## Project Structure

The project follows a standard Next.js App Router structure:

```
/
├── app/                  # Main application code
│   ├── [locale]/         # Internationalized routes
│   └── api/              # API routes
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── i18n/                 # i18n configuration
├── lib/                  # Utility functions and types
├── messages/             # Translation files (en.json, no.json)
└── public/               # Static assets
```

## Localization

The application uses `next-intl` for internationalization. All user-facing text is stored in the `messages` directory.

- `messages/en.json`: English translations
- `messages/no.json`: Norwegian translations

When adding or updating text, be sure to update both files to maintain consistency.

## Theme Support

The application supports both light and dark themes using `next-themes`. Theme-related components and configuration can be found in `components/theme`.

## Deployment

The easiest way to deploy this Next.js application is to use the [Vercel Platform](https://vercel.com/new).

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).