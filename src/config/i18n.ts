export const defaultLocale = 'en' as const;
export const locales = ['en', 'es'] as const;

export type Locale = typeof locales[number];

/**
 * Validates if a given locale string is a valid locale
 * @param locale - The locale string to validate
 * @returns True if locale is valid, false otherwise
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

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

// Site configuration pulled from environment variables
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://alanis.dev',
  name: 'Alanis Dev',
  author: 'Emmanuel Alanis',
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@alanis.dev',
  },
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/Ealanisln',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/emmanuel-alanis/',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/ealanisln',
  },
  images: {
    logo: '/images/logo.png',
    ogImage: '/opengraph-image',
  },
} as const;

// Navigation paths that need translation
export const navigationPaths = {
  home: { en: '/', es: '/es' },
  about: { en: '/about', es: '/es/about' },
  portfolio: { en: '/portfolio', es: '/es/portfolio' },
  blog: { en: '/blog', es: '/es/blog' },
  plans: { en: '/plans', es: '/es/plans' },
  contact: { en: '/contact', es: '/es/contact' },
} as const; 