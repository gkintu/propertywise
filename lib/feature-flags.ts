export const FEATURE_FLAGS = {
  PROPERTY_SEARCH: false,
  RECENT_ANALYSIS: false,
  PROPERTY_LISTING: false, // 🏡 List your property? Get instant valuation
  // Add more feature flags as needed in the future
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature is enabled
 * @param feature - The feature flag name
 * @returns boolean indicating if the feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  // Check environment variables first (for override capability)
  const envKey = `NEXT_PUBLIC_ENABLE_${feature}`;
  const envValue = process.env[envKey];
  
  if (envValue !== undefined) {
    return envValue === 'true';
  }
  
  // Fall back to default configuration
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
