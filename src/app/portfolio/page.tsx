// src/app/portfolio/page.tsx
import SectionTitle from "@/components/Common/SectionTitle";
import { PortfolioProjects } from "@/components/Portfolio/Projects";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Proyectos de Desarrollo Web - Alanis Dev",
  description: "Explora mis proyectos más recientes: aplicaciones web modernas, e-commerce, SaaS y APIs desarrollados con Next.js, React, TypeScript y las últimas tecnologías web.",
  keywords: ["portfolio", "proyectos web", "desarrollo web", "Next.js", "React", "TypeScript", "aplicaciones web", "e-commerce", "SaaS"],
  openGraph: {
    title: "Portfolio | Proyectos de Desarrollo Web - Alanis Dev",
    description: "Explora mis proyectos más recientes: aplicaciones web modernas, e-commerce, SaaS y APIs desarrollados con Next.js, React, TypeScript y las últimas tecnologías web.",
    type: "website",
    images: [
      {
        url: "/portfolio/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Portfolio - Proyectos de Alanis Dev",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Proyectos de Desarrollo Web - Alanis Dev",
    description: "Explora mis proyectos más recientes desarrollados con las últimas tecnologías web.",
    images: ["/portfolio/opengraph-image"],
  },
  alternates: {
    canonical: "/portfolio",
  }
};

const PortfolioPage = () => {
  // Create structured data for the Portfolio page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Portfolio - Proyectos de Desarrollo Web",
    "description": "Explora mis proyectos más recientes: aplicaciones web modernas, e-commerce, SaaS y APIs desarrollados con Next.js, React, TypeScript y las últimas tecnologías web.",
    "url": "https://alanis.dev/portfolio",
    "author": {
      "@type": "Person",
      "name": "Emmanuel Alanis",
      "url": "https://alanis.dev/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Alanis Dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alanis.dev/images/logo.png"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Proyectos de Desarrollo Web",
      "description": "Colección de proyectos web desarrollados con tecnologías modernas"
    }
  };

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Inicio', url: 'https://alanis.dev' },
    { name: 'Portfolio', url: 'https://alanis.dev/portfolio' }
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

      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 py-20 md:py-28 lg:py-32">
        {/* Animated Particles/Shapes Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute -bottom-40 left-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl"></div>
          
          {/* Code-like decorative elements */}
          <div className="absolute top-20 left-10 h-20 w-20 rotate-12 rounded-md border border-blue-400/20 opacity-20"></div>
          <div className="absolute bottom-20 right-10 h-32 w-32 -rotate-12 rounded-md border border-indigo-400/20 opacity-20"></div>
          <div className="absolute top-1/3 right-1/3 h-16 w-16 rounded-md border border-blue-300/20 opacity-20"></div>
        </div>
        
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block rounded-full bg-blue-500/20 px-4 py-1.5 text-sm font-semibold tracking-wide text-blue-200 mb-6">
              Portafolio
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
              Mis Proyectos <span className="text-blue-300">Destacados</span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100/90 max-w-3xl mx-auto mb-10">
              Descubre el poder de Next.js con mis últimos proyectos, donde la tecnología de vanguardia 
              y las experiencias de usuario se fusionan a la perfección.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#portfolio-grid" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-blue-600/20 hover:-translate-y-1"
              >
                Ver Proyectos
              </a>
              <a 
                href="mailto:contact@example.com" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-transparent hover:bg-white/10 text-white border border-blue-400/30 font-medium transition-all duration-300"
              >
                Contactar
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Portfolio Section */}
      <section 
        id="portfolio-grid" 
        className="relative bg-white dark:bg-gray-900 py-20 md:py-24 lg:py-28"
      >
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full opacity-70"></div>
        <div className="absolute left-0 bottom-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-tr-full opacity-70"></div>
        
        <div className="container relative px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Proyectos Recientes"
            subtitle="Portafolio"
            paragraph="Descubre cómo puedo ayudarte a crear experiencias digitales de alto impacto con las tecnologías más modernas del mercado."
            center
            highlight="Recientes"
          />
          
          <div className="mt-12 sm:mt-16">
            <PortfolioProjects />
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioPage;