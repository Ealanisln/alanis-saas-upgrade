# Calculadora de Servicios - Cotizador Interactivo

Una calculadora interactiva para cotizar servicios de desarrollo web fullstack, diseño UI/UX y marketing digital, construida con Next.js, TypeScript y PostgreSQL.

## 🚀 Características

### Servicios Disponibles
- **Desarrollo Web**: Landing pages, sitios corporativos, e-commerce, aplicaciones web
- **Diseño UI/UX**: Wireframes, mockups HD, identidad de marca, design systems
- **Marketing Digital**: SEO técnico, content marketing, social media, publicidad digital

### Funcionalidades
- ✅ Cálculo dinámico de precios en tiempo real
- ✅ Configuración por tipo de cliente (startup, PyME, enterprise)
- ✅ Niveles de urgencia con ajustes de precio y tiempo
- ✅ Estimación de horas y tiempo de entrega
- ✅ Cálculo automático de impuestos (IVA 16%)
- ✅ Interfaz responsive y accesible
- ✅ Persistencia en base de datos PostgreSQL
- ✅ API REST para gestión de cotizaciones

## 🛠 Stack Tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Validación**: Zod
- **Estado**: React Hooks personalizados

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── cotizador/           # Página principal del cotizador
│   └── api/quotes/          # API endpoints para cotizaciones
├── components/
│   └── Calculator/          # Componentes del cotizador
│       ├── ServiceCalculator.tsx    # Componente principal
│       ├── ServiceCard.tsx          # Tarjeta de servicio
│       ├── QuoteSummary.tsx         # Resumen de cotización
│       ├── ProjectConfiguration.tsx # Configuración del proyecto
│       ├── service-config.ts        # Configuración de servicios
│       ├── quote-calculator.ts      # Lógica de cálculo
│       └── index.ts                 # Exports
├── types/calculator/        # Tipos TypeScript
├── hooks/                   # React hooks personalizados
└── prisma/                  # Esquema de base de datos
```

## 🎯 Componentes Principales

### ServiceCalculator
Componente principal que orquesta toda la funcionalidad:
- Gestión del estado de servicios seleccionados
- Configuración de cliente y urgencia
- Cálculo automático de cotizaciones

### QuoteCalculator (Clase)
Lógica de negocio para cálculos:
```typescript
const quote = quoteCalculator.calculateQuote(services, clientType, urgency);
```

### ServiceCard
Tarjeta individual para cada servicio con:
- Información detallada del servicio
- Tecnologías y características incluidas
- Controles para agregar/quitar servicios

## 💰 Lógica de Precios

### Precios Base
- **Desarrollo Web**: desde $1,500 MXN
- **Diseño UI/UX**: desde $800 MXN  
- **Marketing Digital**: desde $600 MXN

### Modificadores
- **Startup**: -15% descuento
- **PyME**: Precio estándar
- **Enterprise**: +10% premium

### Urgencia
- **Normal**: Sin recargo
- **Express**: +50% precio, -30% tiempo
- **Urgente**: +100% precio, -50% tiempo

### Impuestos
- **IVA**: 16% sobre el total

## 🔧 Configuración y Uso

### 1. Instalación de Dependencias
```bash
npm install
# o
pnpm install
```

### 2. Configuración de Base de Datos
```bash
# Generar migración para el modelo Quote
npx prisma migrate dev --name add-quote-model

# Generar cliente Prisma
npx prisma generate
```

### 3. Variables de Entorno
```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

### 4. Uso del Componente
```typescript
import { ServiceCalculator } from '@/components/Calculator';

export default function CotizadorPage() {
  return <ServiceCalculator />;
}
```

## 📡 API Endpoints

### POST /api/quotes
Crear nueva cotización:
```typescript
const quote = await fetch('/api/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(quoteRequest)
});
```

### GET /api/quotes
Listar cotizaciones con paginación:
```typescript
const quotes = await fetch('/api/quotes?page=1&limit=10&status=draft');
```

## 🎨 Personalización

### Agregar Nuevos Servicios
1. Actualizar `service-config.ts`:
```typescript
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'new-category',
    name: 'Nuevo Servicio',
    icon: <Icon className="w-6 h-6" />,
    basePrice: 1000,
    options: [...]
  }
];
```

