import axios, { AxiosInstance } from 'axios';
import type {
  ApiResponse,
  QuoteRequest,
  QuoteResponse,
  EmailRequest,
  EmailResponse,
  PaginatedResponse
} from './types';

export class ApiClient {
  private client: AxiosInstance;
  
  constructor(baseURL: string = 'https://api.alanis.dev') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error:', error);
        }

        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }

        const apiError = error.response?.data || {
          success: false,
          message: error.message || 'Network error occurred',
          data: null
        };

        return Promise.reject(apiError);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Generic methods
  async get<T = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    return this.client.get(endpoint, { params });
  }

  async post<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    return this.client.post(endpoint, data);
  }

  async put<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    return this.client.put(endpoint, data);
  }

  async delete<T = unknown>(endpoint: string): Promise<T> {
    return this.client.delete(endpoint);
  }

  // Specific API methods
  async fetchQuotes(params?: {
    page?: number;
    limit?: number;
    status?: string;
    clientType?: string;
  }): Promise<PaginatedResponse<QuoteResponse[]>> {
    return this.get<PaginatedResponse<QuoteResponse[]>>('/quotes', params);
  }

  async createQuote(request: QuoteRequest): Promise<ApiResponse<QuoteResponse>> {
    return this.post<ApiResponse<QuoteResponse>>('/quotes', request);
  }

  async getQuote(id: string): Promise<ApiResponse<QuoteResponse>> {
    return this.get<ApiResponse<QuoteResponse>>(`/quotes/${id}`);
  }

  async updateQuote(id: string, request: Partial<QuoteRequest>): Promise<ApiResponse<QuoteResponse>> {
    return this.put<ApiResponse<QuoteResponse>>(`/quotes/${id}`, request);
  }

  async deleteQuote(id: string): Promise<ApiResponse<{ id: string }>> {
    return this.delete<ApiResponse<{ id: string }>>(`/quotes/${id}`);
  }

  async sendEmail(request: EmailRequest): Promise<ApiResponse<EmailResponse>> {
    return this.post<ApiResponse<EmailResponse>>('/emails/send', request);
  }

  async syncWithInvoiceNinja(quoteData: QuoteRequest): Promise<ApiResponse<{ invoiceId: string; success: boolean }>> {
    return this.post<ApiResponse<{ invoiceId: string; success: boolean }>>('/quotes/sync/invoice-ninja', quoteData);
  }

  async sendContactForm(data: {
    name: string;
    email: string;
    message: string;
    subject?: string;
  }): Promise<ApiResponse<{ success: boolean; messageId?: string }>> {
    return this.post<ApiResponse<{ success: boolean; messageId?: string }>>('/contact', data);
  }

  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get<ApiResponse<{ status: string; timestamp: string }>>('/health');
  }
}

// Singleton instance
let apiClientInstance: ApiClient | null = null;

export const createApiClient = (baseURL?: string): ApiClient => {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(baseURL);
  }
  return apiClientInstance;
};

export const apiClient = createApiClient(); 