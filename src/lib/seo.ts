import { Metadata } from "next";

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
  siteName: "Alanis Dev",
  siteUrl: "https://www.alanis.dev",
  defaultTitle: "Alanis - Web Developer",
  defaultDescription: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
  twitterHandle: "@alanisdev",
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
    "name": "Emmanuel Alanis",
    "alternateName": "Alanis Dev",
    "description": "Desarrollador web mexicano especializado en React, Next.js y TypeScript",
    "url": `${defaultConfig.siteUrl}/about`,
    "image": `${defaultConfig.siteUrl}/about/opengraph-image`,
    "sameAs": [
      "https://github.com/alanisdev",
      "https://linkedin.com/in/alanisdev",
      "https://twitter.com/alanisdev"
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
    "url": defaultConfig.siteUrl,
    "logo": `${defaultConfig.siteUrl}/images/logo.png`,
    "image": `${defaultConfig.siteUrl}/opengraph-image`,
    "telephone": "+52-XXX-XXX-XXXX", // Replace with actual phone
    "email": "contact@alanis.dev",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MX",
      "addressLocality": "Mexico"
    },
    "founder": {
      "@type": "Person",
      "name": "Emmanuel Alanis",
      "jobTitle": "Full-Stack Developer",
      "url": `${defaultConfig.siteUrl}/about`
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
      "https://github.com/alanisdev",
      "https://linkedin.com/in/alanisdev",
      "https://twitter.com/alanisdev"
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
      "name": article.author || "Emmanuel Alanis",
      "url": `${defaultConfig.siteUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": defaultConfig.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${defaultConfig.siteUrl}/images/logo.png`
      }
    },
    "image": article.image || `${defaultConfig.siteUrl}/blog/opengraph-image`,
    "articleSection": article.section || "Web Development",
    "inLanguage": "es-ES"
  };
}

/**
 * Generates breadcrumb items for common pages
 */
export function generateBreadcrumbs(path: string) {
  const breadcrumbs = [
    { name: 'Inicio', url: defaultConfig.siteUrl }
  ];

  const pathSegments = path.split('/').filter(Boolean);
  
  const pathMap: Record<string, string> = {
    'about': 'Acerca de mí',
    'portfolio': 'Portfolio',
    'contacto': 'Contacto',
    'planes': 'Planes y Precios',
    'blog': 'Blog'
  };

  let currentPath = '';
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    const name = pathMap[segment] || segment;
    breadcrumbs.push({
      name,
      url: `${defaultConfig.siteUrl}${currentPath}`
    });
  });

  return breadcrumbs;
}

export default {
  generateMetadata,
  generatePersonStructuredData,
  generateWebsiteStructuredData,
  generateArticleStructuredData,
  generateBreadcrumbs,
  defaultConfig,
}; 