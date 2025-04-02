// src/components/Portfolio/Projects.tsx
"use client";

import { ExternalLink, Github, Info, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  id: string | number;  // Aceptar tanto string como number
  title: string;
  description: string;
  technologies: string[];
  images: ProjectImage[];
  liveUrl: string;
  githubUrl: string;
}

export function PortfolioProjects() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
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

  return (
    <section className="space-y-10">
      {/* Technology filters */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-2 flex-wrap">
          {allTechnologies.map((tech) => (
            <Badge
              key={tech}
              variant={activeFilters.includes(tech) ? "default" : "outline"}
              className={`px-3 py-1.5 text-sm font-medium cursor-pointer ${
                activeFilters.includes(tech) 
                  ? "bg-blue-600 dark:bg-blue-500 text-white" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => toggleFilter(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Projects grid */}
      <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div>
      <Card className="group h-full overflow-hidden border-border/40 bg-card dark:bg-gray-800/90 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md">
        <CardHeader className="p-0">
          <Carousel className="w-full">
            <CarouselContent>
              {project.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="rounded-t-lg object-cover"
                      priority={index === 0}
                    />
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
                className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-200 sm:px-2.5 sm:py-0.5 sm:text-xs"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3 p-5 sm:p-6">
          <ProjectDialog project={project}>
            <Button
              variant="outline"
              className="w-full justify-between border-primary/20 bg-background/80 text-sm font-medium backdrop-blur-sm hover:bg-primary/5"
            >
              <span className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Ver detalles
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </ProjectDialog>
          
          <div className="flex w-full gap-3">
            <Button
              asChild
              variant="default"
              className="flex-1 bg-blue-600 dark:bg-blue-700 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Demo
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
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
      <DialogContent className="max-h-[90vh] mt-14 overflow-y-auto bg-white dark:bg-gray-900 sm:max-w-3xl sm:mt-0">
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
                <CarouselPrevious className="h-8 w-8 border border-border/50 bg-background/80 hover:bg-background sm:h-10 sm:w-10" />
                <CarouselNext className="h-8 w-8 border border-border/50 bg-background/80 hover:bg-background sm:h-10 sm:w-10" />
              </>
            )}
          </Carousel>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Acerca del proyecto</h3>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              {project.description}
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tecnologías utilizadas</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Button asChild size="lg" className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white">
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Ver Demo en vivo</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span>Ver Código Fuente</span>
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}