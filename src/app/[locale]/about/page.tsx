import { Metadata } from "next";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Acerca de mí | Emmanuel Alanis - Desarrollador Web",
  description: "Conoce a Emmanuel Alanis, desarrollador web mexicano especializado en React, Next.js y TypeScript. Apasionado por crear aplicaciones modernas y ayudar a otros desarrolladores a crecer.",
  keywords: ["Emmanuel Alanis", "desarrollador web", "programador mexicano", "React", "Next.js", "TypeScript", "full-stack developer"],
  openGraph: {
    title: "Acerca de mí | Emmanuel Alanis - Desarrollador Web",
    description: "Conoce a Emmanuel Alanis, desarrollador web mexicano especializado en React, Next.js y TypeScript. Apasionado por crear aplicaciones modernas y ayudar a otros desarrolladores a crecer.",
    type: "profile",
    images: [
      {
        url: "/about/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Acerca de Emmanuel Alanis - Desarrollador Web",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acerca de mí | Emmanuel Alanis - Desarrollador Web",
    description: "Conoce a Emmanuel Alanis, desarrollador web mexicano especializado en React, Next.js y TypeScript.",
    images: ["/about/opengraph-image"],
  },
  alternates: {
    canonical: "/about",
  }
};

const AboutPage = () => {
  // Create structured data for the About page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Emmanuel Alanis",
    "alternateName": "Alanis Dev",
    "description": "Desarrollador web mexicano especializado en React, Next.js y TypeScript",
    "url": "https://www.alanis.dev/about",
    "image": "https://www.alanis.dev/about/opengraph-image",
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

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Inicio', url: 'https://www.alanis.dev' },
    { name: 'Acerca de mí', url: 'https://www.alanis.dev/about' }
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
        pageName="Acerca de mí"
        description="👋 ¡Hola! Soy Emmanuel, un desarrollador web 🇲🇽 mexicano. Tengo una pasión por desarrollar aplicaciones web modernas 🌎 y estoy constantemente aprendiendo algo nuevo. Además, disfruto ayudar a otros a crecer y desarrollarse junto a mí. 👨🏽‍💻"
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
