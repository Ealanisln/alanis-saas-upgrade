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
  title: "Alanis Developer | Tu aplicación web moderna.",
  description:
    "En Alanis Web Dev, ofrecemos soluciones personalizadas de desarrollo web y software para negocios y clientes individuales. Utilizando las tecnologías más recientes, como Next JS y React, creamos sitios web modernos, funcionales y adaptados a las necesidades específicas de cada cliente. Nuestro enfoque se centra en la innovación, la calidad y la satisfacción del cliente, garantizando que cada proyecto no solo cumpla con las expectativas, sino que las supere. Ya sea que necesites un sitio web corporativo, una tienda en línea, o una aplicación web a medida, en Alanis Web Dev tenemos la experiencia y el conocimiento para llevar tu visión a la realidad.",
  // other metadata
};

export default async function Home() {
  return (
    <>
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
