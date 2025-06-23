import { 
  QuoteCalculation, 
  ClientType, 
  UrgencyLevel, 
  SelectedService 
} from '@/types/calculator/service-calculator.types';
import { serviceCategories } from './service-config';

export class QuoteCalculator {
  private readonly TAX_RATE = 0.16; // IVA México
  private readonly HOURS_PER_WEEK = 40;

  calculateQuote(
    services: SelectedService[],
    clientType: ClientType,
    urgency: UrgencyLevel
  ): QuoteCalculation {
    if (services.length === 0) {
      return this.getEmptyQuote();
    }

    const { subtotal, totalHours } = this.calculateSubtotal(services);
    const discountRate = this.getDiscountRate(clientType);
    const urgencyMultiplier = this.getUrgencyMultiplier(urgency);
    
    const discounts = subtotal * discountRate;
    const afterDiscount = subtotal - discounts;
    const withUrgency = afterDiscount * urgencyMultiplier;
    const taxes = withUrgency * this.TAX_RATE;
    const total = withUrgency + taxes;
    
    const estimatedDelivery = this.calculateDeliveryTime(totalHours, urgency);

    return {
      subtotal,
      discounts,
      taxes,
      total,
      estimatedDelivery,
      totalHours,
      urgencyMultiplier,
      discountRate
    };
  }

  private calculateSubtotal(services: SelectedService[]): { subtotal: number; totalHours: number } {
    let subtotal = 0;
    let totalHours = 0;
    services.forEach(service => {
      const category = serviceCategories.find(cat => cat.id === service.categoryId);
      const option = category?.options.find(opt => opt.id === service.optionId);
      
      if (category && option) {
        const servicePrice = category.basePrice * option.priceMultiplier * service.quantity;
        const serviceHours = option.estimatedHours * service.quantity;
        
        subtotal += servicePrice;
        totalHours += serviceHours;
      }
    });

    return { subtotal, totalHours };
  }

  private getDiscountRate(clientType: ClientType): number {
    switch (clientType) {
      case 'startup':
        return 0.15; // 15% descuento
      case 'enterprise':
        return -0.1; // 10% premium
      case 'pyme':
      default:
        return 0; // Sin descuento/premium
    }
  }

  private getUrgencyMultiplier(urgency: UrgencyLevel): number {
    switch (urgency) {
      case 'express':
        return 1.5; // +50%
      case 'urgent':
        return 2.0; // +100%
      case 'normal':
      default:
        return 1.0; // Sin recargo
    }
  }

  private calculateDeliveryTime(totalHours: number, urgency: UrgencyLevel): number {
    const baseWeeks = Math.ceil(totalHours / this.HOURS_PER_WEEK);
    
    const deliveryMultiplier = urgency === 'urgent' ? 0.5 : 
                              urgency === 'express' ? 0.7 : 1.0;
    
    return Math.max(1, Math.ceil(baseWeeks * deliveryMultiplier));
  }

  private getEmptyQuote(): QuoteCalculation {
    return {
      subtotal: 0,
      discounts: 0,
      taxes: 0,
      total: 0,
      estimatedDelivery: 0,
      totalHours: 0,
      urgencyMultiplier: 1,
      discountRate: 0
    };
  }

  // Utility methods for formatting
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  formatPercentage(rate: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(Math.abs(rate));
  }
}

export const quoteCalculator = new QuoteCalculator();
