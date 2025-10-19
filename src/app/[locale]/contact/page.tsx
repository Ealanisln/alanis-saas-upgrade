import Breadcrumb from "@/components/Common/Breadcrumb";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Hablemos de tu proyecto - Alanis Dev",
  description: "¿Tienes un proyecto en mente? Contáctame para una consulta gratuita. Especializado en desarrollo web con Next.js, React y TypeScript. ¡Hagamos realidad tu idea!",
  keywords: ["contacto", "consulta gratis", "desarrollo web", "proyecto web", "Next.js", "React", "freelance developer"],
  openGraph: {
    title: "Contacto | Hablemos de tu proyecto - Alanis Dev",
    description: "¿Tienes un proyecto en mente? Contáctame para una consulta gratuita. Especializado en desarrollo web con Next.js, React y TypeScript.",
    type: "website",
    images: [
      {
        url: "/contacto/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Contacto - Alanis Dev",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | Hablemos de tu proyecto - Alanis Dev",
    description: "¿Tienes un proyecto en mente? Contáctame para una consulta gratuita.",
    images: ["/contacto/opengraph-image"],
  },
  alternates: {
    canonical: "/contacto",
  }
};

const ContactPage = () => {
  // Create structured data for the Contact page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contacto - Alanis Dev",
    "description": "¿Tienes un proyecto en mente? Contáctame para una consulta gratuita. Especializado en desarrollo web con Next.js, React y TypeScript.",
    "url": "https://www.alanis.dev/contacto",
    "mainEntity": {
      "@type": "Person",
      "name": "Emmanuel Alanis",
      "jobTitle": "Full-Stack Developer",
      "email": "contact@alanis.dev",
              "url": "https://www.alanis.dev",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["Spanish", "English"]
      }
    }
  };

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Inicio', url: 'https://www.alanis.dev' },
    { name: 'Contacto', url: 'https://www.alanis.dev/contacto' }
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

      <Breadcrumb
        pageName="Contacto"
        description="¡Me encantaría saber acercad de tu proyecto!"
      />

      <Contact />
    </>
  );
};

export default ContactPage;
