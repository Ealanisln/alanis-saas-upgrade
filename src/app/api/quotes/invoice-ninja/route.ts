import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { InvoiceNinjaClient as InvoiceNinjaService, createInvoiceNinjaClient } from '@/lib/invoice-ninja/client';
import { InvoiceNinjaClientData } from '@/lib/invoice-ninja/types';
import { ProductSyncService } from '@/lib/invoice-ninja/sync-products';
import { 
  QuoteCalculation, 
  ClientType as CalculatorClientType, 
  UrgencyLevel 
} from '@/types/calculator/service-calculator.types';

// Esquema de validación para el envío a Invoice Ninja
const SendToInvoiceNinjaSchema = z.object({
  quote: z.object({
    subtotal: z.number(),
    discounts: z.number(),
    taxes: z.number(),
    total: z.number(),
    estimatedDelivery: z.number(),
    totalHours: z.number(),
    urgencyMultiplier: z.number(),
    discountRate: z.number()
  }),
  clientInfo: z.object({
    name: z.string().optional(),
    email: z.string().email(),
    company: z.string().optional(),
    phone: z.string().optional()
  }),
  services: z.array(z.object({
    categoryId: z.string(),
    optionId: z.string(),
    quantity: z.number().min(1)
  })),
  clientType: z.enum(['startup', 'pyme', 'enterprise']),
  urgency: z.enum(['normal', 'express', 'urgent']),
  projectDetails: z.object({
    description: z.string().optional(),
    deadline: z.string().datetime().optional(),
    requirements: z.array(z.string()).optional()
  }).optional()
});

