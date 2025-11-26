import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request (set by middleware)
  // With localePrefix: 'as-needed', this will be 'en' for /about, 'es' for /es/about
  let locale = await requestLocale;

  // Validate that the incoming locale is valid, fallback to default
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      // Load all translation files for the locale with proper namespacing
      common: (await import(`../../messages/${locale}/common.json`)).default,
      navigation: (await import(`../../messages/${locale}/navigation.json`)).default,
      home: (await import(`../../messages/${locale}/home.json`)).default,
      about: (await import(`../../messages/${locale}/about.json`)).default,
      contact: (await import(`../../messages/${locale}/contact.json`)).default,
      portfolio: (await import(`../../messages/${locale}/portfolio.json`)).default,
      blog: (await import(`../../messages/${locale}/blog.json`)).default,
      plans: (await import(`../../messages/${locale}/plans.json`)).default,
    }
  };
}); 