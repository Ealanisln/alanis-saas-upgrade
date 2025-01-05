"use client";

import { ExternalLink, Github, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export function PortfolioProjects() {
  return (
    <section className="container mx-auto px-6 py-4 sm:px-4 sm:py-16">
      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="flex flex-col border-muted bg-card transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="p-0">
              <Carousel className="w-full">
                <CarouselContent>
                  {project.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[16/10]">
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
                    <CarouselPrevious className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 border-0 bg-white/90 hover:bg-white sm:left-4 sm:h-10 sm:w-10" />
                    <CarouselNext className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 border-0 bg-white/90 hover:bg-white sm:right-4 sm:h-10 sm:w-10" />
                  </>
                )}
              </Carousel>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 p-4 sm:space-y-4 sm:p-6">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer">
                    <CardTitle className="text-xl font-semibold tracking-tight group-hover:text-primary sm:text-2xl">
                      {project.title}
                    </CardTitle>
                  </div>
                </DialogTrigger>
                <DialogContent className="mt-14 h-[90vh] overflow-y-auto sm:mt-0 sm:max-w-[600px] z-[100]">

                  <DialogHeader>
                    <DialogTitle className="mb-4 text-xl sm:text-2xl">
                      {project.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {project.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative aspect-[16/10]">
                              <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="rounded-lg object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {project.images.length > 1 && (
                        <>
                          <CarouselPrevious className="h-8 w-8 border-0 bg-white/90 hover:bg-white sm:h-10 sm:w-10" />
                          <CarouselNext className="h-8 w-8 border-0 bg-white/90 hover:bg-white sm:h-10 sm:w-10" />
                        </>
                      )}
                    </Carousel>
                    <p className="text-base leading-relaxed sm:text-lg">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="px-3 py-1 text-sm font-medium"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                      <Button asChild className="w-full">
                        <Link
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Live Demo</span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          <span>Source Code</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <CardDescription className="line-clamp-3 text-sm leading-relaxed sm:text-base">
                {project.description}
              </CardDescription>
              <div className="flex flex-wrap gap-1.5 pt-2 sm:gap-2">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="px-2 py-0.5 text-xs font-medium sm:px-3 sm:py-1 sm:text-sm"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="z-20 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-10 px-4 inline-flex items-center justify-center"
                  >
                    <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                    Ver detalles
                  </Button>
                </DialogTrigger>
                <DialogContent className="mt-14 h-[90vh] overflow-y-auto sm:mt-0 sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="mb-4 text-xl sm:text-2xl">
                      {project.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {project.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative aspect-[16/10]">
                              <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="rounded-lg object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {project.images.length > 1 && (
                        <>
                          <CarouselPrevious className="h-8 w-8 border-0 bg-white/90 hover:bg-white sm:h-10 sm:w-10" />
                          <CarouselNext className="h-8 w-8 border-0 bg-white/90 hover:bg-white sm:h-10 sm:w-10" />
                        </>
                      )}
                    </Carousel>
                    <p className="text-base leading-relaxed sm:text-lg">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="px-3 py-1 text-sm font-medium"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                      <Button asChild className="w-full">
                        <Link
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Live Demo</span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          <span>Source Code</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                asChild
                variant="outline"
                className="w-full h-10 px-4"
              >
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                  Live Demo
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full h-10 px-4"
              >
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <Github className="h-4 w-4 mr-2 flex-shrink-0" />
                  Source Code
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}