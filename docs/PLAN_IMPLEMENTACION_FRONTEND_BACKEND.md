# 🚀 Plan de Implementación Frontend-Backend Integration

## 📋 **Resumen del Estado Actual**

### ✅ **Backend - Ya Implementado**
- ✅ Sistema de autenticación completo (JWT + Multi-tenant)
- ✅ CRUD de clientes y proyectos
- ✅ Control de tiempo y actividades
- ✅ Integraciones con Invoice Ninja y n8n
- ✅ Base de datos robusta con Prisma
- ✅ Sistema de eventos

### ✅ **Frontend - Migrado**
- ✅ Eliminado backend interno (Prisma, SendGrid, API routes)
- ✅ Configurado cliente API para conectar con `api.alanis.dev`
- ✅ Hooks actualizados para usar API externa
- ✅ Tipos simplificados para compilación exitosa

### ❌ **Por Implementar**
- ❌ Módulo de Quotes/Cotizaciones en backend
- ❌ Endpoints de Contact/Email en backend  
- ❌ Integración con Stripe en backend
- ❌ Autenticación del frontend con backend
- ❌ Endpoints públicos para cotizador web

---

## 🎯 **Fase 1: Completar Módulo de Quotes (Backend)**

### 1.1 ✅ Modelo y DTOs Implementados
- ✅ Modelo `Quote` agregado a Prisma schema
- ✅ DTOs creados: `CreateQuoteDto`, `UpdateQuoteDto`, `QuoteQueryDto`
- ✅ Enum `QuoteStatus` definido
- ✅ Servicio `QuotesService` con operaciones CRUD
- ✅ Controlador `QuotesController` con endpoints públicos y privados
- ✅ Módulo `QuotesModule` configurado

### 1.2 🔄 Pendiente: Migración de Base de Datos
```bash
cd /Users/ealanis/Development/current-projects/alanis-backend
npm run db:migrate
npm run db:generate
```

### 1.3 🔄 Pendiente: Configurar Variables de Entorno
Agregar a `.env`:
```bash
# Default tenant para quotes públicas
DEFAULT_TENANT_ID="clm123456789" # ID del tenant Alanis Web Dev
```

### 1.4 ✅ Endpoints Implementados
- ✅ `POST /quotes` - Crear cotización (público)
- ✅ `POST /quotes/admin` - Crear cotización (admin)
- ✅ `GET /quotes` - Listar cotizaciones (admin)
- ✅ `GET /quotes/stats` - Estadísticas (admin)
- ✅ `GET /quotes/public/:quoteNumber` - Ver cotización pública
- ✅ `GET /quotes/:id` - Ver cotización (admin)
- ✅ `PATCH /quotes/:id` - Actualizar cotización
- ✅ `DELETE /quotes/:id` - Eliminar cotización
- ✅ `PATCH /quotes/:id/approve` - Aprobar cotización
- ✅ `PATCH /quotes/:id/reject` - Rechazar cotización
- ✅ `POST /quotes/:id/convert-to-project` - Convertir a proyecto

---

## 🎯 **Fase 2: Implementar Módulo de Contact/Email (Backend)**

### 2.1 Crear Modelo ContactForm
```prisma
model ContactForm {
  id          String      @id @default(cuid())
  name        String
  email       String
  message     String
  phone       String?
  company     String?
  subject     String?
  
  // Metadata
  userAgent   String?
  ipAddress   String?
  source      String?     // 'website', 'admin', etc.
  
  // Estado
  status      ContactFormStatus @default(PENDING)
  response    String?     // Respuesta del admin
  respondedAt DateTime?
  respondedBy String?     // ID del usuario que respondió
  
  tenantId    String
  tenant      Tenant      @relation(fields: [tenantId], references: [id])
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@map("contact_forms")
}

enum ContactFormStatus {
  PENDING
  RESPONDED
  SPAM
  ARCHIVED
}
```

### 2.2 Crear DTOs y Servicio
- `CreateContactFormDto`
- `UpdateContactFormDto` 
- `ContactFormQueryDto`
- `ContactFormsService`
- `ContactFormsController`

### 2.3 Endpoints a Implementar
- `POST /contact` - Enviar formulario (público)
- `GET /contact` - Listar mensajes (admin)
- `PATCH /contact/:id` - Marcar como respondido
- `DELETE /contact/:id` - Eliminar mensaje

### 2.4 Integración con Email
- Usar servicio de email (SendGrid, AWS SES, etc.)
- Notificaciones automáticas al recibir contacto
- Templates de respuesta automática

---

## 🎯 **Fase 3: Implementar Integración con Stripe (Backend)**

### 3.1 Configurar Stripe
```bash
npm install stripe
npm install --save-dev @types/stripe
```

### 3.2 Crear Módulo de Payments
- `PaymentsService` - Lógica de pagos con Stripe
- `PaymentsController` - Endpoints de pago
- `WebhooksController` - Webhooks de Stripe

### 3.3 Modelo de Payments
```prisma
model Payment {
  id                String        @id @default(cuid())
  stripePaymentId   String        @unique
  amount            Decimal       @db.Decimal(10, 2)
  currency          String        @default("mxn")
  status            PaymentStatus @default(PENDING)
  
  // Relacionar con cotización o proyecto
  quoteId           String?
  quote             Quote?        @relation(fields: [quoteId], references: [id])
  
  projectId         String?
  project           Project?      @relation(fields: [projectId], references: [id])
  
  tenantId          String
  tenant            Tenant        @relation(fields: [tenantId], references: [id])
  
  metadata          Json?
  
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  @@map("payments")
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  CANCELED
  REFUNDED
}
```

