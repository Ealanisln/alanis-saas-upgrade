import Blog from "@/components/Blog";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import HeroSection from "@/components/Hero/index";
import Pricing from "@/components/Pricing";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: ["desarrollo web", "programación", "javascript", "typescript", "react", "next.js", "full-stack"],
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: t('meta.title'),
      description: t('meta.description'),
      images: ["/opengraph-image"],
    },
    alternates: {
      canonical: locale === 'en' ? "/" : `/${locale}`,
    }
  };
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  // Create structured data for the home page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Alanis Dev - Desarrollo Web",
    "description": t('meta.description'),
    "url": "https://www.alanis.dev",
    "logo": "https://www.alanis.dev/images/logo.png",
    "image": "https://www.alanis.dev/opengraph-image",
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
      "url": "https://www.alanis.dev/about"
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

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ScrollUp />
      <HeroSection locale={locale} />
      <Features />
      {/* <Video /> */}
      {/* <Brands /> */}
      {/* <EcommerceSectionOne />
      <EcommerceSectionTwo /> */}
      {/* <Testimonials /> */}
      <Pricing />
      <Blog locale={locale} />
      <Contact />
    </>
  );
}
