# API Client System Guide

## Resumen

Se ha implementado un nuevo sistema de cliente de API que utiliza **Axios** y **React Query** para mejorar el manejo de datos, cacheo automático, manejo de errores y optimización de rendimiento.

## Características Principales

### ✅ Beneficios del Nuevo Sistema

- **Cacheo Automático**: React Query maneja el cache automáticamente
- **Sincronización en Tiempo Real**: Los datos se mantienen sincronizados entre componentes
- **Manejo de Errores Mejorado**: Interceptores y tipos TypeScript consistentes
- **Mejor UX**: Estados de carga, reintentos automáticos, actualizaciones optimistas
- **Type Safety**: TypeScript completo en todas las capas
- **Invalidación Inteligente**: Cache se actualiza automáticamente después de mutaciones

### 🏗️ Arquitectura

```
src/
├── lib/api/
│   ├── client.ts          # Cliente Axios configurado
│   ├── types.ts           # Tipos TypeScript para API
│   └── index.ts           # Exportaciones
├── hooks/
│   ├── useApi.ts          # Hook principal para acceso al cliente
│   └── useQuotes.ts       # Hook específico con React Query
└── app/providers.tsx      # Configuración de QueryClient
```

## Guía de Uso

### 1. Configuración Básica

El sistema ya está configurado en `providers.tsx`. React Query está disponible en toda la aplicación.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Ya configurado automáticamente
```

### 2. Usando Hooks Específicos (Recomendado)

```tsx
import { useQuotes } from '@/hooks/useQuotes';

const MyComponent = () => {
  const {
    quotes,           // Datos cacheados automáticamente
    loading,          // Estado de carga
    creating,         // Estado de creación
    error,            // Errores automáticos
    createQuote,      // Mutación para crear
    refetch          // Refrescar manualmente
  } = useQuotes({ page: 1, limit: 10 });

  const handleCreate = async () => {
    try {
      const newQuote = await createQuote(quoteData);
      // ✅ Cache se actualiza automáticamente
      // ✅ Todos los componentes se sincronizan
    } catch (error) {
      // ✅ Error handling automático
    }
  };

  return (
    <div>
      {loading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}
      {quotes.map(quote => (
        <div key={quote.id}>{quote.name}</div>
      ))}
    </div>
  );
};
```

### 3. Usando Cliente Directo (Para casos avanzados)

```tsx
import { useApi } from '@/hooks/useApi';

const MyComponent = () => {
  const { client } = useApi();

  const handleCustomCall = async () => {
    try {
      // Calls directs al API
      const response = await client.get('/quotes');
      const newQuote = await client.post('/quotes', data);
      
      // ✅ Interceptores automáticos
      // ✅ Manejo de errores consistente
      // ✅ Auth headers automáticos
    } catch (error) {
      console.error('API Error:', error);
    }
  };
};
```

## Migración desde el Sistema Anterior

### Antes (useQuotes legacy)

```tsx
// ❌ Sistema anterior
const { loading, error, quotes, createQuote, getQuotes } = useQuotes();

useEffect(() => {
  getQuotes(); // Manual fetching
}, []);

const handleCreate = async () => {
  const result = await createQuote(data);
  if (result) {
    // Manual refetch needed
    await getQuotes();
  }
};
```

### Después (Nuevo sistema)

```tsx
// ✅ Nuevo sistema
const { quotes, loading, error, createQuote } = useQuotes();
// ✅ Data fetching automático
// ✅ No useEffect necesario

const handleCreate = async () => {
  await createQuote(data);
  // ✅ Cache se actualiza automáticamente
  // ✅ No refetch manual necesario
};
```

### Compatibilidad con el Sistema Anterior

Para facilitar la migración, se mantiene `useQuotesLegacy()` con la interfaz anterior:

```tsx
import { useQuotesLegacy } from '@/hooks/useQuotes';

// Mantiene la interfaz anterior pero con mejoras internas
const { loading, error, quotes, createQuote } = useQuotesLegacy();
```

## Tipos de API

### Respuesta Estándar

```tsx
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
}
```

### Respuesta Paginada

```tsx
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Errores

```tsx
interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: any;
}
```

## Endpoints Disponibles

### Quotes
- `GET /api/quotes` - Listar cotizaciones (con paginación)
- `POST /api/quotes` - Crear cotización
- `POST /api/quotes/invoice-ninja` - Sincronizar con Invoice Ninja

### Email
- `POST /api/send-email` - Enviar email
- `GET /api/send-email` - Health check

## Configuración Avanzada

### Interceptores Personalizados

El cliente ya incluye interceptores para:
- ✅ Autenticación automática (Bearer token)
- ✅ Manejo de errores consistente
- ✅ Timeouts configurables
- ✅ Retry automático

### Configuración de React Query

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutos
      retry: 3,                     // 3 reintentos
      refetchOnWindowFocus: false,  // No refetch en focus
    },
    mutations: {
      retry: 1,                     // 1 reintento para mutaciones
    },
  },
});
```

## Mejores Prácticas

### 1. Usar Hooks Específicos
```tsx
// ✅ Recomendado
const { quotes, createQuote } = useQuotes();

// ❌ Evitar fetch manual
useEffect(() => {
  fetch('/api/quotes').then(...)
}, []);
```

### 2. Manejo de Errores

```tsx
const { error, createQuote } = useQuotes();

// ✅ Error handling automático
if (error) {
  return <ErrorComponent message={error} />;
}

// ✅ Error handling en mutaciones
const handleCreate = async () => {
  try {
    await createQuote(data);
  } catch (error) {
    // Específico para esta operación
    console.error('Create failed:', error);
  }
};
```

### 3. Optimizaciones

```tsx
// ✅ Paginación eficiente
const [page, setPage] = useState(1);
const { quotes, pagination } = useQuotes({ page, limit: 10 });

// ✅ Invalidación específica
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['quotes'] });
```

## Ejemplo Completo

Ver `src/components/Examples/ApiUsageExample.tsx` para un ejemplo completo que demuestra:

- ✅ Manejo de cotizaciones con paginación
- ✅ Envío de emails
- ✅ Llamadas directas al API
- ✅ Manejo de errores
- ✅ Estados de carga

## Troubleshooting

### Error: "Cannot find module '@/lib/api/client'"
- Verificar que todos los archivos estén creados correctamente
- Revisar imports en tsconfig.json

### Queries no se actualizan automáticamente
- Verificar que QueryClient esté configurado en providers
- Usar `queryClient.invalidateQueries()` después de mutaciones

### Errores de TypeScript
- Verificar que todos los tipos estén importados
- Revisar que ApiResponse<T> esté siendo usado correctamente

## Roadmap

### Próximas Mejoras

- [ ] DevTools para React Query
- [ ] Offline support
- [ ] Optimistic updates
- [ ] Background sync
- [ ] Real-time subscriptions
- [ ] GraphQL integration (opcional)

---

## Conclusión

El nuevo sistema de API client proporciona:

1. **Mejor Rendimiento** - Cache automático y sincronización
2. **Mejor DX** - TypeScript completo y error handling
3. **Mejor UX** - Estados de carga y actualizaciones optimistas
4. **Mejor Mantenimiento** - Código más limpio y consistente

¡El sistema está listo para usar! 🚀 