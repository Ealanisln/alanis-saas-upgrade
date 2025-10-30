export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Quote related types - using generic interfaces compatible with external API
export interface QuoteRequest {
  services: ServiceItem[];
  clientInfo: ClientInfo;
  projectType: string;
  timeline?: string;
  budget?: string;
  additionalNotes?: string;
  clientType: 'startup' | 'pyme' | 'enterprise';
  urgency: 'normal' | 'express' | 'urgent';
  projectDetails?: {
    description?: string;
    deadline?: Date;
    budget?: number;
    requirements?: string[];
  };
}

export interface ServiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  category: string;
}

export interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface QuoteResponse {
  id: string;
  quoteNumber?: string;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  services: ServiceItem[];
  clientInfo: ClientInfo;
  calculation?: {
    subtotal: number;
    discounts: number;
    taxes: number;
    total: number;
    estimatedDelivery: number;
    totalHours: number;
  };
}

// Email types
export interface EmailRequest {
  to: string[];
  subject: string;
  content: string;
  template?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface EmailResponse {
  messageId: string;
  status: 'sent' | 'failed';
  error?: string;
} 