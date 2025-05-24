// lib/types.ts
export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  images: ProjectImage[];
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
} 