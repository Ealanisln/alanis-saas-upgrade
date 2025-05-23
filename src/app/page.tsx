import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import { EcommerceSectionOne, EcommerceSectionTwo } from "@/components/Ecommerce";
import Features from "@/components/Features";
import HeroSection from "@/components/Hero/index";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
// import Video from "@/components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alanis - Web Developer",
  description: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
  keywords: ["desarrollo web", "programación", "javascript", "typescript", "react", "next.js", "full-stack"],
  openGraph: {
    title: "Alanis - Web Developer",
    description: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alanis - Web Developer",
    description: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  }
};

export default async function Home() {
  // Create structured data for the home page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Alanis Dev - Desarrollo Web",
    "description": "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar con Next.js, React y TypeScript.",
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
      <HeroSection />
      <Features />
      {/* <Video /> */}
      {/* <Brands /> */}
      {/* <EcommerceSectionOne />
      <EcommerceSectionTwo /> */}
      {/* <Testimonials /> */}
      <Pricing />
      <Blog />
      <Contact />
    </>
  );
}
