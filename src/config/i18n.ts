export const defaultLocale = 'en' as const;
export const locales = ['en', 'es'] as const;

export type Locale = typeof locales[number];

export const localeConfig = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr' as const,
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    dir: 'ltr' as const,
  },
} as const;

// Navigation paths that need translation
export const navigationPaths = {
  home: { en: '/en', es: '/es' },
  about: { en: '/en/about', es: '/es/about' },
  portfolio: { en: '/en/portfolio', es: '/es/portfolio' },
  blog: { en: '/en/blog', es: '/es/blog' },
  plans: { en: '/en/plans', es: '/es/plans' },
  contact: { en: '/en/contact', es: '/es/contact' },
} as const; 