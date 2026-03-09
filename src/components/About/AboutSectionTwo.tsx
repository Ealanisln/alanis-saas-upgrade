"use client";
import { useTranslations } from "next-intl";

const AboutSectionTwo = () => {
  const t = useTranslations("about.section.values");

  const values = [
    { key: "quality" },
    { key: "learning" },
    { key: "collaboration" },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ key }) => (
            <div
              key={key}
              className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800"
            >
              <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">
                {t(`${key}.title`)}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
