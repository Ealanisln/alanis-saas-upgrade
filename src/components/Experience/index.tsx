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
        <h2 className="mb-12 font-heading text-3xl font-bold text-t-text sm:text-4xl">
          {t("title")}
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-md border border-t-border bg-t-surface p-6 shadow-card"
            >
              <span className="text-t-muted/40 shrink-0 font-mono text-3xl font-bold">
                {String(index + 1).padStart(2, "0")}.
              </span>
              <div>
                <p className="mb-1 font-mono text-xs text-t-muted">
                  {item.period}
                </p>
                <h3 className="text-lg font-semibold text-t-text">
                  {item.role}{" "}
                  <span className="text-t-muted">@ {item.company}</span>
                </h3>
                <p className="mt-1 text-sm text-t-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
