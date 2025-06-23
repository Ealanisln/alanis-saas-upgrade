export type ServiceComplexity = 'basic' | 'intermediate' | 'advanced';
export type ClientType = 'startup' | 'pyme' | 'enterprise';
export type UrgencyLevel = 'normal' | 'express' | 'urgent';

export interface ServiceOption {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly priceMultiplier: number;
  readonly complexity: ServiceComplexity;
  readonly estimatedHours: number;
  readonly features?: string[];
  readonly technologies?: string[];
}

export interface ServiceCategory {
  readonly id: string;
  readonly name: string;
  readonly icon: React.ReactNode;
  readonly basePrice: number;
  readonly description?: string;
  readonly options: readonly ServiceOption[];
}

export interface SelectedService {
  readonly categoryId: string;
  readonly optionId: string;
  quantity: number;
}

export interface QuoteCalculation {
  readonly subtotal: number;
  readonly discounts: number;
  readonly taxes: number;
  readonly total: number;
  readonly estimatedDelivery: number;
  readonly totalHours: number;
  readonly urgencyMultiplier: number;
  readonly discountRate: number;
}

export interface QuoteRequest {
  readonly services: readonly SelectedService[];
  readonly clientType: ClientType;
  readonly urgency: UrgencyLevel;
  readonly clientInfo?: {
    readonly name?: string;
    readonly email?: string;
    readonly company?: string;
    readonly phone?: string;
  };
  readonly projectDetails?: {
    readonly description?: string;
    readonly deadline?: Date;
    readonly budget?: number;
    readonly requirements?: string[];
  };
}

export interface QuoteResponse {
  readonly id: string;
  readonly calculation: QuoteCalculation;
  readonly request: QuoteRequest;
  readonly createdAt: Date;
  readonly validUntil: Date;
  readonly status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
}

// Database schema types for Prisma
export interface QuoteEntity {
  id: string;
  clientName?: string;
  clientEmail?: string;
  clientCompany?: string;
  clientPhone?: string;
  clientType: ClientType;
  urgency: UrgencyLevel;
  services: SelectedService[];
  subtotal: number;
  discounts: number;
  taxes: number;
  total: number;
  estimatedDelivery: number;
  totalHours: number;
  projectDescription?: string;
  deadline?: Date;
  budget?: number;
  requirements?: string[];
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  updatedAt: Date;
  validUntil: Date;
}

// API response types
export interface CreateQuoteResponse {
  success: boolean;
  data?: QuoteResponse;
  error?: string;
}

export interface GetQuoteResponse {
  success: boolean;
  data?: QuoteResponse;
  error?: string;
}

export interface ListQuotesResponse {
  success: boolean;
  data?: QuoteResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}
