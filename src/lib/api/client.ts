import axios, { AxiosInstance } from 'axios';

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
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<any> {
    return this.client.get(endpoint, { params });
  }

  async post<T>(endpoint: string, data?: any): Promise<any> {
    return this.client.post(endpoint, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<any> {
    return this.client.put(endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<any> {
    return this.client.delete(endpoint);
  }

  // Specific API methods
  async fetchQuotes(params?: {
    page?: number;
    limit?: number;
    status?: string;
    clientType?: string;
  }): Promise<any> {
    return this.get('/quotes', params);
  }

  async createQuote(request: any): Promise<any> {
    return this.post('/quotes', request);
  }

  async getQuote(id: string): Promise<any> {
    return this.get(`/quotes/${id}`);
  }

  async updateQuote(id: string, request: any): Promise<any> {
    return this.put(`/quotes/${id}`, request);
  }

  async deleteQuote(id: string): Promise<any> {
    return this.delete(`/quotes/${id}`);
  }

  async sendEmail(request: any): Promise<any> {
    return this.post('/emails/send', request);
  }

  async syncWithInvoiceNinja(quoteData: any): Promise<any> {
    return this.post('/quotes/sync/invoice-ninja', quoteData);
  }

  async sendContactForm(data: {
    name: string;
    email: string;
    message: string;
    subject?: string;
  }): Promise<any> {
    return this.post('/contact', data);
  }

  async healthCheck(): Promise<any> {
    return this.get('/health');
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