import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Blog from "@/components/Blog";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import HeroSection from "@/components/Hero/index";
import Pricing from "@/components/Pricing";
import { siteConfig } from "@/config/i18n";
import {
  generateLocalizedUrl,
  getLocaleCode,
  generateAlternates,
} from "@/lib/seo";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t.raw("meta.keywords"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
      siteName: "Alanis Dev",
      locale: getLocaleCode(locale),
      images: [
        {
          url: "/og-alanis-web-dev.jpg",
          width: 1200,
          height: 630,
          alt: t("meta.title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.description"),
      images: ["/og-alanis-web-dev.jpg"],
    },
    alternates: generateAlternates(locale, "/"),
  };
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tJsonLd = await getTranslations({ locale, namespace: "home.jsonLd" });

  // Create structured data for the home page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: tJsonLd("name"),
    description: t("meta.description"),
    url: generateLocalizedUrl(locale, "/"),
    logo: `${siteConfig.url}${siteConfig.images.logo}`,
    image: `${siteConfig.url}${siteConfig.images.ogImage}`,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "MX",
      addressLocality: "Mexico",
    },
    founder: {
      "@type": "Person",
      name: siteConfig.author,
      jobTitle: tJsonLd("jobTitle"),
      url: generateLocalizedUrl(locale, "/about"),
    },
    serviceType: tJsonLd("serviceType"),
    areaServed: {
      "@type": "Country",
      name: "Mexico",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: tJsonLd("offerCatalog.name"),
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: tJsonLd("offerCatalog.services.0.name"),
            description: tJsonLd("offerCatalog.services.0.description"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: tJsonLd("offerCatalog.services.1.name"),
            description: tJsonLd("offerCatalog.services.1.description"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: tJsonLd("offerCatalog.services.2.name"),
            description: tJsonLd("offerCatalog.services.2.description"),
          },
        },
      ],
    },
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
    ],
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
