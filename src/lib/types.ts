// lib/types.ts
export interface ProjectImage {
  src: string;
  alt: string;
}

export interface LocalizedContent {
  en: string;
  es: string;
}

export interface Project {
  id: number;
  title: LocalizedContent;
  description: LocalizedContent;
  images: ProjectImage[];
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
}
