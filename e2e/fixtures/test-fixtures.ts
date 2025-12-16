import { test as base, expect } from "@playwright/test";

type Locale = "en" | "es";

interface LocaleFixtures {
  locale: Locale;
  localePath: (path: string) => string;
}

/**
 * Custom test fixtures for locale-aware testing
 * Handles the `localePrefix: 'as-needed'` routing pattern
 * where English (default) has no prefix, Spanish uses /es
 *
 * Note: `isMobile` is a built-in Playwright fixture, no need to define it here
 */
export const test = base.extend<LocaleFixtures>({
  locale: ["en" as Locale, { option: true }],
  localePath: async ({ locale }, use) => {
    const fn = (path: string) => {
      if (locale === "en") {
        return path;
      }
      // For Spanish, prepend /es
      return `/es${path === "/" ? "" : path}`;
    };
    await use(fn);
  },
});

export { expect };
