"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeConfig, defaultLocale } from '@/config/i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale prefix if exists
    let newPath = pathname;
    
    // If current path has locale prefix, remove it
    if (pathname.startsWith(`/${locale}`)) {
      newPath = pathname.slice(locale.length + 1) || '/';
    }
    
    // Add new locale prefix only for non-default locale
    if (newLocale === 'es') {
      newPath = `/es${newPath === '/' ? '' : newPath}`;
    } else {
      // For English (default), use path without locale prefix
      newPath = newPath === '/' ? '/' : newPath;
    }
    
    router.push(newPath);
  };

  // Determine current locale from pathname
  const getCurrentLocale = () => {
    // Check if pathname starts with a locale prefix
    for (const loc of locales) {
      if (pathname.startsWith(`/${loc}`)) {
        return loc;
      }
    }
    
    // If no locale prefix found, it's the default locale (English)
    return defaultLocale;
  };

  const currentLocale = getCurrentLocale();

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary transition-all duration-200">
        <span className="text-base">{localeConfig[currentLocale as keyof typeof localeConfig].flag}</span>
        <span className="text-sm font-medium">{localeConfig[currentLocale as keyof typeof localeConfig].name}</span>
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
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
              currentLocale === loc ? 'text-primary font-medium bg-gray-50 dark:bg-gray-700/50' : 'text-body-color dark:text-body-color-dark'
            }`}
          >
            <span className="text-base">{localeConfig[loc].flag}</span>
            <span>{localeConfig[loc].name}</span>
            {currentLocale === loc && (
              <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 