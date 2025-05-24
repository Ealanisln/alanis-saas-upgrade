// data/projects.ts
import { Project } from '@/lib/types';

const projects: Project[] = [
  {
    id: 1,
    title: "Ready Set - Plataforma de Servicios de Entrega",
    description: "Una plataforma web completa para gestionar servicios de entrega, permitiendo el registro de conductores, vendedores y clientes. Ofrece entregas el mismo día, servicios bajo demanda y manejo de entregas urgentes.",
    images: [
      {
        src: "/images/projects/ready-1.webp",
        alt: "Ready Set - Vista Principal",
      },
      {
        src: "/images/projects/ready-2.webp",
        alt: "Ready Set - Panel de Control",
      },
      {
        src: "/images/projects/ready-3.webp",
        alt: "Ready Set - Gestión de Entregas",
      },
    ],
    technologies: ["Next.js", "PostgreSQL", "Prisma", "Shadcn"],
    liveUrl: "https://readysetllc.com",
    githubUrl: "https://github.com/Ealanisln/ready-set",
  },
  {
    id: 2,
    title: "Vet Family - Sistema de Gestión Veterinaria",
    description: "Sistema integral de gestión para clínicas veterinarias que permite administrar perfiles de usuarios, mascotas, historiales médicos, citas, facturación y recordatorios de manera eficiente.",
    images: [
      {
        src: "/images/projects/vet-1.webp",
        alt: "Vet Family - Dashboard Principal",
      },
      {
        src: "/images/projects/vet-2.webp",
        alt: "Vet Family - Registro de Mascotas",
      },
      {
        src: "/images/projects/vet-3.webp",
        alt: "Vet Family - Historial Médico de Mascotas",
      },
    ],
    technologies: ["Next.js", "MongoDB", "Prisma", "TypeScript"],
    liveUrl: "https://vetforfamily.com",
    githubUrl: "https://github.com/Ealanisln/vet-family-23",
  },
  {
    id: 3,
    title: "Pagaré Fácil - Generador de Pagarés",
    description: "Aplicación web que permite a los usuarios generar pagarés personalizados de manera sencilla. Incluye interfaz intuitiva para ingresar información del deudor, términos de pago y detalles de los pagarés.",
    images: [
      {
        src: "/images/projects/pagare-1.webp",
        alt: "Pagaré Fácil - Formulario de Generación",
      },
      {
        src: "/images/projects/pagare-2.webp",
        alt: "Pagaré Fácil - Ejemplo de Pagaré Generado",
      },
    ],
    technologies: ["Next.js", "React", "PDF Generation", "Responsive Design"],
    liveUrl: "https://www.pagarefacil.pro",
    githubUrl: "https://github.com/Ealanisln/pagare-facil",
  },
];

export default projects; 