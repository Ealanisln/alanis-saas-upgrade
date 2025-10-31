# Stripe Webhook Setup Guide

## ¿Qué es un Webhook?

Un webhook es una URL en tu servidor que Stripe llama automáticamente cuando ocurren eventos (pagos completados, reembolsos, etc.). Esto te permite:

1. ✅ Confirmar pagos de forma confiable
2. ✅ Enviar emails de confirmación
3. ✅ Guardar información en tu base de datos
4. ✅ Activar automatizaciones (crear proyectos, notificaciones, etc.)

---

## Configuración en Desarrollo (Local)

### 1. Instalar Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Verificar instalación
stripe --version
```

### 2. Autenticar con Stripe

```bash
stripe login
```

Se abrirá tu navegador para autorizar el acceso.

### 3. Escuchar Webhooks Localmente

```bash
# En una terminal separada, ejecuta:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Este comando te dará un **webhook secret** que empieza con `whsec_...`

### 4. Copiar el Webhook Secret

Agrega el secret a tu `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Probar el Webhook

En otra terminal:

```bash
# Disparar un evento de prueba
stripe trigger checkout.session.completed
```

Deberías ver los logs en:
- Terminal donde corre `stripe listen` - eventos recibidos
- Terminal donde corre `npm run dev` - tu servidor procesando

---

## Configuración en Producción

### 1. Ir a Stripe Dashboard

Ve a: [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)

### 2. Crear un Nuevo Endpoint

Click en **"Add endpoint"**

- **Endpoint URL**: `https://tudominio.com/api/webhooks/stripe`
- **Descripción**: Production webhook for payments

### 3. Seleccionar Eventos

Selecciona los eventos que quieres recibir:

**Recomendados:**
- ✅ `checkout.session.completed` - Cuando se completa un pago
- ✅ `payment_intent.succeeded` - Cuando el pago es exitoso
- ✅ `payment_intent.payment_failed` - Cuando falla un pago
- ✅ `charge.refunded` - Cuando se hace un reembolso

**Opcionales (para futuro):**
- `customer.subscription.created` - Si agregas subscripciones
- `customer.subscription.deleted` - Cancelaciones
- `invoice.paid` - Facturas pagadas

### 4. Copiar el Signing Secret

Después de crear el webhook, Stripe te mostrará el **Signing secret**.

Copialo a tus variables de entorno en producción (Vercel, Railway, etc.):

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Verificar que Funciona

En Stripe Dashboard → Webhooks → tu endpoint:
- Puedes enviar eventos de prueba
- Ver logs de solicitudes
- Ver respuestas de tu servidor

---

## Testing del Webhook

### Probar Localmente

1. Terminal 1: `npm run dev`
2. Terminal 2: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Terminal 3: `stripe trigger checkout.session.completed`

### Verificar Logs

Deberías ver en tu terminal de Next.js:

```
✅ Checkout session completed: cs_test_...
💰 Payment received: $500 USD
📧 Customer: John Doe (john@example.com)
📦 Service: Starter
📧 Sending confirmation email to: john@example.com
🔔 Sending internal notification
```

---

## Eventos Manejados

Tu webhook actualmente maneja:

| Evento | Acción |
|--------|--------|
| `checkout.session.completed` | ✅ Envía email al cliente<br>✅ Notifica a tu equipo<br>⏳ TODO: Guardar en DB |
| `payment_intent.succeeded` | ✅ Log del pago exitoso<br>⏳ TODO: Actualizar status |
| `payment_intent.payment_failed` | ✅ Log del error<br>⏳ TODO: Notificar fallo |
| `charge.refunded` | ✅ Log del reembolso<br>⏳ TODO: Actualizar orden |

---

## Siguientes Pasos (TODO)

### 1. Implementar Email Real

Actualmente los emails solo se loguean. Necesitas integrar un servicio:

**Opción A: Resend (Recomendado)**
```bash
pnpm add resend
```

**Opción B: SendGrid**
```bash
pnpm add @sendgrid/mail
```

**Opción C: Nodemailer**
```bash
pnpm add nodemailer
```

### 2. Base de Datos

Guardar los pagos en tu BD:

```typescript
// Ejemplo con Prisma
await prisma.payment.create({
  data: {
    stripeSessionId: session.id,
    customerEmail: customerEmail,
    serviceName: serviceName,
    amount: amount,
    status: 'completed',
  }
});
```

### 3. Automatizaciones

- Crear tarjeta en Notion/Linear/Asana
- Enviar mensaje a Slack
- Agregar cliente a CRM
- Generar factura en Invoice Ninja

---

## Solución de Problemas

### Webhook no recibe eventos

1. **Verificar URL**: Debe ser exactamente `https://tudominio.com/api/webhooks/stripe`
2. **Verificar HTTPS**: Stripe solo envía a URLs con SSL
3. **Verificar secret**: El `STRIPE_WEBHOOK_SECRET` debe coincidir

### Error de firma inválida

```
Webhook signature verification failed
```

**Solución:**
- Verificar que `STRIPE_WEBHOOK_SECRET` esté correcto
- En desarrollo: usar el secret de `stripe listen`
- En producción: usar el secret del dashboard

### Eventos se reciben pero no se procesan

**Revisar logs:**
- Stripe Dashboard → Webhooks → Ver logs
- Tu servidor: logs de Next.js
- Network: verificar que devuelve 200 OK

---

## Recursos

- [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
- [Webhook Events Reference](https://stripe.com/docs/api/events/types)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)

---

## Checklist de Configuración

**Desarrollo:**
- [ ] Stripe CLI instalado
- [ ] `stripe login` ejecutado
- [ ] `stripe listen` corriendo
- [ ] `STRIPE_WEBHOOK_SECRET` en `.env.local`
- [ ] Webhook responde con 200 OK

**Producción:**
- [ ] Endpoint creado en Stripe Dashboard
- [ ] URL de producción configurada
- [ ] Eventos seleccionados
- [ ] `STRIPE_WEBHOOK_SECRET` en variables de entorno
- [ ] Webhook probado desde dashboard
- [ ] Emails funcionando (cuando se implemente)

---

¡Listo! Tu webhook debería estar funcionando correctamente. 🎉
