import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from '@/config/i18n';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Use 'as-needed' so English pages don't have /en prefix
  // English: /, /about, /blog, /contact
  // Spanish: /es, /es/about, /es/blog, /es/contact
  localePrefix: 'as-needed',
  // Disable cookie-based locale detection to prevent redirects
  // This ensures unprefixed URLs like /about always serve English
  localeDetection: false
});
