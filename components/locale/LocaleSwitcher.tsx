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
            className={`text-xs flex items-center gap-2 ${
              locale === loc 
                ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                : ""
            }`}
          >
            <span 
              className={`fi ${loc === 'en' ? 'fi-gb' : 'fi-no'} w-4 h-3`}
              title={loc === 'en' ? 'English' : 'Norsk'}
            />
            {loc.toUpperCase()}
          </Button>
        </Link>
      ))}
    </div>
  );
}
