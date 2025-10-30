// src/app/planes/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import Pricing from "@/components/Pricing";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import PricingFeatures from "@/components/Pricing/PricingFeatures";
import PricingHeader from "@/components/Pricing/PricingHeader";

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
    keywords: ["plans", "pricing", "web development", "quote", "Next.js", "React", "TypeScript"],
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      images: [
        {
          url: "/plans/opengraph-image",
          width: 1200,
          height: 630,
          alt: t("title"),
        }
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
    }
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tBreadcrumbs = await getTranslations({ locale, namespace: "common.breadcrumbs" });

  // Create structured data for the Pricing page with locale-specific content
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": locale === "es"
      ? "Servicios de Desarrollo Web"
      : "Web Development Services",
    "description": locale === "es"
      ? "Planes y precios para desarrollo web con Next.js, React y TypeScript"
      : "Plans and pricing for web development with Next.js, React and TypeScript",
    "url": "https://www.alanis.dev/planes",
    "provider": {
      "@type": "Person",
      "name": "Emmanuel Alanis",
      "url": "https://www.alanis.dev/about"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": locale === "es" ? "Plan Básico" : "Basic Plan",
        "description": locale === "es"
          ? "Ideal para proyectos pequeños y landing pages"
          : "Ideal for small projects and landing pages",
        "category": "Web Development"
      },
      {
        "@type": "Offer",
        "name": locale === "es" ? "Plan Profesional" : "Professional Plan",
        "description": locale === "es"
          ? "Perfecto para aplicaciones web medianas"
          : "Perfect for medium web applications",
        "category": "Web Development"
      },
      {
        "@type": "Offer",
        "name": locale === "es" ? "Plan Premium" : "Premium Plan",
        "description": locale === "es"
          ? "Para aplicaciones web complejas y e-commerce"
          : "For complex web applications and e-commerce",
        "category": "Web Development"
      },
      {
        "@type": "Offer",
        "name": locale === "es" ? "Plan Personalizado" : "Custom Plan",
        "description": locale === "es"
          ? "Soluciones a medida para proyectos únicos"
          : "Custom solutions for unique projects",
        "category": "Web Development"
      }
    ]
  };

  // Breadcrumb items for structured data with translations
  const breadcrumbItems = [
    { name: tBreadcrumbs('home'), url: 'https://www.alanis.dev' },
    { name: tBreadcrumbs('plans'), url: 'https://www.alanis.dev/planes' }
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
