"use client";

import { useTranslations } from "next-intl";

const Experience = () => {
  const t = useTranslations("home.experience");

  const items = [0, 1, 2].map((i) => ({
    period: t(`items.${i}.period`),
    role: t(`items.${i}.role`),
    company: t(`items.${i}.company`),
    description: t(`items.${i}.description`),
  }));

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <h2 className="mb-12 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          {t("title")}
        </h2>
        <div className="space-y-0">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative border-l-2 border-neutral-200 py-6 pl-8 dark:border-neutral-800"
            >
              <div className="absolute -left-[5px] top-8 h-2 w-2 rounded-full bg-primary" />
              <p className="mb-1 text-sm text-neutral-500 dark:text-neutral-400">
                {item.period}
              </p>
              <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-white">
                {item.role}
                <span className="ml-2 font-normal text-neutral-500 dark:text-neutral-400">
                  @ {item.company}
                </span>
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
