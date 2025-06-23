import { 
  SelectedService, 
  QuoteCalculation, 
  ClientType, 
  UrgencyLevel 
} from '@/types/calculator/service-calculator.types';
import { serviceCategories } from '@/components/Calculator/service-config';
import { 
  createInvoiceNinjaClient, 
  InvoiceNinjaConfig,
  InvoiceNinjaProduct,
  InvoiceNinjaInvoiceItem,
  InvoiceNinjaClient as INClient
} from './client';

export class InvoiceNinjaSync {
  private client: any;
  private config: InvoiceNinjaConfig;

  constructor(config: InvoiceNinjaConfig) {
    this.config = config;
    this.client = createInvoiceNinjaClient(config);
  }

  /**
   * Sync calculator services to Invoice Ninja products
   */
  async syncServicesToProducts(): Promise<void> {
    try {
      console.log('🔄 Syncing calculator services to Invoice Ninja products...');

      for (const category of serviceCategories) {
        for (const option of category.options) {
          const productKey = `${category.id}_${option.id}`;
          const price = category.basePrice * option.priceMultiplier;

          const product: Omit<InvoiceNinjaProduct, 'id'> = {
            product_key: productKey,
            notes: `${category.name} - ${option.name}: ${option.description}`,
            cost: price,
            price: price,
            tax_rate: 16, // IVA Mexico
            tax_name: 'IVA',
            custom_value1: category.id, // Category ID
            custom_value2: option.complexity, // Complexity level
            custom_value3: option.estimatedHours.toString(), // Estimated hours
            custom_value4: JSON.stringify(option.features || []) // Features as JSON
          };

          try {
            // Try to find existing product
            const existingProducts = await this.client.getProducts();
            const existing = existingProducts.data.find(
              (p: InvoiceNinjaProduct) => p.product_key === productKey
            );

            if (existing) {
              // Update existing product
              await this.client.updateProduct(existing.id!, product);
              console.log(`✅ Updated product: ${productKey}`);
            } else {
              // Create new product
              await this.client.createProduct(product);
              console.log(`✅ Created product: ${productKey}`);
            }
          } catch (error) {
            console.error(`❌ Error syncing product ${productKey}:`, error);
          }
        }
      }

      console.log('✅ Product sync completed!');
    } catch (error) {
      console.error('❌ Error syncing products:', error);
      throw error;
    }
  }

  /**
   * Convert calculator quote to Invoice Ninja invoice items
   */
  convertQuoteToInvoiceItems(
    services: SelectedService[],
    quote: QuoteCalculation
  ): InvoiceNinjaInvoiceItem[] {
    const items: InvoiceNinjaInvoiceItem[] = [];

    // Add service items
    services.forEach(service => {
      const category = serviceCategories.find(cat => cat.id === service.categoryId);
      const option = category?.options.find(opt => opt.id === service.optionId);

      if (category && option) {
        const productKey = `${category.id}_${option.id}`;
        const unitPrice = category.basePrice * option.priceMultiplier;

        items.push({
          product_key: productKey,
          notes: `${category.name} - ${option.name}`,
          cost: unitPrice,
          qty: service.quantity,
          tax_rate1: 16,
          tax_name1: 'IVA',
          custom_value1: option.complexity,
          custom_value2: option.estimatedHours.toString()
        });
      }
    });

    // Add discount/premium as separate line item if applicable
    if (quote.discounts !== 0) {
      const isDiscount = quote.discounts > 0;
      items.push({
        notes: isDiscount ? 'Descuento aplicado' : 'Cargo premium',
        cost: isDiscount ? -Math.abs(quote.discounts) : Math.abs(quote.discounts),
        qty: 1,
        custom_value1: 'adjustment'
      });
    }

    // Add urgency surcharge if applicable
    if (quote.urgencyMultiplier > 1) {
      const surcharge = quote.subtotal * (quote.urgencyMultiplier - 1);
      items.push({
        notes: 'Cargo por urgencia',
        cost: surcharge,
        qty: 1,
        custom_value1: 'urgency_surcharge'
      });
    }

    return items;
  }

