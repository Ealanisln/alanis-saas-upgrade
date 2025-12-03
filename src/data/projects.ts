// data/projects.ts
import { Project } from "@/lib/types";

const projects: Project[] = [
  {
    id: 1,
    title: {
      en: "Destino SF - E-commerce & Catering Platform",
      es: "Destino SF - Plataforma de E-commerce y Catering",
    },
    description: {
      en: "Premium Argentine cuisine platform featuring authentic empanadas, alfajores, and professional catering services. Full e-commerce with Square payments, weight-based shipping, and real-time order tracking.",
      es: "Plataforma de cocina argentina premium con empanadas auténticas, alfajores y servicios de catering profesional. E-commerce completo con pagos Square, envío por peso y seguimiento de pedidos en tiempo real.",
    },
    images: [
      {
        src: "/images/projects/destinosf.webp",
        alt: "Destino SF - Homepage",
      },
    ],
    technologies: [
      "Next.js 15",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Square API",
      "Shippo",
    ],
    liveUrl: "https://destinosf.com",
    githubUrl: "https://github.com/Ealanisln/destino-sf",
  },
  {
    id: 2,
    title: {
      en: "Ready Set - Multi-User Delivery Platform",
      es: "Ready Set - Plataforma de Entregas Multi-Usuario",
    },
    description: {
      en: "Comprehensive delivery management platform connecting drivers, vendors, and clients with real-time tracking, live map visualization, push notifications, and carrier integrations.",
      es: "Plataforma integral de gestión de entregas que conecta conductores, vendedores y clientes con seguimiento en tiempo real, visualización de mapas en vivo, notificaciones push e integraciones con transportistas.",
    },
    images: [
      {
        src: "/images/projects/readysetllc.webp",
        alt: "Ready Set - Main Dashboard",
      },
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Mapbox GL",
      "Firebase",
      "SendGrid",
    ],
    liveUrl: "https://readysetllc.com",
    githubUrl: "https://github.com/Ealanisln/ready-set",
  },
  {
    id: 3,
    title: {
      en: "Vetify - Multi-Tenant Veterinary SaaS",
      es: "Vetify - SaaS Veterinario Multi-Tenant",
    },
    description: {
      en: "Comprehensive veterinary practice management platform with multi-clinic support, appointment scheduling, pet health records, inventory management, and Stripe subscription billing.",
      es: "Plataforma integral de gestión para prácticas veterinarias con soporte multi-clínica, agenda de citas, historiales de salud de mascotas, gestión de inventario y facturación por suscripción con Stripe.",
    },
    images: [
      {
        src: "/images/projects/vetify.webp",
        alt: "Vetify - Dashboard",
      },
    ],
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Prisma",
      "Stripe",
      "Kinde Auth",
      "Supabase",
    ],
    liveUrl: "https://vetify.pro",
    githubUrl: "https://github.com/Ealanisln/vetify",
  },
  {
    id: 4,
    title: {
      en: "ESS-NYC - Environmental Services Website",
      es: "ESS-NYC - Sitio Web de Servicios Ambientales",
    },
    description: {
      en: "Professional website for Environmental Safeguard Solutions featuring environmental testing services, Sanity CMS with real-time visual editing, and lead generation forms with strict security policies.",
      es: "Sitio web profesional para Environmental Safeguard Solutions con servicios de pruebas ambientales, Sanity CMS con edición visual en tiempo real y formularios de generación de leads con políticas de seguridad estrictas.",
    },
    images: [
      {
        src: "/images/projects/ess-nyc.webp",
        alt: "ESS-NYC - Homepage",
      },
    ],
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Sanity CMS",
      "Tailwind CSS",
      "Resend",
      "Upstash",
    ],
    liveUrl: "https://ess-nyc.com",
    githubUrl: "https://github.com/Ealanisln/ess-nyc",
  },
];

export default projects;
