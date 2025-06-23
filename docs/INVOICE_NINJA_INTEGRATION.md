# Integración con Invoice Ninja

Esta documentación explica cómo sincronizar los valores de la calculadora de cotizaciones con Invoice Ninja.

## 📋 Resumen de la Integración

La integración permite:
- **Sincronizar productos**: Todos los servicios de la calculadora se crean como productos en Invoice Ninja
- **Enviar cotizaciones**: Las cotizaciones generadas se envían automáticamente a Invoice Ninja
- **Gestión de clientes**: Los clientes se crean automáticamente si no existen
- **Precios dinámicos**: Los precios se ajustan según tipo de cliente y urgencia

## 🔧 Configuración Requerida

### 1. Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```bash
# Invoice Ninja Integration
INVOICE_NINJA_API_TOKEN=tu_token_aqui
INVOICE_NINJA_BASE_URL=https://app.invoiceninja.com

# Para instalación propia (self-hosted):
# INVOICE_NINJA_BASE_URL=https://tu-dominio.com

# Para hosted v5:
# INVOICE_NINJA_BASE_URL=https://invoicing.co
```

### 2. Obtener API Token

#### Para Invoice Ninja hosted (app.invoiceninja.com):
1. Inicia sesión en tu cuenta de Invoice Ninja
2. Ve a **Settings** → **Tokens**
3. Crea un nuevo token con permisos para:
   - Products (crear, leer, actualizar)
   - Clients (crear, leer)
   - Quotes (crear, enviar)
4. Copia el token y agrégalo a tu `.env`

#### Para instalación propia:
1. Accede a tu instalación de Invoice Ninja
2. Ve a **Settings** → **API Tokens**
3. Genera un nuevo token con los permisos necesarios

## 🏗️ Arquitectura

```
Calculadora Web
    ↓
[Servicio de Sincronización]
    ↓
Invoice Ninja API
```

### Componentes principales:

1. **ProductSyncService**: Sincroniza servicios de la calculadora con productos de Invoice Ninja
2. **API Routes**: Endpoints para enviar cotizaciones y sincronizar productos
3. **Quote Service**: Convierte cotizaciones de la calculadora al formato de Invoice Ninja

## 📊 Mapeo de Datos

### Servicios → Productos

Cada servicio de la calculadora se mapea a un producto en Invoice Ninja:

| Calculadora | Invoice Ninja |
|-------------|---------------|
| `categoryId-optionId` | `product_key` |
| `description` | `notes` |
| `basePrice * multiplier` | `price` |
| `basePrice * multiplier * 0.7` | `cost` |
| `category.name` | `custom_value1` |
| `option.complexity` | `custom_value2` |
| `option.estimatedHours` | `custom_value3` |
| `option.technologies` | `custom_value4` |

### Ejemplos de product_key generados:

- `CALC_DEVELOPMENT_LANDING` (Landing Page)
- `CALC_DEVELOPMENT_ECOMMERCE` (E-commerce)
- `CALC_DESIGN_MOCKUPS` (Mockups HD)
- `CALC_MARKETING_SEO` (SEO Técnico)

## 🚀 Uso

### 1. Sincronizar Productos (Primera vez)

```bash
PUT /api/quotes/invoice-ninja
```

Esto creará todos los productos de la calculadora en Invoice Ninja.

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "synced": 12,
    "errors": []
  }
}
```

### 2. Enviar Cotización

```bash
POST /api/quotes/invoice-ninja
```

**Payload:**
```json
{
  "quote": {
    "subtotal": 15000,
    "discounts": 2250,
    "taxes": 2040,
    "total": 14790,
    "estimatedDelivery": 8,
    "totalHours": 200,
    "urgencyMultiplier": 1.5,
    "discountRate": 0.15
  },
  "clientInfo": {
    "name": "Juan Pérez",
    "email": "juan@empresa.com",
    "company": "Mi Empresa",
    "phone": "+52 55 1234 5678"
  },
  "services": [
    {
      "categoryId": "development",
      "optionId": "ecommerce",
      "quantity": 1
    },
    {
      "categoryId": "design",
      "optionId": "mockups",
      "quantity": 1
    }
  ],
  "clientType": "startup",
  "urgency": "express",
  "projectDetails": {
    "description": "Tienda online para productos artesanales",
    "deadline": "2024-03-15T00:00:00.000Z",
    "requirements": [
      "Integración con Stripe",
      "Panel de administración",
      "Responsive design"
    ]
  }
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "quoteId": "abc123",
    "clientId": "def456",
    "message": "Cotización enviada exitosamente a Invoice Ninja"
  }
}
```

