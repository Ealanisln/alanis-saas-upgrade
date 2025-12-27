"use client";

import { useTranslations } from "next-intl";

const CalendarIcon = () => (
  <svg
    className="h-8 w-8 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CodeIcon = () => (
  <svg
    className="h-8 w-8 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    className="h-8 w-8 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: string;
}

const StatCard = ({ icon, value, label, delay }: StatCardProps) => (
  <div className="wow fadeInUp w-full px-4 md:w-1/3" data-wow-delay={delay}>
    <div className="dark:bg-dark-2 mb-8 rounded-lg bg-white p-8 shadow-lg md:mb-0">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mb-2 text-4xl font-bold text-black dark:text-white">
        {value}
      </h3>
      <p className="text-base font-medium text-body-color">{label}</p>
    </div>
  </div>
);

const ProfessionalStats = () => {
  const t = useTranslations("about.stats");

  const stats = [
    {
      icon: <CalendarIcon />,
      value: t("years.value"),
      label: t("years.label"),
      delay: ".1s",
    },
    {
      icon: <CodeIcon />,
      value: t("technologies.value"),
      label: t("technologies.label"),
      delay: ".15s",
    },
    {
      icon: <StarIcon />,
      value: t("satisfaction.value"),
      label: t("satisfaction.label"),
      delay: ".2s",
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
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalStats;