### Modificar Cálculos
2. Actualizar `quote-calculator.ts`:
```typescript
private getDiscountRate(clientType: ClientType): number {
  // Lógica personalizada de descuentos
}
```

## 🔒 Tipos TypeScript

Todos los tipos están definidos en `types/calculator/service-calculator.types.ts`:
- `ServiceCategory` - Categoría de servicio
- `ServiceOption` - Opción específica de servicio
- `QuoteCalculation` - Resultado del cálculo
- `QuoteRequest` - Solicitud de cotización
- `QuoteResponse` - Respuesta de la API

## 🚦 Estado y Gestión

### Hook personalizado useQuotes
```typescript
const { createQuote, getQuotes, loading, error } = useQuotes();

// Crear cotización
const newQuote = await createQuote(quoteRequest);

// Obtener cotizaciones
await getQuotes({ page: 1, limit: 10 });
```

## 📱 Responsive Design

- Diseño mobile-first con Tailwind CSS
- Grid adaptativo para diferentes tamaños de pantalla
- Componentes accesibles con ARIA labels

## ⚡ Performance

- Cálculos optimizados con useMemo y useCallback
- Lazy loading de componentes
- Validación con Zod para seguridad de tipos
- Índices de base de datos para consultas rápidas

## 🔄 Estados de Cotización

- `draft` - Borrador inicial
- `sent` - Enviada al cliente
- `accepted` - Aceptada por el cliente
- `rejected` - Rechazada
- `expired` - Expirada (30 días)

## 🎯 Próximas Mejoras

- [ ] Integración con sistema de notificaciones
- [ ] Exportación a PDF de cotizaciones
- [ ] Panel de administración para gestionar cotizaciones
- [ ] Integración con CRM
- [ ] Sistema de templates personalizados
- [ ] Análisis y métricas de conversión
- [ ] Formulario de contacto integrado
- [ ] Comparación de paquetes de servicios
- [ ] Descuentos por volumen automáticos
- [ ] Integración con sistemas de facturación

## 📊 Ejemplo de Uso

```typescript
// Importar el cotizador
import { ServiceCalculator } from '@/components/Calculator';

// Usar en una página
export default function QuotePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ServiceCalculator />
    </main>
  );
}

// Crear cotización programáticamente
import { useQuotes } from '@/hooks/useQuotes';

function MyComponent() {
  const { createQuote, loading } = useQuotes();
  
  const handleCreateQuote = async () => {
    const quote = await createQuote({
      services: [
        { categoryId: 'development', optionId: 'landing', quantity: 1 }
      ],
      clientType: 'pyme',
      urgency: 'normal',
      clientInfo: {
        email: 'cliente@example.com',
        name: 'Juan Pérez'
      }
    });
    
    if (quote) {
      console.log('Cotización creada:', quote);
    }
  };
  
  return (
    <button onClick={handleCreateQuote} disabled={loading}>
      {loading ? 'Creando...' : 'Crear Cotización'}
    </button>
  );
}
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Migrar base de datos
npx prisma migrate dev

# Reset base de datos
npx prisma migrate reset

# Ver base de datos
npx prisma studio

# Generar cliente Prisma
npx prisma generate

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📝 Notas de Implementación

### Seguridad
- Validación de entrada con Zod en todos los endpoints
- Sanitización de datos antes de almacenar en BD
- Rate limiting recomendado para APIs en producción

### SEO
- Metadatos optimizados en la página del cotizador
- Structured data para servicios
- URLs amigables para diferentes categorías

### Accesibilidad
- Componentes con ARIA labels apropiados
- Navegación por teclado funcional
- Contraste de colores WCAG compliant
- Textos alternativos para iconos

### Testing (Recomendado)
```bash
# Instalar dependencias de testing
npm install -D @testing-library/react @testing-library/jest-dom jest

# Tests sugeridos
- Cálculos de precios
- Validación de formularios
- Integración de API
- Componentes React
```

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Add nueva funcionalidad'`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

Desarrollado con ❤️ usando Next.js, TypeScript y PostgreSQL.
