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
      {locales.map((loc) => {
        const isActive = locale === loc;
        
        if (isActive) {
          // Render disabled button for active language
          return (
            <Button
              key={loc}
              variant="default"
              size="sm"
              disabled
              className="text-xs flex items-center gap-2 bg-accent text-accent-foreground cursor-not-allowed opacity-70"
            >
              <span 
                className={`fi ${loc === 'en' ? 'fi-gb' : 'fi-no'} w-4 h-3`}
                title={loc === 'en' ? 'English' : 'Norsk'}
              />
              {loc.toUpperCase()}
            </Button>
          );
        }
        
        // Render clickable button for inactive language
        return (
          <Link key={loc} href={pathname} locale={loc}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
            >
              <span 
                className={`fi ${loc === 'en' ? 'fi-gb' : 'fi-no'} w-4 h-3`}
                title={loc === 'en' ? 'English' : 'Norsk'}
              />
              {loc.toUpperCase()}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
