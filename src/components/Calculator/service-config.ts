import { ServiceCategory } from '@/types/calculator/service-calculator.types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'development',
    name: 'Desarrollo Web',
    icon: 'Code',
    basePrice: 1500,
    description: 'Desarrollo fullstack con Next.js, TypeScript y PostgreSQL',
    options: [
      {
        id: 'landing',
        name: 'Landing Page',
        description: 'Página de aterrizaje optimizada con Next.js y TypeScript',
        priceMultiplier: 1,
        complexity: 'basic',
        estimatedHours: 40,
        features: ['Responsive Design', 'SEO Optimizado', 'Formulario de Contacto'],
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS']
      },
      {
        id: 'corporate',
        name: 'Sitio Corporativo',
        description: 'Sitio completo con CMS, blog y formularios',
        priceMultiplier: 2.5,
        complexity: 'intermediate',
        estimatedHours: 100,
        features: ['CMS Integrado', 'Blog', 'Múltiples Páginas', 'Panel Admin'],
        technologies: ['Next.js', 'Sanity CMS', 'PostgreSQL', 'Prisma']
      },
      {
        id: 'ecommerce',
        name: 'E-commerce',
        description: 'Tienda online con Stripe, inventario y dashboard',
        priceMultiplier: 4,
        complexity: 'advanced',
        estimatedHours: 200,
        features: ['Pagos con Stripe', 'Gestión de Inventario', 'Dashboard Admin', 'Carrito de Compras'],
        technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis']
      },
      {
        id: 'webapp',
        name: 'Aplicación Web',
        description: 'SaaS personalizado con autenticación y base de datos',
        priceMultiplier: 6,
        complexity: 'advanced',
        estimatedHours: 300,
        features: ['Autenticación JWT', 'Base de Datos', 'API REST', 'Dashboard Personalizado'],
        technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'NextAuth.js']
      }
    ]
  },
  {
    id: 'design',
    name: 'Diseño UI/UX',
    icon: 'Palette',
    basePrice: 800,
    description: 'Diseño centrado en el usuario con Figma y Design Systems',
    options: [
      {
        id: 'wireframes',
        name: 'Wireframes',
        description: 'Estructura y flujo de navegación',
        priceMultiplier: 1,
        complexity: 'basic',
        estimatedHours: 20,
        features: ['Flujo de Usuario', 'Estructura de Contenido', 'Navegación'],
        technologies: ['Figma', 'Miro', 'User Research']
      },
      {
        id: 'mockups',
        name: 'Mockups HD',
        description: 'Diseños de alta fidelidad en Figma',
        priceMultiplier: 2,
        complexity: 'intermediate',
        estimatedHours: 50,
        features: ['Diseño Visual', 'Interacciones', 'Prototipos'],
        technologies: ['Figma', 'Adobe Creative Suite', 'Principle']
      },
      {
        id: 'branding',
        name: 'Identidad de Marca',
        description: 'Logo, paleta de colores y guía de marca',
        priceMultiplier: 2.5,
        complexity: 'intermediate',
        estimatedHours: 60,
        features: ['Logo Design', 'Paleta de Colores', 'Tipografía', 'Manual de Marca'],
        technologies: ['Adobe Illustrator', 'Figma', 'Brand Guidelines']
      },
      {
        id: 'system',
        name: 'Design System',
        description: 'Sistema completo de componentes reutilizables',
        priceMultiplier: 3.5,
        complexity: 'advanced',
        estimatedHours: 80,
        features: ['Librería de Componentes', 'Tokens de Diseño', 'Documentación'],
        technologies: ['Figma', 'Storybook', 'Design Tokens']
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing Digital',
    icon: 'TrendingUp',
    basePrice: 600,
    description: 'Estrategias digitales para hacer crecer tu negocio',
    options: [
      {
        id: 'seo',
        name: 'SEO Técnico',
        description: 'Optimización técnica y contenido para buscadores',
        priceMultiplier: 1,
        complexity: 'basic',
        estimatedHours: 30,
        features: ['Auditoría SEO', 'Optimización On-Page', 'Schema Markup'],
        technologies: ['Google Analytics', 'Search Console', 'SEMrush']
      },
      {
        id: 'content',
        name: 'Content Marketing',
        description: 'Estrategia y creación de contenido de valor',
        priceMultiplier: 2,
        complexity: 'intermediate',
        estimatedHours: 60,
        features: ['Estrategia de Contenido', 'Blog Posts', 'Copywriting'],
        technologies: ['WordPress', 'Notion', 'Canva', 'Google Docs']
      },
      {
        id: 'social',
        name: 'Social Media',
        description: 'Gestión y estrategia en redes sociales',
        priceMultiplier: 1.5,
        complexity: 'intermediate',
        estimatedHours: 40,
        features: ['Calendario Editorial', 'Diseño de Posts', 'Community Management'],
        technologies: ['Meta Business', 'Hootsuite', 'Canva', 'Analytics']
      },
      {
        id: 'ads',
        name: 'Publicidad Digital',
        description: 'Campañas pagadas en Google Ads y Meta',
        priceMultiplier: 3,
        complexity: 'advanced',
        estimatedHours: 80,
        features: ['Google Ads', 'Meta Ads', 'Optimización ROI', 'A/B Testing'],
        technologies: ['Google Ads', 'Facebook Ads Manager', 'Google Analytics']
      }
    ]
  }
];