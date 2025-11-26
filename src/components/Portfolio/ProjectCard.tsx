"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/lib/types";
import TechBadge from "./TechBadge";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="group relative transform cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-900"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View project: ${project.title}`}
    >
      {/* Image Carousel */}
      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <div className="relative h-full w-full">
          <Image
            src={project.images[currentImageIndex].src}
            alt={project.images[currentImageIndex].alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Image Navigation */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-900/80"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-900/80"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {project.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "w-4 bg-white"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
          {project.title}
        </h3>

        <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
          {project.technologies.length > 3 && (
            <span className="px-3 py-1 text-xs font-medium text-gray-500">
              +{project.technologies.length - 3} más
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Proyecto
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Github className="h-4 w-4" />
            Código
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
