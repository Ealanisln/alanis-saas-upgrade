import { InvoiceNinjaClient, InvoiceNinjaProduct } from './client';
import { serviceCategories } from '@/components/Calculator/service-config';
import { ServiceOption } from '@/types/calculator/service-calculator.types';

export interface ProductSyncMapping {
  calculatorId: string; // categoryId-optionId
  invoiceNinjaId?: string;
  product_key: string;
  lastSynced?: Date;
}

export class ProductSyncService {
  private client: InvoiceNinjaClient;
  private mappings: Map<string, ProductSyncMapping> = new Map();

  constructor(client: InvoiceNinjaClient) {
    this.client = client;
  }

  /**
   * Sincroniza todos los productos de la calculadora con Invoice Ninja
   */
  async syncAllProducts(): Promise<{ success: boolean; synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    try {
      // Obtener productos existentes de Invoice Ninja
      const existingProducts = await this.client.getProducts();
      const existingProductKeys = new Set(
        existingProducts.data.map(p => p.product_key)
      );

      // Sincronizar cada servicio de la calculadora
      for (const category of serviceCategories) {
        for (const option of category.options) {
          try {
            const productKey = this.generateProductKey(category.id, option.id);
            const calculatorId = `${category.id}-${option.id}`;

            if (existingProductKeys.has(productKey)) {
              // Actualizar producto existente
              await this.updateExistingProduct(category, option, productKey);
            } else {
              // Crear nuevo producto
              await this.createNewProduct(category, option, productKey);
            }

            this.mappings.set(calculatorId, {
              calculatorId,
              product_key: productKey,
              lastSynced: new Date()
            });

            synced++;
          } catch (error) {
            const errorMsg = `Error syncing ${category.name} - ${option.name}: ${error}`;
            errors.push(errorMsg);
            console.error(errorMsg);
          }
        }
      }

      return { success: errors.length === 0, synced, errors };
    } catch (error) {
      console.error('Error in syncAllProducts:', error);
      return { success: false, synced, errors: [`General sync error: ${error}`] };
    }
  }

  /**
   * Crea un nuevo producto en Invoice Ninja
   */
  private async createNewProduct(
    category: any,
    option: ServiceOption,
    productKey: string
  ): Promise<void> {
    const product: Omit<InvoiceNinjaProduct, 'id'> = {
      product_key: productKey,
      notes: this.generateProductDescription(category, option),
      cost: this.calculateBaseCost(category.basePrice, option.priceMultiplier),
      price: this.calculateBasePrice(category.basePrice, option.priceMultiplier),
      custom_value1: category.name, // Categoría
      custom_value2: option.complexity, // Complejidad
      custom_value3: option.estimatedHours.toString(), // Horas estimadas
      custom_value4: JSON.stringify(option.technologies) // Tecnologías
    };

    await this.client.createProduct(product);
  }

  /**
   * Actualiza un producto existente
   */
  private async updateExistingProduct(
    category: any,
    option: ServiceOption,
    productKey: string
  ): Promise<void> {
    // Buscar el producto por product_key
    const products = await this.client.getProducts();
    const existing = products.data.find(p => p.product_key === productKey);

    if (!existing?.id) {
      throw new Error(`Product with key ${productKey} not found`);
    }

    const updatedProduct: Partial<InvoiceNinjaProduct> = {
      notes: this.generateProductDescription(category, option),
      cost: this.calculateBaseCost(category.basePrice, option.priceMultiplier),
      price: this.calculateBasePrice(category.basePrice, option.priceMultiplier),
      custom_value1: category.name,
      custom_value2: option.complexity,
      custom_value3: option.estimatedHours.toString(),
      custom_value4: JSON.stringify(option.technologies)
    };

    await this.client.updateProduct(existing.id, updatedProduct);
  }

  /**
   * Genera la clave única del producto
   */
  private generateProductKey(categoryId: string, optionId: string): string {
    return `calc_${categoryId}_${optionId}`.toUpperCase();
  }

  /**
   * Genera la descripción del producto
   */
  private generateProductDescription(category: any, option: ServiceOption): string {
    const features = option.features.join(', ');
    const technologies = option.technologies.join(', ');
    
    return `${option.description}

Categoría: ${category.name}
Complejidad: ${option.complexity}
Horas estimadas: ${option.estimatedHours}h
Características: ${features}
Tecnologías: ${technologies}`;
  }

  /**
   * Calcula el costo base (para Invoice Ninja)
   */
  private calculateBaseCost(basePrice: number, multiplier: number): number {
    return Math.round(basePrice * multiplier * 0.7); // 70% del precio como costo
  }

  /**
   * Calcula el precio base (para Invoice Ninja)
   */
  private calculateBasePrice(basePrice: number, multiplier: number): number {
    return Math.round(basePrice * multiplier);
  }

  /**
   * Obtiene el mapeo de un servicio específico
   */
  getMapping(categoryId: string, optionId: string): ProductSyncMapping | undefined {
    return this.mappings.get(`${categoryId}-${optionId}`);
  }

  /**
   * Convierte una cotización de la calculadora a items de Invoice Ninja
   */
  async convertQuoteToInvoiceItems(services: any[]): Promise<any[]> {
    const items: any[] = [];

    for (const service of services) {
      const mapping = this.getMapping(service.categoryId, service.optionId);
      
      if (!mapping) {
        throw new Error(`No mapping found for service ${service.categoryId}-${service.optionId}`);
      }

      // Buscar el producto en Invoice Ninja
      const products = await this.client.getProducts();
      const product = products.data.find(p => p.product_key === mapping.product_key);

      if (!product) {
        throw new Error(`Product not found in Invoice Ninja: ${mapping.product_key}`);
      }

      items.push({
        product_key: product.product_key,
        notes: product.notes,
        cost: product.cost || 0,
        qty: service.quantity,
        custom_value1: product.custom_value1,
        custom_value2: product.custom_value2,
        custom_value3: product.custom_value3,
        custom_value4: product.custom_value4
      });
    }

    return items;
  }
}

export default ProductSyncService; 