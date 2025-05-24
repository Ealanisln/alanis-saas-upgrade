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

// Enhanced metadata is already defined in layout.tsx, so we don't need to override it here
// The layout.tsx metadata will be used for the home page

export default async function Home() {
  // Create structured data for the home page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Alanis Dev - Desarrollo Web",
    "description": "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar con Next.js, React y TypeScript.",
    "url": "https://alanis.dev",
    "logo": "https://alanis.dev/images/logo.png",
    "image": "https://alanis.dev/opengraph-image",
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
      "url": "https://alanis.dev/about"
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
