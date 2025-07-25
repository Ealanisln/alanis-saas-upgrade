# 🌐 English as Second Language (ESL) Implementation Plan
## Next.js 15 + TypeScript + PostgreSQL Project

### **Project Analysis**
Based on your codebase analysis:
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Current Language**: Spanish (ES)
- **Target**: Add English (EN) support
- **Architecture**: Full-stack with Sanity CMS integration

---

## 📋 **Phase 1: Infrastructure Setup**

### 1.1 Install Dependencies

```bash
cd /Users/ealanis/Development/current-projects/alanis-saas-upgrade

# Install next-intl for Next.js 15 App Router
pnpm add next-intl

# Optional: Install additional utilities
pnpm add --save-dev @types/node
```

### 1.2 Create i18n Configuration

**File: `src/config/i18n.ts`**
```typescript
export const defaultLocale = 'es' as const;
export const locales = ['es', 'en'] as const;

export type Locale = typeof locales[number];

export const localeConfig = {
  es: {
    name: 'Español',
    flag: '🇪🇸',
    dir: 'ltr' as const,
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr' as const,
  },
} as const;

// Navigation paths that need translation
export const navigationPaths = {
  home: { es: '/', en: '/en' },
  about: { es: '/about', en: '/en/about' },
  portfolio: { es: '/portafolio', en: '/en/portfolio' },
  blog: { es: '/blog', en: '/en/blog' },
  plans: { es: '/planes', en: '/en/plans' },
  contact: { es: '/contacto', en: '/en/contact' },
} as const;
```

### 1.3 Create Translation Directory Structure

```bash
# Create translation directories
mkdir -p messages/{es,en}

# Create translation files
touch messages/es/{common,navigation,home,about,contact,portfolio,blog,plans}.json
touch messages/en/{common,navigation,home,about,contact,portfolio,blog,plans}.json
```

---

## 📝 **Phase 2: Translation Files**

### 2.1 Spanish Translations (Current Content)

**File: `messages/es/common.json`**
```json
{
  "loading": "Cargando...",
  "error": "Error",
  "success": "Éxito",
  "submit": "Enviar",
  "cancel": "Cancelar",
  "save": "Guardar",
  "edit": "Editar",
  "delete": "Eliminar",
  "back": "Volver",
  "next": "Siguiente",
  "close": "Cerrar",
  "search": "Buscar"
}
```

**File: `messages/es/navigation.json`**
```json
{
  "home": "Inicio",
  "about": "Acerca de mí",
  "portfolio": "Portafolio",
  "blog": "Blog",
  "plans": "Planes",
  "contact": "Contacto",
  "language": "Idioma",
  "darkMode": "Modo oscuro",
  "lightMode": "Modo claro"
}
```

**File: `messages/es/home.json`**
```json
{
  "meta": {
    "title": "Alanis - Desarrollador Web",
    "description": "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar."
  },
  "hero": {
    "title": "Desarrollador Full-Stack",
    "subtitle": "Especializado en crear aplicaciones web modernas",
    "description": "Construyo aplicaciones web robustas, escalables y fáciles de usar con las mejores tecnologías.",
    "cta": "Ver mi trabajo",
    "contact": "Contactar"
  }
}
```

### 2.2 English Translations

**File: `messages/en/common.json`**
```json
{
  "loading": "Loading...",
  "error": "Error",
  "success": "Success",
  "submit": "Submit",
  "cancel": "Cancel",
  "save": "Save",
  "edit": "Edit",
  "delete": "Delete",
  "back": "Back",
  "next": "Next",
  "close": "Close",
  "search": "Search"
}
```

**File: `messages/en/navigation.json`**
```json
{
  "home": "Home",
  "about": "About me",
  "portfolio": "Portfolio",
  "blog": "Blog",
  "plans": "Plans",
  "contact": "Contact",
  "language": "Language",
  "darkMode": "Dark mode",
  "lightMode": "Light mode"
}
```

**File: `messages/en/home.json`**
```json
{
  "meta": {
    "title": "Alanis - Web Developer",
    "description": "Full-stack developer specialized in creating robust, scalable and user-friendly web applications."
  },
  "hero": {
    "title": "Full-Stack Developer",
    "subtitle": "Specialized in creating modern web applications",
    "description": "I build robust, scalable and user-friendly web applications with the best technologies.",
    "cta": "View my work",
    "contact": "Contact"
  }
}
```

---

## 🔧 **Phase 3: Next.js Configuration**

### 3.1 Update Next.js Config

**File: `next.config.js`**
```javascript
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
```

### 3.2 Create i18n Request Configuration

