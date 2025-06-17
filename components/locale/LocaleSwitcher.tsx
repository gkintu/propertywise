"use client";

import { useLocale } from 'next-intl';
import { usePathname } from '@/lib/navigation';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { locales } from '@/lib/navigation';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {locales.map((loc) => (
        <Link key={loc} href={pathname} locale={loc}>
          <Button
            variant={locale === loc ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            {loc === 'en' ? '🇬🇧 EN' : '🇳🇴 NO'}
          </Button>
        </Link>
      ))}
    </div>
  );
}
