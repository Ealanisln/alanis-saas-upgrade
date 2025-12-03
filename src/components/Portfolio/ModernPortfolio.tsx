import { FC } from "react";
import { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";

interface PortfolioProps {
  projects: Project[];
  locale: string;
}

const ModernPortfolio: FC<PortfolioProps> = ({ projects, locale }) => {
  return (
    <div className="relative">
      {/* Glass orb backgrounds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl dark:bg-accent/5" />
      </div>

      {/* Projects grid */}
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </div>
  );
};

export default ModernPortfolio;
