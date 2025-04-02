// src/app/portfolio/page.tsx
import SectionTitle from "@/components/Common/SectionTitle";
import { PortfolioProjects } from "@/components/Portfolio/Projects";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Mis Proyectos",
  description: "Explora mis proyectos más recientes desarrollados con las últimas tecnologías web",
};

const PortfolioPage = () => {
  return (
    <>
      <section 
        id="portfolio" 
        className="relative bg-white dark:bg-gray-900 py-16 md:py-20 lg:py-28"
      >
        
        <div className="container relative px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Mis proyectos recientes"
            paragraph="Descubre el poder de Next.js con mis últimos proyectos, donde la tecnología de vanguardia y las experiencias de usuario se fusionan a la perfección."
            center
          />
          
          <div className="mt-10 sm:mt-16">
            <PortfolioProjects />
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioPage;