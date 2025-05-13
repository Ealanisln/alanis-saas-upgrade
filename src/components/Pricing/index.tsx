// src/components/Pricing/index.tsx

"use client";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";

const Pricing = () => {
  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Elige el mejor plan para tus necesidades."
          paragraph="Nuestro modelo de precios de tres niveles ofrece opciones para todos, ya seas un pequeño empresario o un usuario avanzado."
          center
          width="665px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12">
          <PricingBox
            packageName="Lite"
            price={6500}
            subtitle="Para pequeñas empresas y emprendedores"
          >
            <OfferList text="1 - 5 páginas estáticas" status="active" />
            <OfferList text="Diseño responsive básico" status="active" />
            <OfferList text="Dominio y hosting por un año" status="active" />
            <OfferList text="Certificado SSL" status="active" />
            <OfferList text="Optimización SEO básica" status="active" />
            <OfferList text="Soporte por email" status="active" />
          </PricingBox>
          <PricingBox
            packageName="Basic"
            price={8500}
            subtitle="Para negocios en crecimiento"
          >
            <OfferList text="5 - 15 páginas estáticas" status="active" />
            <OfferList text="Diseño responsive profesional" status="active" />
            <OfferList text="Dominio premium y hosting" status="active" />
            <OfferList text="Blog integrado" status="active" />
            <OfferList text="SEO avanzado y Analytics" status="active" />
            <OfferList text="Soporte por email y teléfono" status="active" />
          </PricingBox>
          <PricingBox
            packageName="Plus"
            price={12500}
            subtitle="Solución completa para empresas"
          >
            <OfferList text="Hasta 25 páginas dinámicas" status="active" />
            <OfferList text="Diseño personalizado" status="active" />
            <OfferList text="CMS para gestión de contenido" status="active" />
            <OfferList text="Ecommerce básico" status="active" />
            <OfferList text="Integraciones avanzadas" status="active" />
            <OfferList text="Soporte prioritario 24/7" status="active" />
          </PricingBox>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