**File: `src/i18n/request.ts`**
```typescript
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from '@/config/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    return {
      locale: defaultLocale,
      messages: (await import(`../../messages/${defaultLocale}/common.json`)).default
    };
  }

  return {
    messages: {
      // Load all translation files for the locale
      ...(await import(`../../messages/${locale}/common.json`)).default,
      ...(await import(`../../messages/${locale}/navigation.json`)).default,
      ...(await import(`../../messages/${locale}/home.json`)).default,
      ...(await import(`../../messages/${locale}/about.json`)).default,
      ...(await import(`../../messages/${locale}/contact.json`)).default,
      ...(await import(`../../messages/${locale}/portfolio.json`)).default,
      ...(await import(`../../messages/${locale}/blog.json`)).default,
      ...(await import(`../../messages/${locale}/plans.json`)).default,
    }
  };
});
```

---

## 🏗️ **Phase 4: App Router Structure Refactoring**

### 4.1 Create Locale-based Routing

```bash
# Create new app structure with locale support
mkdir -p src/app/\[locale\]

# Move existing pages to locale structure
mv src/app/about src/app/\[locale\]/
mv src/app/blog src/app/\[locale\]/
mv src/app/contacto src/app/\[locale\]/contact
mv src/app/portafolio src/app/\[locale\]/portfolio
mv src/app/planes src/app/\[locale\]/plans
```

### 4.2 Create Root Layout with Locale Support

**File: `src/app/layout.tsx`**
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales } from '@/config/i18n';
import { notFound } from 'next/navigation';

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth">
      <body className={`bg-[#FCFCFC] dark:bg-black antialiased text-body-color overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 4.3 Create Locale-specific Page Layout

**File: `src/app/[locale]/layout.tsx`**
```typescript
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../../styles/index.css";
import { Providers } from "../providers";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { getTranslations } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  
  return {
    metadataBase: new URL('https://alanis.dev'),
    title: {
      default: t('title'),
      template: `%s | ${t('siteName')}`
    },
    description: t('description'),
    // ... rest of metadata
  };
}

export default function LocaleLayout({
  children,
  params: { locale }
}: LocaleLayoutProps) {
  return (
    <Providers>
      <div className="flex min-h-[100dvh] flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Analytics />
        <Footer />
        <ScrollToTop />
      </div>
    </Providers>
  );
}
```

---

## 🔄 **Phase 5: Component Updates**

### 5.1 Update Header Component with i18n

**File: `src/components/Header/index.tsx`**
```typescript
"use client";

