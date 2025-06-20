import React from 'react';

/**
 * Type definitions for internationalization (i18n) functionality
 */

/**
 * Standard translation function type used throughout the application
 */
export type TranslationFunction = (
  key: string, 
  params?: Record<string, string | number>
) => string;

/**
 * Translation function with rich formatting support
 */
export type RichTranslationFunction = (
  key: string,
  params?: Record<string, string | number | React.ReactNode>
) => string | React.ReactNode;

/**
 * Locale type for supported languages
 */
export type Locale = 'en' | 'no';

/**
 * Translation namespace type for better type safety
 */
export type TranslationNamespace = 'common' | 'analysis' | 'pdf' | 'errors';
