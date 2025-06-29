# Repository Custom Instructions for GitHub Copilot

## Project Overview
This is a Next.js 15 property analysis application that uses Google Gemini AI to analyze PDF property documents. The app supports English and Norwegian locales with internationalization (i18n) using next-intl.


## Extras
- Never run npm run build automatically without confirming with me first.
- start all your answers with 🤖 emoji

## Development Guidelines

### Internationalization (i18n)
- When making changes that affect user-facing text, always update both Norwegian (`messages/no.json`) and English (`messages/en.json`) language files
- Ensure consistency across both locales for any new features, components, or content
- Test functionality in both language contexts

### Theme Support
- When creating new components or adding visual elements, implement styling for both light and dark themes
- Use CSS variables and theme-aware classes to ensure proper contrast and visibility in both modes
- Test all visual changes in both light and dark theme modes

### Yellow Button Styling
- Every time you create a button that is yellow, use the following className for proper light/dark mode and hover support:
  
  `className="bg-yellow-500 hover:bg-[#FACC15] dark:hover:bg-[#f6c40c] text-white dark:text-[#111827] px-8"`

- This ensures consistent yellow button appearance across themes and states.

- Never expose secret keys or sensitive information in the codebase, especially in public repositories.
- never make changes to .env files without confirming with me first.