// POST /api/quotes/invoice-ninja - Enviar cotización a Invoice Ninja
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SendToInvoiceNinjaSchema.parse(body);

    // Verificar que las variables de entorno estén configuradas
    const apiToken = process.env.INVOICE_NINJA_API_TOKEN;
    const baseUrl = process.env.INVOICE_NINJA_BASE_URL || 'https://app.invoiceninja.com';
    
    if (!apiToken) {
      return NextResponse.json({
        success: false,
        error: 'Invoice Ninja no está configurado. Configure INVOICE_NINJA_API_TOKEN en las variables de entorno.'
      }, { status: 500 });
    }

    // Crear cliente de Invoice Ninja
    const invoiceNinjaClient = createInvoiceNinjaClient({
      apiToken,
      baseUrl,
      version: '5'
    });

    // Enviar cotización
    const result = await sendQuoteToInvoiceNinja(invoiceNinjaClient, validatedData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          quoteId: result.quoteId,
          clientId: result.clientId,
          message: 'Cotización enviada exitosamente a Invoice Ninja'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Error desconocido al enviar la cotización'
      }, { status: 400 });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Datos inválidos',
        details: error.errors
      }, { status: 400 });
    }

    console.error('Error sending quote to Invoice Ninja:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST /api/quotes/invoice-ninja/sync - Sincronizar productos
export async function PUT(request: NextRequest) {
  try {
    const apiToken = process.env.INVOICE_NINJA_API_TOKEN;
    const baseUrl = process.env.INVOICE_NINJA_BASE_URL || 'https://app.invoiceninja.com';
    
    if (!apiToken) {
      return NextResponse.json({
        success: false,
        error: 'Invoice Ninja no está configurado'
      }, { status: 500 });
    }

    const invoiceNinjaClient = createInvoiceNinjaClient({
      apiToken,
      baseUrl,
      version: '5'
    });

    const productSyncService = new ProductSyncService(invoiceNinjaClient);
    const result = await productSyncService.syncAllProducts();

    return NextResponse.json({
      success: result.success,
      data: {
        synced: result.synced,
        errors: result.errors
      }
    });

  } catch (error) {
    console.error('Error syncing products:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// Función auxiliar para enviar cotización a Invoice Ninja
async function sendQuoteToInvoiceNinja(
  client: InvoiceNinjaService,
  data: z.infer<typeof SendToInvoiceNinjaSchema>
): Promise<{
  success: boolean;
  quoteId?: string;
  clientId?: string;
  error?: string;
}> {
  try {
    // 1. Buscar o crear el cliente
    const clientId = await ensureClientExists(client, data.clientInfo);

    // 2. Convertir servicios a items de Invoice Ninja
    const productSyncService = new ProductSyncService(client);
    const invoiceItems = await productSyncService.convertQuoteToInvoiceItems(data.services);

    // 3. Aplicar ajustes de la calculadora
    const adjustedItems = applyCalculatorAdjustments(
      invoiceItems,
      data.quote as QuoteCalculation,
      data.clientType,
      data.urgency
    );

    // 4. Crear la cotización
    const quoteData = {
      client_id: clientId,
      quote_date: new Date().toISOString().split('T')[0],
      due_date: data.projectDetails?.deadline ? 
        new Date(data.projectDetails.deadline).toISOString().split('T')[0] :
        calculateDueDate(data.quote.estimatedDelivery),
      invoice_items: adjustedItems,
      public_notes: generatePublicNotes(data),
      private_notes: generatePrivateNotes(data),
      terms: generateTerms(data),
      custom_value1: data.clientType,
      custom_value2: data.urgency,
      custom_value3: data.quote.totalHours.toString(),
      custom_value4: data.quote.estimatedDelivery.toString(),
      email_quote: true
    };

    const result = await client.createQuote(quoteData);

    return {
      success: true,
      quoteId: result.data.id,
      clientId: clientId
    };

  } catch (error) {
    console.error('Error in sendQuoteToInvoiceNinja:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Funciones auxiliares
async function ensureClientExists(
  client: InvoiceNinjaService,
  clientInfo: z.infer<typeof SendToInvoiceNinjaSchema>['clientInfo']
): Promise<string> {
  try {
    const existingClients = await client.findClientByEmail(clientInfo.email);
    
    if (existingClients.data.length > 0) {
      return existingClients.data[0].id!;
    }

    const newClient: Omit<InvoiceNinjaClientData, 'id'> = {
      name: clientInfo.company || clientInfo.name || 'Cliente',
      contact: {
        first_name: clientInfo.name?.split(' ')[0] || '',
        last_name: clientInfo.name?.split(' ').slice(1).join(' ') || '',
        email: clientInfo.email,
        phone: clientInfo.phone
      },
      website: clientInfo.company ? `https://${clientInfo.company.toLowerCase().replace(/\s+/g, '')}.com` : undefined,
      public_notes: 'Cliente creado automáticamente desde calculadora de cotizaciones'
    };

    const result = await client.createClient(newClient as any);
    return result.data.id!;

  } catch (error) {
    throw new Error(`Error managing client: ${error}`);
  }
}

function applyCalculatorAdjustments(
  items: any[],
  quote: QuoteCalculation,
  clientType: CalculatorClientType,
  urgency: UrgencyLevel
): any[] {
  const adjustedItems = [...items];

  if (quote.discounts > 0) {
    adjustedItems.push({
      product_key: 'DISCOUNT',
      notes: getDiscountDescription(clientType),
      cost: -quote.discounts,
      qty: 1
    });
  }

  if (urgency !== 'normal') {
    const urgencyCharge = calculateUrgencyCharge(quote.subtotal, urgency);
    if (urgencyCharge > 0) {
      adjustedItems.push({
        product_key: 'URGENCY',
        notes: getUrgencyDescription(urgency),
        cost: urgencyCharge,
        qty: 1
      });
    }
  }

  return adjustedItems;
}

function generatePublicNotes(data: z.infer<typeof SendToInvoiceNinjaSchema>): string {
  const servicesList = data.services.map(service => 
    `• ${service.categoryId} - ${service.optionId} (${service.quantity})`
  ).join('\n');

  return `COTIZACIÓN DE SERVICIOS DE DESARROLLO

Servicios solicitados:
${servicesList}

Tiempo estimado de entrega: ${data.quote.estimatedDelivery} semanas
Horas totales estimadas: ${data.quote.totalHours} horas

${data.projectDetails?.description ? 
  `Descripción del proyecto:\n${data.projectDetails.description}\n` : ''}

${data.projectDetails?.requirements ? 
  `Requerimientos especiales:\n${data.projectDetails.requirements.map(r => `• ${r}`).join('\n')}` : ''}`;
}

function generatePrivateNotes(data: z.infer<typeof SendToInvoiceNinjaSchema>): string {
  return `Cotización generada automáticamente desde calculadora web.

Tipo de cliente: ${data.clientType}
Nivel de urgencia: ${data.urgency}
Subtotal: $${data.quote.subtotal.toLocaleString()}
Descuentos: $${data.quote.discounts.toLocaleString()}
Impuestos: $${data.quote.taxes.toLocaleString()}
Total: $${data.quote.total.toLocaleString()}

Fecha de generación: ${new Date().toISOString()}`;
}

function generateTerms(data: z.infer<typeof SendToInvoiceNinjaSchema>): string {
  return `TÉRMINOS Y CONDICIONES

1. Esta cotización es válida por 30 días a partir de la fecha de emisión.
2. Los precios están en pesos mexicanos (MXN) e incluyen IVA.
3. El tiempo de entrega estimado es de ${data.quote.estimatedDelivery} semanas.
4. Se requiere un anticipo del 50% para iniciar el proyecto.
5. Los pagos restantes se realizarán según el cronograma acordado.
6. Cualquier cambio en el alcance del proyecto puede afectar el precio y tiempo de entrega.

Para cualquier consulta, no dude en contactarnos.`;
}

function calculateDueDate(estimatedWeeks: number): string {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (estimatedWeeks * 7));
  return dueDate.toISOString().split('T')[0];
}

function getDiscountDescription(clientType: CalculatorClientType): string {
  switch (clientType) {
    case 'startup':
      return 'Descuento especial para Startup (15%)';
    case 'enterprise':
      return 'Cargo adicional Enterprise (10%)';
    default:
      return 'Ajuste de precio';
  }
}

function getUrgencyDescription(urgency: UrgencyLevel): string {
  switch (urgency) {
    case 'express':
      return 'Recargo por entrega express (50%)';
    case 'urgent':
      return 'Recargo por entrega urgente (100%)';
    default:
      return 'Recargo por urgencia';
  }
}

function calculateUrgencyCharge(subtotal: number, urgency: UrgencyLevel): number {
  switch (urgency) {
    case 'express':
      return subtotal * 0.5;
    case 'urgent':
      return subtotal * 1.0;
    default:
      return 0;
  }
} 