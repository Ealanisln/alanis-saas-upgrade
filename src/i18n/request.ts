import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from '@/config/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validatedLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: validatedLocale,
    messages: {
      // Load all translation files for the locale with proper namespacing
      common: (await import(`../../messages/${validatedLocale}/common.json`)).default,
      navigation: (await import(`../../messages/${validatedLocale}/navigation.json`)).default,
      home: (await import(`../../messages/${validatedLocale}/home.json`)).default,
      about: (await import(`../../messages/${validatedLocale}/about.json`)).default,
      contact: (await import(`../../messages/${validatedLocale}/contact.json`)).default,
      portfolio: (await import(`../../messages/${validatedLocale}/portfolio.json`)).default,
      blog: (await import(`../../messages/${validatedLocale}/blog.json`)).default,
      plans: (await import(`../../messages/${validatedLocale}/plans.json`)).default,
    }
  };
}); 