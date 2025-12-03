"use client";

import { FC, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  locale: string;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, locale }) => {
  const t = useTranslations("portfolio.card");
  const lang = (locale === "es" ? "es" : "en") as "en" | "es";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startOverlayTimeout = useCallback(() => {
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }
    overlayTimeoutRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, 1500);
  }, []);

  const handleImageMouseEnter = useCallback(() => {
    setShowOverlay(true);
    startOverlayTimeout();
  }, [startOverlayTimeout]);

  const handleImageMouseMove = useCallback(() => {
    setShowOverlay(true);
    startOverlayTimeout();
  }, [startOverlayTimeout]);

  const handleImageMouseLeave = useCallback(() => {
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }
    setShowOverlay(false);
  }, []);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1,
    );
  };

  return (
    <Card className="group overflow-hidden border border-gray-200/50 bg-white/70 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-2xl dark:border-white/10 dark:bg-gray-900/60 dark:hover:border-white/20">
      {/* Image Carousel */}
      <div
        className="relative aspect-video overflow-hidden bg-muted"
        onMouseEnter={handleImageMouseEnter}
        onMouseMove={handleImageMouseMove}
        onMouseLeave={handleImageMouseLeave}
      >
        <Image
          src={project.images[currentImageIndex].src}
          alt={project.images[currentImageIndex].alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient overlay on hover - auto-hides after 1.5s */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent transition-opacity duration-300 ${
            showOverlay ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Image Navigation */}
        {project.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900 ${
                showOverlay ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={nextImage}
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900 ${
                showOverlay ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>

            {/* Image Indicators */}
            <div
              className={`absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm transition-opacity duration-200 ${
                showOverlay ? "opacity-100" : "opacity-0"
              }`}
            >
              {project.images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "w-4 bg-primary shadow-sm shadow-primary/50"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="mb-2 text-balance text-xl font-semibold text-gray-900 dark:text-white">
          {project.title[lang]}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {project.description[lang]}
        </p>

        {/* Technologies */}
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="border border-primary/20 bg-primary/10 text-xs font-medium text-primary backdrop-blur-sm transition-colors hover:bg-primary/20 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            asChild
            className="flex-1 bg-primary/90 text-white shadow-lg shadow-primary/25 backdrop-blur-sm transition-all duration-200 hover:bg-primary hover:shadow-xl hover:shadow-primary/30"
          >
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("viewProject")}
            </a>
          </Button>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="border-gray-200/50 bg-white/50 text-gray-700 backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-white/80 dark:border-white/10 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:border-primary/50"
          >
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("code")}
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
