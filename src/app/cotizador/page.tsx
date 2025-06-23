import { Metadata } from 'next';
import { ServiceCalculator } from '@/components/Calculator';

export const metadata: Metadata = {
  title: 'Cotizador de Servicios | Desarrollo Web, Diseño y Marketing',
  description: 'Calcula el costo de tu proyecto de desarrollo web fullstack, diseño UI/UX y marketing digital. Cotización personalizada con precios transparentes.',
  keywords: [
    'cotizador web',
    'desarrollo web precio',
    'diseño web costo',
    'marketing digital precio',
    'next.js desarrollo',
    'typescript fullstack',
    'postgresql desarrollo'
  ],
  openGraph: {
    title: 'Cotizador de Servicios - Desarrollo Web & Marketing',
    description: 'Obtén una cotización personalizada para tu proyecto digital',
    type: 'website',
  },
};

export default function CotizadorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ServiceCalculator />
    </main>
  );
}
