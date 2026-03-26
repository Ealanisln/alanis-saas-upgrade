import { getTranslations } from "next-intl/server";

const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "⬢" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Prisma", icon: "◆" },
  { name: "Docker", icon: "🐳" },
];

const TechStack = async () => {
  const t = await getTranslations("home.techStack");

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container">
        <h2 className="mb-12 font-heading text-3xl font-bold text-t-text sm:text-4xl">
          {t("title")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-3 rounded-md border border-t-border bg-t-surface p-4 transition-all duration-150 hover:shadow-card-hover"
            >
              <span className="text-lg text-t-muted" aria-hidden="true">
                {tech.icon}
              </span>
              <span className="text-sm font-medium text-t-text">
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
