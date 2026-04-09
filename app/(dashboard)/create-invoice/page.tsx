'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { supabase } from '@/lib/supabaseClient';
import type { Client, InvoiceItem } from '@/lib/types';

function generateInvoiceNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(2);
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${y}${m}-${rand}`;
}

function createEmptyItem(): InvoiceItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    price: 0,
    total: 0,
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export default function CreateInvoicePage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([createEmptyItem()]);
  const [tax, setTax] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .order('name');
        if (data) setClients(data);
      } catch (err) {
        console.error('Fetch clients error:', err);
      }
    }
    fetchClients();
  }, []);

  /* ─── Computed values ─────────────────────────────────────── */
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

  /* ─── Item handlers ───────────────────────────────────────── */
  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updated.total = Number(updated.quantity) * Number(updated.price);
        }
        return updated;
      })
    );
  }

  function addItem() {
    setItems((prev) => [...prev, createEmptyItem()]);
  }

  function removeItem(id: string) {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  /* ─── Submit ──────────────────────────────────────────────── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClientId || items.length === 0) return;

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: inv, error } = await supabase
        .from('invoices')
        .insert([
          {
            user_id: user.id,
            invoice_number: generateInvoiceNumber(),
            client_id: selectedClientId,
            status: 'pending',
            issue_date: issueDate,
            due_date: dueDate,
            subtotal,
            tax: taxAmount,
            total,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (inv) {
        const itemsToInsert = items.map((item) => ({
          invoice_id: inv.id,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        }));
        const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert);
        if (itemsError) throw itemsError;
        
        router.push('/invoices');
        router.refresh();
      }
    } catch (err: any) {
      alert('Error creating invoice: ' + err.message);
      console.error('Create invoice error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details to generate a new invoice
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info card */}
        <Card className="p-6 space-y-5">
          <Select
            id="client-select"
            label="Client"
            placeholder="Select a client"
            options={clients.map((c) => ({ value: c.id, label: c.name }))}
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              id="issue-date"
              label="Issue Date"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
            <Input
              id="due-date"
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        </Card>

        {/* Items card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Invoice Items
            </h2>
            <Button type="button" variant="secondary" size="sm" onClick={addItem}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-3 items-end p-4 rounded-lg bg-gray-50/80 border border-gray-100"
              >
                <div className="col-span-12 sm:col-span-5">
                  <Input
                    id={`item-desc-${index}`}
                    label={index === 0 ? 'Description' : undefined}
                    placeholder="Service or product"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, 'description', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    id={`item-qty-${index}`}
                    label={index === 0 ? 'Qty' : undefined}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, 'quantity', Number(e.target.value))
                    }
                    required
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    id={`item-price-${index}`}
                    label={index === 0 ? 'Price' : undefined}
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, 'price', Number(e.target.value))
                    }
                    required
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <p
                    className={`text-sm font-medium text-gray-900 py-2.5 text-right ${
                      index === 0 ? 'mt-6' : ''
                    }`}
                  >
                    {formatCurrency(item.total)}
                  </p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      items.length <= 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    } ${index === 0 ? 'mt-6' : ''}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Summary card */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="flex flex-col items-end space-y-3">
            <div className="flex items-center gap-8 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900 w-28 text-right">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">Tax (%)</span>
              <input
                id="tax-input"
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                className="w-20 rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm text-right focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              <span className="font-medium text-gray-900 w-28 text-right">
                {formatCurrency(taxAmount)}
              </span>
            </div>
            <div className="h-px w-56 bg-gray-200 my-1" />
            <div className="flex items-center gap-8 text-lg">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 w-28 text-right">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" loading={submitting} id="submit-invoice-button">
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