## 📈 Ajustes de Precios

### Tipo de Cliente
- **Startup**: -15% descuento
- **PYME**: Sin descuento
- **Enterprise**: +10% premium

### Urgencia
- **Normal**: Sin recargo
- **Express**: +50%
- **Urgent**: +100%

## 📝 Estructura de Cotización en Invoice Ninja

### Campos personalizados:
- `custom_value1`: Tipo de cliente (startup/pyme/enterprise)
- `custom_value2`: Nivel de urgencia (normal/express/urgent)
- `custom_value3`: Horas totales estimadas
- `custom_value4`: Semanas de entrega estimadas

### Notas públicas:
```
COTIZACIÓN DE SERVICIOS DE DESARROLLO

Servicios solicitados:
• development - ecommerce (1)
• design - mockups (1)

Tiempo estimado de entrega: 8 semanas
Horas totales estimadas: 200 horas

Descripción del proyecto:
Tienda online para productos artesanales

Requerimientos especiales:
• Integración con Stripe
• Panel de administración
• Responsive design
```

### Términos y condiciones automáticos:
- Cotización válida por 30 días
- Precios en MXN con IVA incluido
- Anticipo del 50% requerido
- Cambios en alcance pueden afectar precio/tiempo

## 🔄 Flujo de Trabajo Recomendado

1. **Configuración inicial**:
   - Configurar variables de entorno
   - Sincronizar productos una vez

2. **Uso diario**:
   - Cliente llena la calculadora
   - Se genera cotización local
   - Cliente confirma y proporciona datos
   - Se envía automáticamente a Invoice Ninja
   - Invoice Ninja envía la cotización por email

3. **Seguimiento**:
   - Cliente recibe cotización profesional
   - Puede aceptar directamente desde Invoice Ninja
   - Se convierte automáticamente en invoice

## ⚡ Ventajas

### Para el negocio:
- **Automatización completa**: Sin entrada manual de datos
- **Consistencia**: Precios y términos uniformes
- **Profesionalismo**: Cotizaciones con branding completo
- **Seguimiento**: Historial completo en Invoice Ninja
- **Conversión**: Fácil conversión de cotización a factura

### Para el cliente:
- **Rapidez**: Cotización inmediata
- **Transparencia**: Desglose detallado de servicios
- **Conveniencia**: Recibe por email automáticamente
- **Aceptación fácil**: Un clic para aceptar

## 🛠️ Mantenimiento

### Actualizar precios:
1. Modifica `service-config.ts`
2. Ejecuta sincronización de productos
3. Los nuevos precios se aplicarán automáticamente

### Agregar nuevos servicios:
1. Agrega a `serviceCategories` en `service-config.ts`
2. Ejecuta sincronización
3. El nuevo servicio estará disponible

## 📚 API Reference

### GET /api/quotes/invoice-ninja (Status)
Verifica el estado de la integración.

### PUT /api/quotes/invoice-ninja (Sync)
Sincroniza todos los productos de la calculadora.

### POST /api/quotes/invoice-ninja (Send Quote)
Envía una cotización específica a Invoice Ninja.

## 🚨 Consideraciones de Seguridad

- ✅ API Token almacenado en variables de entorno
- ✅ Validación de datos con Zod
- ✅ Manejo de errores robusto
- ✅ Headers de seguridad requeridos
- ✅ No exposición de datos sensibles en logs

## 🔧 Troubleshooting

### Error: "Invoice Ninja no está configurado"
- Verifica que `INVOICE_NINJA_API_TOKEN` esté en `.env`
- Reinicia el servidor después de agregar variables

### Error: "API Error 401"
- Verifica que el token sea válido
- Confirma que el token tenga los permisos necesarios

### Error: "Product not found"
- Ejecuta sincronización de productos primero
- Verifica que los servicios existan en `service-config.ts`

### Error: "Client creation failed"
- Verifica formato de email
- Confirma que los datos del cliente sean válidos

## 📞 Soporte

Para problemas con la integración:
1. Revisa los logs del servidor
2. Verifica la configuración de Invoice Ninja
3. Consulta la documentación oficial: https://invoiceninja.github.io/ 