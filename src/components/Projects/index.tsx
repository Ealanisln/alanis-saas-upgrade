"use client";

import { useTranslations } from "next-intl";

const Projects = () => {
  const t = useTranslations("home.projects");

  const items = [0, 1, 2].map((i) => ({
    name: t(`items.${i}.name`),
    description: t(`items.${i}.description`),
    technologies: t.raw(`items.${i}.technologies`) as string[],
    liveUrl: t(`items.${i}.liveUrl`),
    githubUrl: t(`items.${i}.githubUrl`),
  }));

  return (
    <section id="projects" className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <h2 className="mb-12 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          {t("title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((project, index) => (
            <div
              key={index}
              className="group rounded-lg border border-neutral-200 p-6 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
            >
              <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                {project.name}
              </h3>
              <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  {t("viewOnGithub")}
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  {t("viewLive")} &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