### 3.4 Endpoints de Stripe
- `POST /payments/create-payment-intent` - Crear intent de pago
- `POST /payments/confirm/:id` - Confirmar pago
- `POST /webhooks/stripe` - Webhook de eventos Stripe
- `GET /payments` - Listar pagos (admin)

---

## 🎯 **Fase 4: Configurar Autenticación Frontend-Backend**

### 4.1 Actualizar Cliente API (Frontend)
```typescript
// src/lib/api/auth-client.ts
export class AuthApiClient {
  async login(credentials: LoginCredentials): Promise<AuthResponse>
  async register(userData: RegisterData): Promise<AuthResponse>
  async refreshToken(): Promise<TokenResponse>
  async logout(): Promise<void>
  async getProfile(): Promise<UserProfile>
}
```

### 4.2 Implementar Context de Autenticación
```typescript
// src/contexts/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  // Estado de autenticación
  // Funciones de login/logout
  // Renovación automática de tokens
  // Redirección automática
}
```

### 4.3 Crear Hooks de Autenticación
```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  // Hook para manejar autenticación
}

// src/hooks/useRequireAuth.ts  
export const useRequireAuth = () => {
  // Hook para proteger rutas
}
```

### 4.4 Proteger Rutas
- Crear HOC `withAuth` para componentes protegidos
- Middleware para rutas del dashboard
- Redirección automática en rutas protegidas

---

## 🎯 **Fase 5: Adaptar Frontend a Nuevos Endpoints**

### 5.1 Actualizar Cliente API
```typescript
// src/lib/api/client.ts
export class ApiClient {
  // Quotes
  async createQuote(data: QuoteRequest): Promise<QuoteResponse>
  async getQuotes(params?: QuoteQueryParams): Promise<QuotesListResponse>
  async getQuoteByNumber(quoteNumber: string): Promise<QuoteResponse>
  
  // Contact
  async sendContactForm(data: ContactFormData): Promise<ContactResponse>
  
  // Payments
  async createPaymentIntent(data: PaymentData): Promise<PaymentIntentResponse>
  
  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse>
}
```

### 5.2 Actualizar Hooks Existentes
- ✅ `useQuotes` - Actualizar para usar nuevos endpoints
- 🔄 `useAuth` - Implementar autenticación completa
- 🔄 `useContact` - Crear hook para formulario de contacto
- 🔄 `usePayments` - Crear hook para pagos

### 5.3 Actualizar Componentes
- ✅ Calculator components - Ya configurados para API externa
- 🔄 Contact form - Conectar con nuevo endpoint
- 🔄 Plans/Pricing - Integrar con Stripe
- 🔄 Dashboard - Implementar cuando se agregue autenticación

---

## 🎯 **Fase 6: Testing y Deployment**

### 6.1 Testing Backend
```bash
# Tests unitarios
npm run test

# Tests e2e  
npm run test:e2e

# Test de API con Postman/Insomnia
```

### 6.2 Testing Frontend
```bash
# Compilación
npm run build

# Tests de integración con backend
npm run test:integration
```

### 6.3 Deployment
```bash
# Backend
cd /Users/ealanis/Development/current-projects/alanis-backend
npm run deploy:prod

# Frontend  
cd /Users/ealanis/Development/current-projects/alanis-saas-upgrade
npm run build
```

---

## 📋 **Checklist de Implementación**

### Fase 1: Quotes Module ✅
- [x] Modelo Quote en Prisma
- [x] DTOs para quotes
- [x] QuotesService implementado
- [x] QuotesController implementado
- [x] QuotesModule configurado
- [ ] Migración ejecutada
- [ ] Tests implementados

### Fase 2: Contact Module ⏳
- [ ] Modelo ContactForm
- [ ] DTOs para contact
- [ ] ContactService
- [ ] ContactController
- [ ] Integración con email
- [ ] Tests

### Fase 3: Payments Module ⏳
- [ ] Configuración Stripe
- [ ] Modelo Payment
- [ ] PaymentsService
- [ ] PaymentsController  
- [ ] Webhooks Stripe
- [ ] Tests

### Fase 4: Auth Integration ⏳
- [ ] AuthContext en frontend
- [ ] Hooks de autenticación
- [ ] Protección de rutas
- [ ] Almacenamiento de tokens
- [ ] Renovación automática

### Fase 5: Frontend Updates ⏳
- [ ] Cliente API actualizado
- [ ] Hooks actualizados
- [ ] Componentes conectados
- [ ] Formularios integrados
- [ ] Dashboard implementado

### Fase 6: Testing & Deploy ⏳
- [ ] Tests backend
- [ ] Tests frontend
- [ ] Tests de integración
- [ ] Deployment backend
- [ ] Deployment frontend

---

## 🚀 **Comandos de Ejecución**

### Backend Development
```bash
cd /Users/ealanis/Development/current-projects/alanis-backend

# Instalar dependencias
npm install

# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Seed database
npm run db:seed

# Iniciar desarrollo
npm run start:dev

# Ver Swagger docs
# http://localhost:3000/api/docs
```

### Frontend Development  
```bash
cd /Users/ealanis/Development/current-projects/alanis-saas-upgrade

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Build production
npm run build
```

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
DEFAULT_TENANT_ID="..." 
STRIPE_SECRET_KEY="..."
SENDGRID_API_KEY="..."

# Frontend (.env.local)
NEXT_PUBLIC_API_URL="https://api.alanis.dev"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
```

---

## 📞 **Próximos Pasos Inmediatos**

1. **Ejecutar migración** para generar modelo Quote
2. **Configurar variables de entorno** en backend
3. **Implementar módulo Contact/Email**
4. **Configurar Stripe** para pagos
5. **Integrar autenticación** en frontend
6. **Testing completo** de la integración

¿Te gustaría que comience con alguna fase específica o necesitas ajustes en el plan? 