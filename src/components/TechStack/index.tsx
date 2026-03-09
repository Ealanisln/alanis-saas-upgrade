"use client";

import { useTranslations } from "next-intl";

const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "⬢" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Sanity", icon: "S" },
  { name: "Git", icon: "⌥" },
];

const TechStack = () => {
  const t = useTranslations("home.techStack");

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <h2 className="mb-12 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          {t("title")}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800"
            >
              <span
                className="font-mono text-lg text-neutral-500 dark:text-neutral-400"
                aria-hidden="true"
              >
                {tech.icon}
              </span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
