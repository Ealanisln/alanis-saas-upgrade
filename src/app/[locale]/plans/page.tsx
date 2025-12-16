// src/app/planes/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import Pricing from "@/components/Pricing";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import PricingFeatures from "@/components/Pricing/PricingFeatures";
import PricingHeader from "@/components/Pricing/PricingHeader";
import { generateLocalizedUrl, getLocaleCode } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plans.meta" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: getLocaleCode(locale),
      images: [
        {
          url: "/plans/opengraph-image",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/plans/opengraph-image"],
    },
    alternates: {
      canonical: `/${locale}/plans`,
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tBreadcrumbs = await getTranslations({
    locale,
    namespace: "common.breadcrumbs",
  });
  const tJsonLd = await getTranslations({ locale, namespace: "plans.jsonLd" });

  // Create structured data for the Pricing page with locale-specific content
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: tJsonLd("name"),
    description: tJsonLd("description"),
    url: generateLocalizedUrl(locale, "/plans"),
    provider: {
      "@type": "Person",
      name: "Emmanuel Alanis",
      url: generateLocalizedUrl(locale, "/about"),
    },
    offers: [
      {
        "@type": "Offer",
        name: tJsonLd("offers.starter.name"),
        price: "9000",
        priceCurrency: "USD",
        description: tJsonLd("offers.starter.description"),
        category: "Web Development",
      },
      {
        "@type": "Offer",
        name: tJsonLd("offers.business.name"),
        price: "15000",
        priceCurrency: "USD",
        description: tJsonLd("offers.business.description"),
        category: "Web Development",
      },
      {
        "@type": "Offer",
        name: tJsonLd("offers.professional.name"),
        price: "35000",
        priceCurrency: "USD",
        description: tJsonLd("offers.professional.description"),
        category: "Web Development",
      },
      {
        "@type": "Offer",
        name: tJsonLd("offers.enterprise.name"),
        price: "75000",
        priceCurrency: "USD",
        description: tJsonLd("offers.enterprise.description"),
        category: "Web Development",
      },
      {
        "@type": "Offer",
        name: tJsonLd("offers.custom.name"),
        description: tJsonLd("offers.custom.description"),
        category: "Web Development",
      },
    ],
  };

  // Breadcrumb items for structured data with translations
  const breadcrumbItems = [
    { name: tBreadcrumbs("home"), url: generateLocalizedUrl(locale, "/") },
    {
      name: tBreadcrumbs("plans"),
      url: generateLocalizedUrl(locale, "/plans"),
    },
  ];

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Add breadcrumb structured data */}
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <PricingHeader />
      <PricingFeatures />

      <Pricing />

      <PricingFAQ />
    </>
  );
}
