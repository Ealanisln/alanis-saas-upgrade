"use client";

import { useTransition } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import {
  locales,
  localeConfig,
  defaultLocale,
  type Locale,
} from "@/config/i18n";
import { usePathname, useRouter } from "@/lib/navigation";

export default function FooterLanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  // Validate locale and provide fallback
  const locale =
    currentLocale && localeConfig[currentLocale as keyof typeof localeConfig]
      ? (currentLocale as Locale)
      : defaultLocale;

  const handleLocaleChange = (newLocale: string) => {
    // Don't do anything if already on the selected locale
    if (newLocale === locale) return;

    startTransition(() => {
      // Use next-intl's router to navigate with the new locale
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known locale params are used
        { pathname, params },
        { locale: newLocale },
      );
    });
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
              disabled={isPending || isActive}
              className={`text-sm transition-colors duration-150 ${
                isActive
                  ? "font-medium text-primary"
                  : "text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary"
              } ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
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
