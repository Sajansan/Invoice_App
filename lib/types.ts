// ─── Client ────────────────────────────────────────────────────
export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  address: string | null;
  created_at: string;
}

// ─── Invoice Item ──────────────────────────────────────────────
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

// ─── Invoice ───────────────────────────────────────────────────
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
  // Joined fields
  clients?: Client;
  invoice_items?: InvoiceItem[];
}

// ─── Payment ───────────────────────────────────────────────────
export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  method: string;
}

// ─── Dashboard Stats ───────────────────────────────────────────
export interface DashboardStats {
  totalInvoices: number;
  paid: number;
  pending: number;
  overdue: number;
  totalRevenue: number;
}
