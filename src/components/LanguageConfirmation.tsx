"use client";

import {
  useCallback,
  useRef,
  useSyncExternalStore,
  useTransition,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  locales,
  localeConfig,
  defaultLocale,
  type Locale,
} from "@/config/i18n";
import { usePathname, useRouter } from "@/lib/navigation";

const STORAGE_KEY = "language-preference-dismissed";

/**
 * Maps browser language codes to supported locales
 * Handles both full codes (e.g., 'en-US') and short codes (e.g., 'en')
 */
function getBrowserLocale(): Locale | null {
  if (typeof window === "undefined") return null;

  const browserLanguages = navigator.languages || [navigator.language];

  for (const lang of browserLanguages) {
    // Normalize the language code (e.g., 'en-US' -> 'en', 'es-MX' -> 'es')
    const shortCode = lang.split("-")[0].toLowerCase();

    if (locales.includes(shortCode as Locale)) {
      return shortCode as Locale;
    }
  }

  return null;
}

/**
 * Checks if the user has previously dismissed or made a choice
 */
function hasUserMadeChoice(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    return dismissed === "true";
  } catch {
    return false;
  }
}

/**
 * Saves the user's preference to localStorage
 */
function saveUserChoice(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Custom hook to detect browser locale with SSR support
 */
function useBrowserLocale(): Locale | null {
  const getSnapshot = useCallback(() => getBrowserLocale(), []);
  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(
    // subscribe - no-op since browser language doesn't change
    () => () => {},
    getSnapshot,
    getServerSnapshot,
  );
}

/**
 * Custom hook to check if user has made a choice (with SSR support)
 */
function useHasUserMadeChoice(): boolean {
  const subscribeRef = useRef<(() => void) | null>(null);

  const subscribe = useCallback((callback: () => void) => {
    // Listen for storage changes in case preference is updated in another tab
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        callback();
      }
    };
    window.addEventListener("storage", handler);
    subscribeRef.current = () => window.removeEventListener("storage", handler);
    return subscribeRef.current;
  }, []);

  const getSnapshot = useCallback(() => hasUserMadeChoice(), []);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function LanguageConfirmation() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [isDismissed, setIsDismissed] = useState(false);

  const browserLocale = useBrowserLocale();
  const hasChosenPreviously = useHasUserMadeChoice();

  // Validate current locale
  const locale =
    currentLocale && localeConfig[currentLocale as keyof typeof localeConfig]
      ? (currentLocale as Locale)
      : defaultLocale;

  // Determine if banner should be visible
  const shouldShow =
    browserLocale !== null &&
    browserLocale !== locale &&
    !hasChosenPreviously &&
    !isDismissed;

  const handleSwitch = useCallback(() => {
    if (!browserLocale) return;

    saveUserChoice();
    setIsDismissed(true);

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known locale params are used
        { pathname, params },
        { locale: browserLocale },
      );
    });
  }, [browserLocale, pathname, params, router]);

  const handleDismiss = useCallback(() => {
    saveUserChoice();
    setIsDismissed(true);
  }, []);

  // Don't render if not visible or no browser locale detected
  if (!shouldShow || !browserLocale) return null;

  const browserLocaleConfig = localeConfig[browserLocale];

  return (
    <div
      role="banner"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[9999] animate-slide-down"
    >
      <div className="bg-gradient-to-r from-primary to-primary/90 px-4 py-3 text-white shadow-lg">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              {browserLocaleConfig.flag}
            </span>
            <p className="text-base font-medium">
              {t("languageConfirmation.message", {
                language: browserLocaleConfig.name,
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSwitch}
              disabled={isPending}
              className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-gray-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t("languageConfirmation.switchLabel", {
                language: browserLocaleConfig.name,
              })}
            >
              {isPending ? t("loading") : t("languageConfirmation.switch")}
            </button>
            <button
              onClick={handleDismiss}
              disabled={isPending}
              className="rounded-md border-2 border-white/50 bg-transparent px-5 py-2 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t("languageConfirmation.dismissLabel")}
            >
              {t("languageConfirmation.dismiss")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
