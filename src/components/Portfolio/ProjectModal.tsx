"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Project } from "@/lib/types";
import TechBadge from "./TechBadge";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1,
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="animate-fadeIn fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="animate-slideUp pointer-events-auto relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 transition-colors hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex h-full flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-800 md:h-auto md:w-1/2">
              <Image
                src={project.images[currentImageIndex].src}
                alt={project.images[currentImageIndex].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Image Navigation */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 transition-colors hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 transition-colors hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "w-8 bg-white"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto p-8">
              <h2
                id="modal-title"
                className="mb-4 text-3xl font-bold text-gray-900 dark:text-white"
              >
                {project.title}
              </h2>

              <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  Tecnologías Utilizadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <TechBadge key={tech} tech={tech} />
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <ExternalLink className="h-5 w-5" />
                  Ver Proyecto
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-200 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  <Github className="h-5 w-5" />
                  Ver Código
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectModal;
