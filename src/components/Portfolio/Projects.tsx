// src/components/portafolio/Projects.tsx
"use client";

import { ExternalLink, Github, Info, ArrowRight, Code, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import projects from "./ProjectsData";

// Interface definitions
interface ProjectImage {
  src: string;
  alt: string;
}

interface Project {
  id: string | number;
  title: string;
  description: string;
  technologies: string[];
  images: ProjectImage[];
  liveUrl: string;
  githubUrl: string;
}

export function PortafolioProjects() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const allTechnologies = [...new Set(projects.flatMap(p => p.technologies))];
  
  // Filter projects based on selected technologies
  const filteredProjects = activeFilters.length === 0
    ? projects.map(project => ({...project, id: String(project.id)}))
    : projects
        .filter(project => 
          activeFilters.some(filter => project.technologies.includes(filter))
        )
        .map(project => ({...project, id: String(project.id)}));

  const toggleFilter = (tech: string) => {
    setActiveFilters(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech) 
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <section className="space-y-10">
      {/* Filter header with count */}
      <div className="flex flex-wrap justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Mostrando {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''}
          </h3>
          {activeFilters.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Filtrado por {activeFilters.length} tecnología{activeFilters.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Technology filters with scrolling shadow effect */}
      <div className="relative">
        <div 
          ref={filtersRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide relative gap-2"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <style jsx global>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {allTechnologies.map((tech) => (
            <Badge
              key={tech}
              variant={activeFilters.includes(tech) ? "default" : "outline"}
              className={`px-3 py-1.5 text-sm font-medium cursor-pointer whitespace-nowrap transition-all duration-300 ${
                activeFilters.includes(tech) 
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white scale-105" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => toggleFilter(tech)}
            >
              {tech}
            </Badge>
          ))}
          
          {/* Gradient fade for horizontal scroll */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
        </div>
      </div>
      
      {/* Projects grid with hover effects */}
      <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            isHovered={hoveredProject === String(project.id)}
            onHover={(id) => setHoveredProject(id)}
            onLeave={() => setHoveredProject(null)}
          />
        ))}
      </div>
      
      {/* Empty state when no projects match filters */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-6 mb-4">
            <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No se encontraron proyectos
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            No hay proyectos que coincidan con los filtros seleccionados. Intenta con otra combinación de tecnologías.
          </p>
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400"
          >
            Mostrar todos los proyectos
          </Button>
        </div>
      )}
    </section>
  );
}

function ProjectCard({ 
  project, 
  isHovered,
  onHover,
  onLeave 
}: { 
  project: Project;
  isHovered: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
}) {
  return (
    <div 
      className="group perspective-1000"
      onMouseEnter={() => onHover(String(project.id))}
      onMouseLeave={onLeave}
    >
      <Card 
        className={`h-full overflow-hidden border border-blue-100/50 dark:border-blue-900/20 bg-white dark:bg-gray-800/90 shadow-sm transition-all duration-300 transform ${
          isHovered ? 'shadow-xl shadow-blue-100/50 dark:shadow-blue-900/10 scale-[1.02] -rotate-1' : ''
        }`}
      >
        <CardHeader className="p-0 overflow-hidden">
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {project.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className={`rounded-t-lg object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        priority={index === 0}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {project.images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 border-0 bg-white/90 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white sm:h-9 sm:w-9" />
                  <CarouselNext className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 border-0 bg-white/90 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white sm:h-9 sm:w-9" />
                </>
              )}
            </Carousel>
            
            {/* Featured tag for first project */}
            {String(project.id) === '1' && (
              <div className="absolute top-3 left-3 z-10">
                <Badge 
                  className="bg-blue-600 text-white text-xs px-2.5 py-1 font-medium"
                >
                  Destacado
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow space-y-4 p-5 sm:p-6">
          <div>
            <ProjectDialog project={project}>
              <div className="group/title cursor-pointer">
                <CardTitle className="text-xl font-semibold tracking-tight text-gray-800 dark:text-white transition-colors group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 sm:text-2xl">
                  {project.title}
                </CardTitle>
              </div>
            </ProjectDialog>
            
            <CardDescription className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
              {project.description}
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-1.5 pt-1 sm:gap-2">
            {project.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 sm:px-2.5 sm:py-0.5 sm:text-xs border-0"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
          <div className="flex w-full gap-3">
            <Button
              asChild
              variant="default"
              className="flex-1 bg-blue-600 dark:bg-blue-700 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
            >
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                Demo
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                <Github className="mr-2 h-4 w-4" />
                Código
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Project dialog component (extracted to reduce duplication)
function ProjectDialog({ 
  project, 
  children 
}: { 
  project: Project, 
  children: React.ReactNode 
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] mt-14 overflow-y-auto bg-white dark:bg-gray-900 sm:max-w-3xl sm:mt-0 border border-blue-100 dark:border-blue-900/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
            {project.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-8">
          <Carousel className="w-full">
            <CarouselContent>
              {project.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {project.images.length > 1 && (
              <>
                <CarouselPrevious className="h-8 w-8 border border-blue-100 dark:border-blue-900/50 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 sm:h-10 sm:w-10" />
                <CarouselNext className="h-8 w-8 border border-blue-100 dark:border-blue-900/50 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 sm:h-10 sm:w-10" />
              </>
            )}
          </Carousel>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Acerca del proyecto</h3>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              {project.description}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tecnologías utilizadas</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 border-0"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="pt-4 flex gap-4">
            <Button
              asChild
              variant="default"
              size="lg"
              className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Ver proyecto en vivo
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-300 dark:border-gray-600"
            >
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                <Github className="mr-2 h-5 w-5" />
                Ver código fuente
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}