"use client";

import { useLocale } from "next-intl";
import {
  locales,
  localeConfig,
  defaultLocale,
  type Locale,
} from "@/config/i18n";
import { usePathname } from "@/lib/navigation";

export default function FooterLanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();

  // Validate locale and provide fallback
  const locale =
    currentLocale && localeConfig[currentLocale as keyof typeof localeConfig]
      ? (currentLocale as Locale)
      : defaultLocale;

  const handleLocaleChange = (newLocale: string) => {
    // Don't do anything if already on the selected locale
    if (newLocale === locale) return;

    // Build the new URL with the target locale
    // For English (default), use the path without locale prefix
    // For other locales, add the locale prefix
    let newPath: string;
    if (newLocale === defaultLocale) {
      // Switch to English - remove locale prefix
      newPath = pathname;
    } else {
      // Switch to non-default locale - add locale prefix
      newPath = `/${newLocale}${pathname}`;
    }

    // Use hard navigation to ensure lang attribute updates
    window.location.assign(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      {locales.map((loc, index) => {
        const locConfig = localeConfig[loc];
        const isActive = locale === loc;

        return (
          <span key={loc} className="flex items-center">
            <button
              onClick={() => handleLocaleChange(loc)}
              disabled={isActive}
              className={`text-sm transition-colors duration-150 ${
                isActive
                  ? "font-medium text-primary"
                  : "text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary"
              }`}
              aria-label={`Switch to ${locConfig.name}`}
              aria-current={isActive ? "true" : undefined}
            >
              {locConfig.name}
            </button>
            {index < locales.length - 1 && (
              <span className="ml-2 text-body-color dark:text-body-color-dark">
                |
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
