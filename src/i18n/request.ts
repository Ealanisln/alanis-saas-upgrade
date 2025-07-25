import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from '@/config/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
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