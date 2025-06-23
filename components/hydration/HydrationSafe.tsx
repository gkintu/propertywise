"use client";

import { useState, useEffect, ReactNode } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * Hydration-safe wrapper that prevents SSR/Client mismatches
 * Shows fallback on server and during hydration, then shows children
 */
export function HydrationSafe({ children, fallback = null, className }: HydrationSafeProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  return <div className={className}>{children}</div>;
}

/**
 * Hook to check if component has mounted (hydration-safe)
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
