"use client";

import { useTranslations } from "next-intl";

const WebAppIcon = () => (
  <svg
    className="h-10 w-10 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const EcommerceIcon = () => (
  <svg
    className="h-10 w-10 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const ApiIcon = () => (
  <svg
    className="h-10 w-10 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const PerformanceIcon = () => (
  <svg
    className="h-10 w-10 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const ServiceCard = ({ icon, title, description, delay }: ServiceCardProps) => (
  <div
    className="wow fadeInUp w-full px-4 md:w-1/2 lg:w-1/4"
    data-wow-delay={delay}
  >
    <div className="dark:bg-dark-2 mb-8 rounded-lg bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl lg:mb-0">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
        {title}
      </h3>
      <p className="text-base text-body-color">{description}</p>
    </div>
  </div>
);

const ServicesExpanded = () => {
  const t = useTranslations("about.services");

  const services = [
    {
      icon: <WebAppIcon />,
      title: t("items.webApp.title"),
      description: t("items.webApp.description"),
      delay: ".1s",
    },
    {
      icon: <EcommerceIcon />,
      title: t("items.ecommerce.title"),
      description: t("items.ecommerce.description"),
      delay: ".15s",
    },
    {
      icon: <ApiIcon />,
      title: t("items.api.title"),
      description: t("items.api.description"),
      delay: ".2s",
    },
    {
      icon: <PerformanceIcon />,
      title: t("items.performance.title"),
      description: t("items.performance.description"),
      delay: ".25s",
    },
  ];

  return (
    <section className="bg-gray-light py-16 dark:bg-bg-color-dark md:py-20 lg:py-28">
      <div className="container">
        <div className="wow fadeInUp mx-auto mb-12 max-w-[620px] text-center">
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-base text-body-color">{t("subtitle")}</p>
        </div>
        <div className="-mx-4 flex flex-wrap justify-center">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesExpanded;
