import {createNavigation} from 'next-intl/navigation';
import {routing} from '@/i18n/routing';

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

// Export locales for use in components
export const locales = routing.locales;
