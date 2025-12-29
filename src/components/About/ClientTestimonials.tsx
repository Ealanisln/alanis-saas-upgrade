"use client";

import { useTranslations } from "next-intl";

const QuoteIcon = () => (
  <svg
    className="h-8 w-8 text-primary/30"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  delay: string;
}

const TestimonialCard = ({
  quote,
  name,
  role,
  company,
  delay,
}: TestimonialCardProps) => (
  <div
    className="wow fadeInUp w-full px-4 md:w-1/2 lg:w-1/3"
    data-wow-delay={delay}
  >
    <div className="dark:bg-dark-2 mb-8 rounded-lg bg-white p-8 shadow-lg lg:mb-0">
      <div className="mb-4">
        <QuoteIcon />
      </div>
      <p className="mb-6 text-base italic text-body-color">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center">
        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-base font-semibold text-black dark:text-white">
            {name}
          </h4>
          <p className="text-sm text-body-color">
            {role} @ {company}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ClientTestimonials = () => {
  const t = useTranslations("about.testimonials");

  const testimonials = [
    {
      quote: t("items.0.quote"),
      name: t("items.0.name"),
      role: t("items.0.role"),
      company: t("items.0.company"),
      delay: ".1s",
    },
    {
      quote: t("items.1.quote"),
      name: t("items.1.name"),
      role: t("items.1.role"),
      company: t("items.1.company"),
      delay: ".15s",
    },
    {
      quote: t("items.2.quote"),
      name: t("items.2.name"),
      role: t("items.2.role"),
      company: t("items.2.company"),
      delay: ".2s",
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="wow fadeInUp mx-auto mb-12 max-w-[620px] text-center">
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-base text-body-color">{t("subtitle")}</p>
        </div>
        <div className="-mx-4 flex flex-wrap justify-center">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonials;
