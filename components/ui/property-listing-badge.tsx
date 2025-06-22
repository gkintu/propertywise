"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import { isFeatureEnabled } from '@/lib/feature-flags';

export function PropertyListingBadge() {
  const t = useTranslations('HomePage');

  if (!isFeatureEnabled('PROPERTY_LISTING')) {
    return null;
  }

  return (
    <Badge 
      variant="secondary" 
      className="bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-[#FBBF24] hover:bg-yellow-200 dark:hover:bg-yellow-900/30"
    >
      {t('headerBadge')}
    </Badge>
  );
}
