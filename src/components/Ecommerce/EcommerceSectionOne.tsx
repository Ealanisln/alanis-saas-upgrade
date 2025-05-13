"use client";

import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

interface ListProps {
  text: string;
}

const EcommerceSectionOne = () => {
  const List = ({ text }: ListProps) => (
    <p className="mb-5 flex items-center text-lg font-medium text-body-color">
      <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  return (
    <section id="ecommerce" className="pb-16 pt-16 md:pt-20 lg:pt-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-body-color/[.15] pb-12 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 pb-12 lg:w-1/2 lg:pb-0">
              <SectionTitle
                title="Soluciones de E-commerce de última generación"
                paragraph="Transforma tu negocio con nuestra plataforma de comercio electrónico diseñada para maximizar ventas y mejorar la experiencia del cliente. Ofrecemos soluciones completas que se adaptan a las necesidades específicas de tu empresa."
                mb="44px"
              />

              <div
                className="wow fadeInUp mb-12 max-w-[570px] lg:mb-0"
                data-wow-delay=".15s"
              >
                <div className="mx-[-12px] flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="Carrito de compras optimizado" />
                    <List text="Gestión de inventario en tiempo real" />
                    <List text="Pasarelas de pago seguras" />
                  </div>

                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="Diseño responsivo para móviles" />
                    <List text="Panel de administración intuitivo" />
                    <List text="Análisis avanzados de ventas" />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div
                  className="wow fadeInUp relative mx-auto aspect-[4/3] max-w-[320px]"
                  data-wow-delay=".2s"
                >
                  <Image
                    src="/images/ecommerce/ecommerce-screenshot-1.jpg"
                    alt="Tienda online"
                    fill
                    priority
                    className="rounded-lg shadow-xl drop-shadow-three mx-auto max-w-full dark:hidden"
                    style={{objectFit: "cover"}}
                  />
                  <Image
                    src="/images/ecommerce/ecommerce-screenshot-1-dark.jpg"
                    alt="Tienda online"
                    fill
                    priority
                    className="rounded-lg shadow-xl drop-shadow-three mx-auto hidden max-w-full dark:block"
                    style={{objectFit: "cover"}}
                  />
                </div>
                <div
                  className="wow fadeInUp relative mx-auto aspect-[4/3] max-w-[320px]"
                  data-wow-delay=".3s"
                >
                  <Image
                    src="/images/ecommerce/ecommerce-screenshot-2.jpg"
                    alt="Panel de administración"
                    fill
                    priority
                    className="rounded-lg shadow-xl drop-shadow-three mx-auto max-w-full dark:hidden"
                    style={{objectFit: "cover"}}
                  />
                  <Image
                    src="/images/ecommerce/ecommerce-screenshot-2-dark.jpg"
                    alt="Panel de administración"
                    fill
                    priority
                    className="rounded-lg shadow-xl drop-shadow-three mx-auto hidden max-w-full dark:block"
                    style={{objectFit: "cover"}}
                  />
                </div>
              </div>
              <div className="mt-8 text-center lg:mt-10">
                <p className="text-sm text-body-color italic dark:text-white/70">
                  Nuestras soluciones de e-commerce están diseñadas para aumentar las conversiones y mejorar la experiencia de compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcommerceSectionOne; 