// src/app/planes/page.tsx
import Pricing from "@/components/Pricing";
import PricingHeader from "@/components/Pricing/PricingHeader";
import PricingFeatures from "@/components/Pricing/PricingFeatures";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planes y Precios | Desarrollo Web - Alanis Dev",
  description: "Descubre los mejores planes para tu proyecto web: Básico, Profesional, Premium y Personalizado. Soluciones diseñadas para satisfacer todas tus necesidades de desarrollo con Next.js, React y TypeScript.",
  keywords: ["planes", "precios", "desarrollo web", "cotización", "Next.js", "React", "TypeScript", "web development pricing"],
  openGraph: {
    title: "Planes y Precios | Desarrollo Web - Alanis Dev",
    description: "Descubre los mejores planes para tu proyecto web: Básico, Profesional, Premium y Personalizado. Soluciones diseñadas para satisfacer todas tus necesidades de desarrollo.",
    type: "website",
    images: [
      {
        url: "/planes/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Planes y Precios - Alanis Dev",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planes y Precios | Desarrollo Web - Alanis Dev",
    description: "Descubre los mejores planes para tu proyecto web diseñados para satisfacer todas tus necesidades de desarrollo.",
    images: ["/planes/opengraph-image"],
  },
  alternates: {
    canonical: "/planes",
  }
};

export default function PricingPage() {
  // Create structured data for the Pricing page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Servicios de Desarrollo Web",
    "description": "Planes y precios para desarrollo web con Next.js, React y TypeScript",
    "url": "https://alanis.dev/planes",
    "provider": {
      "@type": "Person",
      "name": "Emmanuel Alanis",
      "url": "https://alanis.dev/about"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Plan Básico",
        "description": "Ideal para proyectos pequeños y landing pages",
        "category": "Web Development"
      },
      {
        "@type": "Offer",
        "name": "Plan Profesional",
        "description": "Perfecto para aplicaciones web medianas",
        "category": "Web Development"
      },
      {
        "@type": "Offer",
        "name": "Plan Premium",
        "description": "Para aplicaciones web complejas y e-commerce",
        "category": "Web Development"
      },
      {
        "@type": "Offer",
        "name": "Plan Personalizado",
        "description": "Soluciones a medida para proyectos únicos",
        "category": "Web Development"
      }
    ]
  };

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Inicio', url: 'https://alanis.dev' },
    { name: 'Planes y Precios', url: 'https://alanis.dev/planes' }
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
