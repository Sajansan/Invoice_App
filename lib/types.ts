// ─── Client ────────────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  created_at: string;
}

// ─── Invoice Item ──────────────────────────────────────────────
export interface InvoiceItem {
  id: string;
  invoice_id?: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

// ─── Invoice ───────────────────────────────────────────────────
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  client_address?: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  total: number;
  items?: InvoiceItem[];
  created_at: string;
}

// ─── Dashboard Stats ───────────────────────────────────────────
export interface DashboardStats {
  totalInvoices: number;
  paid: number;
  pending: number;
  totalRevenue: number;
}
