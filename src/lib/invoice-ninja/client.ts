// Invoice Ninja API client
export interface InvoiceNinjaConfig {
  apiToken: string;
  baseUrl: string; // https://app.invoiceninja.com or your self-hosted URL
  version: '4' | '5'; // API version
}

export interface InvoiceNinjaProduct {
  id?: string;
  product_key: string;
  notes: string;
  cost: number;
  price?: number;
  tax_name?: string;
  tax_rate?: number;
  custom_value1?: string;
  custom_value2?: string;
  custom_value3?: string;
  custom_value4?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceNinjaClient {
  id?: string;
  name: string;
  contact?: {
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: string;
  };
  website?: string;
  private_notes?: string;
  public_notes?: string;
  industry_id?: number;
  size_id?: number;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country_id?: number;
  custom_value1?: string;
  custom_value2?: string;
  custom_value3?: string;
  custom_value4?: string;
}

export interface InvoiceNinjaInvoice {
  id?: string;
  client_id: string;
  invoice_number?: string;
  po_number?: string;
  terms?: string;
  public_notes?: string;
  private_notes?: string;
  footer?: string;
  invoice_date?: string;
  due_date?: string;
  partial_due_date?: string;
  partial?: number;
  invoice_items: InvoiceNinjaInvoiceItem[];
  discount?: number;
  is_amount_discount?: boolean;
  tax_name1?: string;
  tax_rate1?: number;
  tax_name2?: string;
  tax_rate2?: number;
  tax_name3?: string;
  tax_rate3?: number;
  custom_value1?: string;
  custom_value2?: string;
  custom_value3?: string;
  custom_value4?: string;
  email_invoice?: boolean;
}

export interface InvoiceNinjaInvoiceItem {
  product_key?: string;
  notes: string;
  cost: number;
  qty: number;
  tax_name1?: string;
  tax_rate1?: number;
  tax_name2?: string;
  tax_rate2?: number;
  custom_value1?: string;
  custom_value2?: string;
  custom_value3?: string;
  custom_value4?: string;
}

export interface InvoiceNinjaQuote {
  id?: string;
  client_id: string;
  quote_number?: string;
  po_number?: string;
  terms?: string;
  public_notes?: string;
  private_notes?: string;
  footer?: string;
  quote_date?: string;
  due_date?: string;
  partial_due_date?: string;
  partial?: number;
  invoice_items: InvoiceNinjaInvoiceItem[];
  discount?: number;
  is_amount_discount?: boolean;
  tax_name1?: string;
  tax_rate1?: number;
  tax_name2?: string;
  tax_rate2?: number;
  tax_name3?: string;
  tax_rate3?: number;
  custom_value1?: string;
  custom_value2?: string;
  custom_value3?: string;
  custom_value4?: string;
  email_quote?: boolean;
}

export class InvoiceNinjaClient {
  private config: InvoiceNinjaConfig;

  constructor(config: InvoiceNinjaConfig) {
    this.config = config;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    // Different header names for different API versions
    if (this.config.version === '5') {
      headers['X-API-TOKEN'] = this.config.apiToken;
    } else {
      headers['X-Ninja-Token'] = this.config.apiToken;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    const url = `${this.config.baseUrl}/api/v1/${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Invoice Ninja API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Products API
  async getProducts(): Promise<{ data: InvoiceNinjaProduct[] }> {
    return this.makeRequest<{ data: InvoiceNinjaProduct[] }>('products');
  }

  async getProduct(id: string): Promise<{ data: InvoiceNinjaProduct }> {
    return this.makeRequest<{ data: InvoiceNinjaProduct }>(`products/${id}`);
  }

  async createProduct(product: Omit<InvoiceNinjaProduct, 'id'>): Promise<{ data: InvoiceNinjaProduct }> {
    return this.makeRequest<{ data: InvoiceNinjaProduct }>('products', 'POST', product);
  }

  async updateProduct(id: string, product: Partial<InvoiceNinjaProduct>): Promise<{ data: InvoiceNinjaProduct }> {
    return this.makeRequest<{ data: InvoiceNinjaProduct }>(`products/${id}`, 'PUT', { ...product, id });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.makeRequest(`products/${id}`, 'DELETE');
  }

  // Clients API
  async getClients(): Promise<{ data: InvoiceNinjaClient[] }> {
    return this.makeRequest<{ data: InvoiceNinjaClient[] }>('clients');
  }

  async createClient(client: Omit<InvoiceNinjaClient, 'id'>): Promise<{ data: InvoiceNinjaClient }> {
    return this.makeRequest<{ data: InvoiceNinjaClient }>('clients', 'POST', client);
  }

  async findClientByEmail(email: string): Promise<{ data: InvoiceNinjaClient[] }> {
    return this.makeRequest<{ data: InvoiceNinjaClient[] }>(`clients?email=${encodeURIComponent(email)}`);
  }

  // Invoices API
  async createInvoice(invoice: Omit<InvoiceNinjaInvoice, 'id'>): Promise<{ data: InvoiceNinjaInvoice }> {
    return this.makeRequest<{ data: InvoiceNinjaInvoice }>('invoices', 'POST', invoice);
  }

  async emailInvoice(invoiceId: string): Promise<void> {
    await this.makeRequest('email_invoice', 'POST', { id: invoiceId });
  }

  // Quotes API
  async createQuote(quote: Omit<InvoiceNinjaQuote, 'id'>): Promise<{ data: InvoiceNinjaQuote }> {
    return this.makeRequest<{ data: InvoiceNinjaQuote }>('quotes', 'POST', quote);
  }

  async emailQuote(quoteId: string): Promise<void> {
    await this.makeRequest('email_quote', 'POST', { id: quoteId });
  }
}

// Helper function to create client instance
export function createInvoiceNinjaClient(config: InvoiceNinjaConfig): InvoiceNinjaClient {
  return new InvoiceNinjaClient(config);
}
