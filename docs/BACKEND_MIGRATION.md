# Migración de Backend Interno a API Externa

## Resumen de Cambios

Este proyecto ha sido migrado de usar un backend interno de Next.js a utilizar una API externa en `https://api.alanis.dev` basada en NestJS.

## ¿Qué se Eliminó?

### API Routes Internas
- Eliminada toda la carpeta `src/app/api/`
- Removidas las siguientes rutas:
  - `/api/quotes` - Gestión de cotizaciones
  - `/api/send-email` - Envío de emails
  - `/api/webhooks` - Webhooks de Stripe
  - `/api/auth` - Autenticación

### Base de Datos y ORM
- Eliminada toda la carpeta `prisma/`
- Removido `src/lib/prisma.ts`
- Eliminadas las migraciones de base de datos

### Dependencias Removidas
- `@prisma/client` - Cliente de Prisma
- `prisma` - ORM
- `@sendgrid/mail` - Cliente de SendGrid
- `stripe` (server-side) - Procesamiento de pagos del servidor
- `bcryptjs` - Hash de contraseñas

### Archivos de Backend
- `src/lib/stripe.ts` - Configuración de Stripe del servidor
- `src/lib/invoice-ninja/` - Integración con Invoice Ninja

## ¿Qué se Actualizó?

### Cliente de API
- **Archivo**: `src/lib/api/client.ts`
- **Cambios**: Configurado para apuntar a `https://api.alanis.dev`
- **Funcionalidad**: 
  - Manejo de autenticación con tokens
  - Interceptores para errores y respuestas
  - Métodos para quotes, emails, y contacto

### Hooks de React Query
- **Archivo**: `src/hooks/useQuotes.ts`
- **Cambios**: Adaptado para usar la nueva API externa
- **Funcionalidad**: Mantiene la misma interfaz pero hace llamadas a la API externa

### Server Actions
- **Archivo**: `src/app/actions/email.ts`
- **Cambios**: Usa el cliente de API en lugar de SendGrid directamente

- **Archivo**: `src/app/actions/stripe.ts`
- **Cambios**: Comentado temporalmente, necesita integración con la nueva API

### Componentes Actualizados
- `src/components/Plans/index.tsx` - Removidas dependencias de Stripe server-side
- `src/components/Checkout/PrintObject.tsx` - Tipos genéricos en lugar de Stripe
- `src/components/Examples/ApiUsageExample.tsx` - Adaptado a nuevos tipos de API

## Nueva Arquitectura

```
Frontend (Next.js)
      ↓
API Externa (api.alanis.dev)
      ↓
Base de Datos (PostgreSQL)
```

## Próximos Pasos

### 1. Configurar Variables de Entorno
```env
# Remover estas variables (ya no se usan)
# DATABASE_URL=
# STRIPE_SECRET_KEY=
# SENDGRID_API_KEY=

# Agregar si es necesario
# API_BASE_URL=https://api.alanis.dev
# API_AUTH_TOKEN=
```

### 2. Implementar Autenticación
- Configurar tokens de autenticación para la API externa
- Implementar login/logout que funcione con la nueva API

### 3. Integrar Pagos
- Conectar el flujo de pagos con la nueva API
- Actualizar `src/app/actions/stripe.ts` para usar la API externa

### 4. Testing
- Probar todas las funcionalidades con la nueva API
- Verificar que el formulario de contacto funcione
- Probar el calculador de cotizaciones

## URLs de la Nueva API

Base URL: `https://api.alanis.dev`

### Endpoints Principales:
- `GET /quotes` - Listar cotizaciones
- `POST /quotes` - Crear cotización
- `POST /contact` - Enviar formulario de contacto
- `POST /emails/send` - Enviar email
- `GET /health` - Health check

## Beneficios de la Migración

1. **Separación de Responsabilidades**: Frontend enfocado en UI/UX
2. **Escalabilidad**: Backend independiente puede escalar por separado
3. **Mantenimiento**: Easier maintenance con tecnologías especializadas
4. **Reutilización**: La API puede ser usada por otras aplicaciones
5. **Performance**: Backend optimizado con NestJS

## Notas Importantes

- El build ahora funciona correctamente sin errores
- Todas las dependencias de backend han sido removidas
- Los hooks mantienen la misma interfaz para compatibilidad
- Los tipos han sido simplificados temporalmente para asegurar que compile

## Estado Actual

✅ **Compilación exitosa**
✅ **Dependencias limpiadas**
✅ **Cliente de API configurado**
⚠️ **Pendiente**: Conectar con la API real
⚠️ **Pendiente**: Implementar autenticación
⚠️ **Pendiente**: Integrar pagos 