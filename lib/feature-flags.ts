export const FEATURE_FLAGS = {
  PROPERTY_SEARCH: (process.env.NEXT_PUBLIC_ENABLE_PROPERTY_SEARCH ?? 'false') === 'true',
  RECENT_ANALYSIS: (process.env.NEXT_PUBLIC_ENABLE_RECENT_ANALYSIS ?? 'false') === 'true',
  PROPERTY_LISTING: (process.env.NEXT_PUBLIC_ENABLE_PROPERTY_LISTING ?? 'false') === 'true',
  DARK_MODE_TOGGLE: (process.env.NEXT_PUBLIC_ENABLE_DARK_MODE_TOGGLE ?? 'true') === 'true',
  // Add more feature flags as needed in the future
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature is enabled.
 * The values are based on environment variables at build time.
 * To see changes from `.env.local`, you need to restart the development server.
 * @param feature - The feature flag name
 * @returns boolean indicating if the feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Get all enabled features
 * @returns Array of enabled feature names
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return (Object.keys(FEATURE_FLAGS) as FeatureFlag[]).filter(isFeatureEnabled);
}

/**
 * Get all disabled features
 * @returns Array of disabled feature names
 */
export function getDisabledFeatures(): FeatureFlag[] {
  return (Object.keys(FEATURE_FLAGS) as FeatureFlag[]).filter(feature => !isFeatureEnabled(feature));
}
