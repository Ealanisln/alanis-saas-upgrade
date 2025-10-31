import { Metadata } from "next";
import { siteConfig, isValidLocale, type Locale } from "@/config/i18n";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

const defaultConfig = {
  siteName: siteConfig.name,
  siteUrl: siteConfig.url,
  defaultTitle: "Alanis - Web Developer",
  defaultDescription: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
  twitterHandle: "@ealanisln",
  locale: "es_ES",
};

/**
 * Generates comprehensive metadata for Next.js pages
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage = "/opengraph-image",
    canonical,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    section,
  } = config;

  const fullTitle = title.includes(defaultConfig.siteName) 
    ? title 
    : `${title} | ${defaultConfig.siteName}`;

  const canonicalUrl = canonical 
    ? `${defaultConfig.siteUrl}${canonical}`
    : undefined;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : [{ name: defaultConfig.siteName }],
    creator: defaultConfig.siteName,
    publisher: defaultConfig.siteName,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      type,
      locale: defaultConfig.locale,
      url: canonicalUrl || defaultConfig.siteUrl,
      siteName: defaultConfig.siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: defaultConfig.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  return metadata;
}

/**
 * Generates structured data for a Person (About page)
 */
export function generatePersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteConfig.author,
    "alternateName": siteConfig.name,
    "description": "Desarrollador web mexicano especializado en React, Next.js y TypeScript",
    "url": `${siteConfig.url}/about`,
    "image": `${siteConfig.url}/about/opengraph-image`,
    "sameAs": [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter
    ],
    "jobTitle": "Full-Stack Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "nationality": {
      "@type": "Country",
      "name": "Mexico"
    },
    "knowsAbout": [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Web Development",
      "Full-Stack Development"
    ]
  };
}

/**
 * Generates structured data for the main website (Home page)
 */
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Alanis Dev - Desarrollo Web",
    "description": defaultConfig.defaultDescription,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}${siteConfig.images.logo}`,
    "image": `${siteConfig.url}${siteConfig.images.ogImage}`,
    "email": siteConfig.contact.email,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MX",
      "addressLocality": "Mexico"
    },
    "founder": {
      "@type": "Person",
      "name": siteConfig.author,
      "jobTitle": "Full-Stack Developer",
      "url": `${siteConfig.url}/about`
    },
    "serviceType": "Web Development",
    "areaServed": {
      "@type": "Country",
      "name": "Mexico"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Desarrollo Web",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Desarrollo de Aplicaciones Web",
            "description": "Aplicaciones web modernas con Next.js y React"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "E-commerce",
            "description": "Tiendas en línea completas y funcionales"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Landing Pages",
            "description": "Páginas de aterrizaje optimizadas para conversión"
          }
        }
      ]
    },
    "sameAs": [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter
    ]
  };
}

/**
 * Generates structured data for blog articles
 */
export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  image?: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "datePublished": article.publishedTime,
    "dateModified": article.modifiedTime || article.publishedTime,
    "author": {
      "@type": "Person",
      "name": article.author || siteConfig.author,
      "url": `${siteConfig.url}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}${siteConfig.images.logo}`
      }
    },
    "image": article.image || `${siteConfig.url}/blog/opengraph-image`,
    "articleSection": article.section || "Web Development",
    "inLanguage": "es-ES"
  };
}

/**
 * Generates proper alternates (canonical + hreflang) for multi-language pages
 * @param locale - Current locale ('en' or 'es')
 * @param path - Path without locale prefix (e.g., '/about', '/blog/post-slug')
 * @returns Alternates object with canonical and language links
 * @throws Error if locale is invalid
 */
export function generateAlternates(locale: string, path: string) {
  // Validate locale
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Must be one of: en, es`);
  }

  const baseUrl = siteConfig.url;

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // For English (default locale), use root path. For Spanish, add /es prefix
  const localePath = locale === 'en' ? normalizedPath : `/es${normalizedPath}`;

  return {
    canonical: `${baseUrl}${localePath}`,
    languages: {
      'en': `${baseUrl}${normalizedPath}`,
      'es': `${baseUrl}/es${normalizedPath}`,
      'x-default': `${baseUrl}${normalizedPath}`, // Default to English
    }
  };
}

/**
 * Generates a localized URL with proper locale prefix
 * @param locale - Current locale ('en' or 'es')
 * @param path - Path without locale prefix (e.g., '/about', '/blog')
 * @returns Full URL with locale prefix (English at root, Spanish at /es)
 * @throws Error if locale is invalid
 * @example
 * generateLocalizedUrl('en', '/about') // Returns: 'https://alanis.dev/about'
 * generateLocalizedUrl('es', '/about') // Returns: 'https://alanis.dev/es/about'
 */
export function generateLocalizedUrl(locale: string, path: string): string {
  // Validate locale
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Must be one of: en, es`);
  }

  const baseUrl = siteConfig.url;

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // For English (default locale), use root path. For Spanish, add /es prefix
  const localePath = locale === 'en' ? normalizedPath : `/es${normalizedPath}`;

  return `${baseUrl}${localePath}`;
}

/**
 * Converts locale string to proper locale code for metadata
 * @param locale - Current locale ('en' or 'es')
 * @returns Locale code in format 'en_US' or 'es_ES'
 * @throws Error if locale is invalid
 * @example
 * getLocaleCode('en') // Returns: 'en_US'
 * getLocaleCode('es') // Returns: 'es_ES'
 */
export function getLocaleCode(locale: string): string {
  // Validate locale
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Must be one of: en, es`);
  }

  const localeMap: Record<Locale, string> = {
    'en': 'en_US',
    'es': 'es_ES',
  };

  return localeMap[locale as Locale];
}

/**
 * Generates breadcrumb items for common pages
 * @deprecated Use translation files for breadcrumb names instead
 * This function is kept for backward compatibility but should not be used for new code
 */
export function generateBreadcrumbs(path: string) {
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.url }
  ];

  const pathSegments = path.split('/').filter(Boolean);

  const pathMap: Record<string, string> = {
    'about': 'About',
    'portfolio': 'Portfolio',
    'contact': 'Contact',
    'plans': 'Plans',
    'blog': 'Blog',
    'es': 'ES' // Locale prefix
  };

  let currentPath = '';
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    const name = pathMap[segment] || segment;
    breadcrumbs.push({
      name,
      url: `${siteConfig.url}${currentPath}`
    });
  });

  return breadcrumbs;
}

const seoUtils = {
  generateMetadata,
  generatePersonStructuredData,
  generateWebsiteStructuredData,
  generateArticleStructuredData,
  generateAlternates,
  generateBreadcrumbs,
  defaultConfig,
};

export default seoUtils; 