import { useTranslations, useLocale } from 'next-intl';
import { localeConfig } from '@/config/i18n';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const t = useTranslations('navigation');
  const locale = useLocale();

  // Updated menu data with translations
  const menuData = [
    { id: 1, title: t('home'), path: '/', newTab: false },
    { id: 2, title: t('about'), path: '/about', newTab: false },
    { id: 3, title: t('portfolio'), path: '/portfolio', newTab: false },
    { id: 4, title: t('blog'), path: '/blog', newTab: false },
    { id: 5, title: t('plans'), path: '/plans', newTab: false },
    { id: 6, title: t('contact'), path: '/contact', newTab: false },
  ];

  return (
    <header className={/* existing classes */}>
      {/* existing header content */}
      <nav>
        <ul className="block lg:flex lg:space-x-12">
          {menuData.map((menuItem, index) => (
            <li key={index} className="group relative">
              <Link
                href={`/${locale}${menuItem.path}`}
                className={/* existing classes */}
              >
                {menuItem.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <LanguageSwitcher />
      {/* rest of header */}
    </header>
  );
};

export default Header;
```

### 5.2 Create Language Switcher Component

**File: `src/components/Header/LanguageSwitcher.tsx`**
```typescript
"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeConfig } from '@/config/i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to new locale
    const newPath = newLocale === 'es' 
      ? pathWithoutLocale 
      : `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <span>{localeConfig[locale].flag}</span>
        <span>{localeConfig[locale].name}</span>
      </button>
      
      <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
              locale === loc ? 'text-primary font-medium' : ''
            }`}
          >
            <span>{localeConfig[loc].flag}</span>
            <span>{localeConfig[loc].name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 📄 **Phase 6: Page Updates**

### 6.1 Update Home Page

**File: `src/app/[locale]/page.tsx`**
```typescript
import { getTranslations } from 'next-intl/server';
import { Metadata } from "next";
// ... other imports

interface HomePageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: HomePageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home.meta' });
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
      images: ["/opengraph-image"],
    },
  };
}

export default async function Home({ params: { locale } }: HomePageProps) {
  const t = await getTranslations({ locale });

  // JSON-LD with translated content
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": t('home.meta.title'),
    "description": t('home.meta.description'),
    // ... rest of structured data
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ScrollUp />
      <HeroSection />
      <Features />
      <Pricing />
      <Blog />
      <Contact />
    </>
  );
}
```

---

## 🛣️ **Phase 7: Routing & Middleware**

### 7.1 Create Middleware for Locale Detection

**File: `middleware.ts`**
```typescript
import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './src/config/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Don't add locale prefix for default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
```

### 7.2 Create Navigation Utilities

**File: `src/lib/navigation.ts`**
```typescript
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from '@/config/i18n';

export const { Link, redirect, usePathname, useRouter } = 
  createSharedPathnamesNavigation({ locales, localePrefix: 'as-needed' });
```

---

## 🎨 **Phase 8: Content Management Integration**

### 8.1 Update Sanity Schema for Multilingual Content

**File: `src/sanity/schema/types/localizedString.ts`**
```typescript
export const localizedString = {
  name: 'localizedString',
  type: 'object',
  title: 'Localized String',
  fields: [
    {
      name: 'es',
      type: 'string',
      title: 'Spanish',
    },
    {
      name: 'en',
      type: 'string',
      title: 'English',
    },
  ],
};
```

### 8.2 Update Blog Schema Example

**File: `src/sanity/schema/blog.ts`**
```typescript
export const blog = {
  name: 'blog',
  type: 'document',
  title: 'Blog',
  fields: [
    {
      name: 'title',
      type: 'localizedString',
      title: 'Title',
    },
    {
      name: 'description',
      type: 'localizedString',
      title: 'Description',
    },
    // ... other fields
  ],
};
```

---

## 🚀 **Phase 9: Deployment & SEO**

### 9.1 Update Sitemap Generation

**File: `src/app/sitemap.ts`**
```typescript
import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/config/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alanis.dev'
  
  const routes = ['', '/about', '/portfolio', '/blog', '/plans', '/contact']
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  routes.forEach(route => {
    locales.forEach(locale => {
      const url = locale === defaultLocale 
        ? `${baseUrl}${route}`
        : `${baseUrl}/${locale}${route}`
        
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [
              loc,
              loc === defaultLocale 
                ? `${baseUrl}${route}`
                : `${baseUrl}/${loc}${route}`
            ])
          )
        }
      })
    })
  })
  
  return sitemapEntries
}
```

---

## 📋 **Implementation Checklist**

### **Phase 1: Setup** ✅
- [ ] Install next-intl
- [ ] Create i18n configuration
- [ ] Set up translation directory structure
- [ ] Create translation files (ES/EN)

### **Phase 2: Configuration** ✅
- [ ] Update next.config.js
- [ ] Create i18n request configuration
- [ ] Set up middleware for locale detection

### **Phase 3: App Structure** ✅
- [ ] Refactor to [locale] routing
- [ ] Update root layout
- [ ] Create locale-specific layout
- [ ] Update page components

### **Phase 4: Components** ✅
- [ ] Update Header with translations
- [ ] Create Language Switcher
- [ ] Update navigation utilities
- [ ] Update all UI components

### **Phase 5: Content** ✅
- [ ] Update Sanity schemas for multilingual
- [ ] Migrate existing content
- [ ] Create English translations
- [ ] Test content management

### **Phase 6: SEO & Performance** ✅
- [ ] Update sitemap generation
- [ ] Configure hreflang tags
- [ ] Test metadata translations
- [ ] Optimize bundle size

---

## 🔄 **Migration Strategy**

### **Gradual Implementation**
1. **Week 1**: Setup infrastructure (Phase 1-2)
2. **Week 2**: Implement routing and layout (Phase 3)
3. **Week 3**: Update components and navigation (Phase 4)
4. **Week 4**: Content translation and CMS integration (Phase 5)
5. **Week 5**: SEO optimization and testing (Phase 6)

### **Testing Strategy**
- Test locale switching functionality
- Verify SEO metadata in both languages
- Check mobile responsiveness
- Validate accessibility compliance
- Performance testing with both locales

---

## 🎯 **Key Benefits**

- **SEO Friendly**: Proper hreflang and locale-specific URLs
- **Type Safe**: Full TypeScript support with next-intl
- **Performance**: Optimized bundle splitting per locale
- **Maintainable**: Centralized translation management
- **Scalable**: Easy to add more languages in the future
- **User Experience**: Seamless language switching

---

## 🛠️ **Development Commands**

```bash
# Development with specific locale
pnpm dev -- --locale es
pnpm dev -- --locale en

# Build with all locales
pnpm build

# Translation validation
pnpm check-translations

# Type checking
pnpm type-check
```

This plan provides a comprehensive approach to implementing ESL while maintaining your current Spanish content and adding robust English support with proper TypeScript integration and Next.js 15 best practices.