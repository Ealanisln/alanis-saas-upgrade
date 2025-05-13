"use client";

import Image from "next/image";
import { useState } from "react";
import React from "react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const EcommerceSectionTwo = () => {
  const [activeTab, setActiveTab] = useState<string>("tienda");

  const features: FeatureProps[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v2H3zM3 15h18v2H3zM3 9h18v2H3zM3 21h18v2H3z" />
        </svg>
      ),
      title: "Catálogo personalizable",
      description: "Organiza tus productos con categorías, colecciones y etiquetas personalizadas."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "Múltiples métodos de pago",
      description: "Integración con PayPal, Stripe, Mercado Pago y más opciones locales."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: "Gestión de inventario",
      description: "Control de stock automático con alertas de bajo inventario y seguimiento."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Analítica avanzada",
      description: "Visualiza el rendimiento de ventas, comportamiento de usuarios y conversiones."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: "Personalización completa",
      description: "Adapta el diseño, colores y experiencia a tu marca e identidad visual."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Marketing integrado",
      description: "Herramientas de email marketing, descuentos y programas de fidelización."
    }
  ];

  const Feature = ({ icon, title, description }: FeatureProps) => (
    <div className="wow fadeInUp rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 sm:p-10">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/5 text-primary dark:bg-primary/10">
        {icon}
      </div>
      <h3 className="mb-4 text-xl font-bold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
        {title}
      </h3>
      <p className="text-base text-body-color dark:text-gray-300">{description}</p>
    </div>
  );

  return (
    <section id="ecommerce-pro" className="bg-gray-50 dark:bg-gray-900 py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-[720px] text-center lg:mb-20">
          <h2 className="mb-4 text-3xl font-bold !leading-tight text-dark dark:text-white sm:text-4xl md:text-[45px]">
            Potencia tu Negocio Online
          </h2>
          <p className="text-base !leading-relaxed text-body-color dark:text-gray-300 md:text-lg">
            Nuestra plataforma de e-commerce está diseñada para proporcionar una experiencia de compra excepcional y aumentar tus ventas con herramientas potentes y fáciles de usar.
          </p>
        </div>

        <div className="mb-16 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setActiveTab("tienda")}
            className={`rounded-full px-6 py-3 text-base font-medium transition ${
              activeTab === "tienda"
                ? "bg-primary text-white"
                : "bg-white text-body-color hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-primary"
            }`}
          >
            Tienda Online
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`rounded-full px-6 py-3 text-base font-medium transition ${
              activeTab === "admin"
                ? "bg-primary text-white"
                : "bg-white text-body-color hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-primary"
            }`}
          >
            Panel Administrativo
          </button>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="wow fadeInUp w-full px-4 lg:w-1/2">
            <div className="relative mx-auto max-w-[520px] lg:mr-0">
              {activeTab === "tienda" ? (
                <div className="relative rounded-2xl shadow-xl overflow-hidden">
                  <Image
                    src="/images/ecommerce/ecommerce-screenshot-1.jpg"
                    alt="Tienda online"
                    width={520}
                    height={390}
                    className="max-w-full dark:hidden"
                  />
                  <Image
                    src="/images/ecommerce/ecommerce-screenshot-1-dark.jpg"
                    alt="Tienda online"
                    width={520}
                    height={390}
                    className="max-w-full hidden dark:block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Experiencia de Usuario Premium</h3>
                    <p className="text-sm opacity-90">Diseño responsivo optimizado para conversiones</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl shadow-xl overflow-hidden">
                  <Image
                    src="/images/ecommerce/ecommerce-screenshot-2.jpg"
                    alt="Panel de administración"
                    width={520}
                    height={390}
                    className="max-w-full dark:hidden"
                  />
                  <Image
                    src="/images/ecommerce/ecommerce-screenshot-2-dark.jpg"
                    alt="Panel de administración"
                    width={520}
                    height={390}
                    className="max-w-full hidden dark:block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Dashboard Intuitivo</h3>
                    <p className="text-sm opacity-90">Control total sobre productos, pedidos e inventario</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="wow fadeInUp w-full px-4 lg:w-1/2">
            <div className="mt-12 lg:mt-0">
              <h2 className="mb-6 text-3xl font-bold !leading-tight text-dark dark:text-white sm:text-4xl md:text-[40px]">
                {activeTab === "tienda" 
                  ? "Tienda en línea de alto rendimiento" 
                  : "Panel administrativo potente y eficiente"}
              </h2>
              <p className="mb-9 text-base font-medium !leading-relaxed text-body-color dark:text-gray-300">
                {activeTab === "tienda"
                  ? "Sorprende a tus clientes con una tienda online moderna, rápida y fácil de navegar. Diseñada para maximizar conversiones y ofrecer una experiencia de compra excepcional."
                  : "Administra tu negocio con facilidad a través de nuestro intuitivo panel de control. Gestiona productos, pedidos, inventario y más desde un solo lugar."}
              </p>
              
              <div className="mb-8">
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-white duration-300 hover:bg-primary/90"
                >
                  Solicitar demostración
                  <span className="ml-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" fill="white" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="mx-auto mb-12 max-w-[720px] text-center">
            <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-3xl">
              Funcionalidades Avanzadas
            </h2>
            <p className="text-base text-body-color dark:text-gray-300">
              Equipado con todas las herramientas que necesitas para hacer crecer tu negocio online.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Feature
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcommerceSectionTwo; 