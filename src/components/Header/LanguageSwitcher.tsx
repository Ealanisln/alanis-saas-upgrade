"use client";

import { useTransition } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';

import { locales, localeConfig, defaultLocale, type Locale } from '@/config/i18n';
import { usePathname, useRouter } from '@/lib/navigation';

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  // Validate locale and provide fallback
  const locale = (currentLocale && localeConfig[currentLocale as keyof typeof localeConfig])
    ? currentLocale as Locale
    : defaultLocale;

  const handleLocaleChange = (newLocale: string) => {
    // Don't do anything if already on the selected locale
    if (newLocale === locale) return;

    startTransition(() => {
      // Use next-intl's router to navigate with the new locale
      // This properly updates the locale context
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known locale params are used
        { pathname, params },
        { locale: newLocale }
      );
    });
  };

  // Get current locale config safely
  const currentLocaleConfig = localeConfig[locale];

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary transition-all duration-200"
        disabled={isPending}
      >
        <span className="text-base">{currentLocaleConfig.flag}</span>
        <span className="text-sm font-medium">{currentLocaleConfig.name}</span>
        <svg
          className="w-4 h-4 transition-transform group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {locales.map((loc) => {
          const locConfig = localeConfig[loc];
          return (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              disabled={isPending || locale === loc}
              className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                locale === loc ? 'text-primary font-medium bg-gray-50 dark:bg-gray-700/50' : 'text-body-color dark:text-body-color-dark'
              } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-base">{locConfig.flag}</span>
              <span>{locConfig.name}</span>
              {locale === loc && (
                <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
} 