export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Quote related types
export interface QuoteRequest {
  services: ServiceItem[];
  clientInfo: ClientInfo;
  projectType: string;
  timeline?: string;
  budget?: string;
  additionalNotes?: string;
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
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface QuoteResponse {
  id: string;
  quoteNumber: string;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  services: ServiceItem[];
  clientInfo: ClientInfo;
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