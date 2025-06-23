// Tipos específicos para Invoice Ninja API
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

export interface InvoiceNinjaClientData {
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