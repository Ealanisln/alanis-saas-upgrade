import {
  Building2,
  ShoppingCart,
  Zap,
  Activity,
  GitBranch,
  Maximize2,
} from "lucide-react";
import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: <Building2 className="h-10 w-10" />,
    title: "Arquitectura de Nivel Empresarial",
    paragraph:
      "Construimos plataformas con arquitecturas limpias, seguras y escalables. Utilizamos frameworks modernos como Next.js 15 y React 19, garantizando un rendimiento y fiabilidad de nivel empresarial.",
  },
  {
    id: 2,
    icon: <ShoppingCart className="h-10 w-10" />,
    title: "Soluciones Personalizadas SaaS y E‑Commerce",
    paragraph:
      "Creamos plataformas SaaS y e‑commerce multi‑tenant completamente personalizadas, con funciones avanzadas como facturación automatizada, inventario en tiempo real e integraciones con Stripe y Square.",
  },
  {
    id: 3,
    icon: <Zap className="h-10 w-10" />,
    title: "Alto Rendimiento y Optimización SEO",
    paragraph:
      "Diseñamos sitios y aplicaciones optimizados desde el núcleo, aplicando las mejores prácticas de Next.js y técnicas SEO avanzadas para lograr un posicionamiento orgánico superior y una carga ultrarrápida.",
  },
  {
    id: 4,
    icon: <Activity className="h-10 w-10" />,
    title: "Capacidades en Tiempo Real",
    paragraph:
      "Implementamos funcionalidades de comunicación instantánea, rastreo en vivo y actualizaciones dinámicas utilizando tecnologías como Supabase, Upstash Redis y WebSockets.",
  },
  {
    id: 5,
    icon: <GitBranch className="h-10 w-10" />,
    title: "Prácticas de Desarrollo Modernas",
    paragraph:
      "Aplicamos un enfoque de desarrollo basado en pruebas (TDD) con Jest y Playwright, integrando CI/CD automatizado y monitoreo en producción a través de Sentry y Vercel Analytics.",
  },
  {
    id: 6,
    icon: <Maximize2 className="h-10 w-10" />,
    title: "Totalmente Personalizable y Escalable",
    paragraph:
      "Cada solución se adapta a las necesidades de tu negocio. Nuestros sistemas son fáciles de escalar, flexibles y totalmente personalizables tanto en diseño como en funcionalidad.",
  },
];
export default featuresData;
