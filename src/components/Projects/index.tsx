import { getTranslations } from "next-intl/server";

const categoryColors: Record<string, string> = {
  enterprise: "var(--color-primary)",
  ai: "var(--color-green)",
  fintech: "var(--color-accent)",
};

const Projects = async () => {
  const t = await getTranslations("home.projects");

  const items = [0, 1, 2].map((i) => ({
    name: t(`items.${i}.name`),
    description: t(`items.${i}.description`),
    technologies: t.raw(`items.${i}.technologies`) as string[],
    liveUrl: t(`items.${i}.liveUrl`),
    githubUrl: t(`items.${i}.githubUrl`),
    category: t(`items.${i}.category`),
  }));

  return (
    <section id="projects" className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <h2 className="mb-12 font-heading text-3xl font-bold text-t-text sm:text-4xl">
          {t("title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((project, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-md border border-t-border bg-t-surface shadow-card transition-shadow duration-150 hover:shadow-card-hover"
            >
              <div
                className="h-1"
                style={{
                  backgroundColor:
                    categoryColors[project.category] || "var(--color-primary)",
                }}
              />
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-t-text">
                  {project.name}
                </h3>
                <p className="mb-4 text-sm text-t-muted">
                  {project.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-t-border bg-t-surface px-2.5 py-0.5 font-mono text-xs font-medium text-t-muted"
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
                    className="text-t-muted transition-colors hover:text-t-text"
                  >
                    {t("viewOnGithub")}
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-t-primary/80 font-medium text-t-primary transition-colors"
                  >
                    {t("viewLive")} &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