  /**
   * Create or find client in Invoice Ninja
   */
  async findOrCreateClient(
    name: string,
    email: string,
    company?: string,
    phone?: string
  ): Promise<string> {
    try {
      // Try to find existing client by email
      const existingClients = await this.client.findClientByEmail(email);
      
      if (existingClients.data && existingClients.data.length > 0) {
        return existingClients.data[0].id!;
      }

      // Create new client
      const newClient: any = {
        name: company || name,
        contact: {
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' '),
          email: email,
          phone: phone
        },
        private_notes: 'Created from Calculator Quote'
      };

      const createdClient = await this.client.createClient(newClient);
      return createdClient.data.id!;
    } catch (error) {
      console.error('Error finding/creating client:', error);
      throw error;
    }
  }

  /**
   * Create quote in Invoice Ninja from calculator data
   */
  async createQuoteFromCalculator(
    services: SelectedService[],
    quote: QuoteCalculation,
    clientInfo: {
      name: string;
      email: string;
      company?: string;
      phone?: string;
    },
    projectDetails?: {
      description?: string;
      deadline?: Date;
      requirements?: string[];
    }
  ): Promise<string> {
    try {
      // Find or create client
      const clientId = await this.findOrCreateClient(
        clientInfo.name,
        clientInfo.email,
        clientInfo.company,
        clientInfo.phone
      );

      // Convert to invoice items
      const invoiceItems = this.convertQuoteToInvoiceItems(services, quote);

      // Prepare notes
      let publicNotes = 'Cotización generada desde calculadora de servicios\n\n';
      if (projectDetails?.description) {
        publicNotes += `Descripción del proyecto:\n${projectDetails.description}\n\n`;
      }
      if (projectDetails?.requirements && projectDetails.requirements.length > 0) {
        publicNotes += `Requerimientos:\n${projectDetails.requirements.map(req => `• ${req}`).join('\n')}\n\n`;
      }
      publicNotes += `Tiempo estimado de entrega: ${quote.estimatedDelivery} semana${quote.estimatedDelivery !== 1 ? 's' : ''}\n`;
      publicNotes += `Horas totales estimadas: ${quote.totalHours}h`;

      // Create quote
      const quoteData = {
        client_id: clientId,
        terms: 'Cotización válida por 30 días',
        public_notes: publicNotes,
        private_notes: JSON.stringify({
          calculatorData: {
            services,
            quote,
            clientInfo,
            projectDetails
          }
        }),
        quote_date: new Date().toISOString().split('T')[0],
        due_date: projectDetails?.deadline ? 
          projectDetails.deadline.toISOString().split('T')[0] : 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        invoice_items: invoiceItems,
        custom_value1: 'calculator_quote',
        custom_value2: quote.totalHours.toString(),
        custom_value3: quote.estimatedDelivery.toString(),
        custom_value4: JSON.stringify(services),
        email_quote: true // Send email automatically
      };

      const createdQuote = await this.client.createQuote(quoteData);
      
      console.log('✅ Quote created in Invoice Ninja:', createdQuote.data.id);
      return createdQuote.data.id!;
    } catch (error) {
      console.error('❌ Error creating quote in Invoice Ninja:', error);
      throw error;
    }
  }

  /**
   * Get products from Invoice Ninja and update calculator prices
   */
  async syncPricesFromInvoiceNinja(): Promise<void> {
    try {
      console.log('🔄 Syncing prices from Invoice Ninja to calculator...');
      
      const products = await this.client.getProducts();
      const updates: { [key: string]: number } = {};

      products.data.forEach((product: InvoiceNinjaProduct) => {
        if (product.product_key && product.price) {
          updates[product.product_key] = product.price;
        }
      });

      // Here you would update your service configuration
      // This could involve writing to a config file or database
      console.log('Price updates found:', updates);
      console.log('✅ Price sync completed!');
      
      return updates;
    } catch (error) {
      console.error('❌ Error syncing prices:', error);
      throw error;
    }
  }
}

// Helper function to create sync instance
export function createInvoiceNinjaSync(config: InvoiceNinjaConfig): InvoiceNinjaSync {
  return new InvoiceNinjaSync(config);
}

// Configuration from environment variables
export function getInvoiceNinjaConfig(): InvoiceNinjaConfig {
  const apiToken = process.env.INVOICE_NINJA_API_TOKEN;
  const baseUrl = process.env.INVOICE_NINJA_BASE_URL || 'https://app.invoiceninja.com';
  const version = (process.env.INVOICE_NINJA_API_VERSION || '5') as '4' | '5';

  if (!apiToken) {
    throw new Error('INVOICE_NINJA_API_TOKEN environment variable is required');
  }

  return {
    apiToken,
    baseUrl,
    version
  };
}
