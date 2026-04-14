'use client';

import React, { useEffect, useState } from 'react';
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

interface CreateInvoiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateInvoiceForm({ onSuccess, onCancel }: CreateInvoiceFormProps) {
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

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

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
        
        onSuccess();
      }
    } catch (err: any) {
      alert('Error creating invoice: ' + err.message);
      console.error('Create invoice error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Basic Info */}
        <div className="space-y-5">
          <Select
            id="client-select"
            label="Select Client"
            placeholder="Search or select a client"
            options={clients.map((c) => ({ value: c.id, label: c.name }))}
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Right: Summary */}
        <Card className="p-5 bg-background/50 backdrop-blur-sm border-dashed border-2">
          <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-wider mb-4">Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Tax (%)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="w-14 bg-surface border border-border rounded-md px-1.5 py-0.5 text-right text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <span className="font-semibold w-16 text-right">{formatCurrency(taxAmount)}</span>
              </div>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total</span>
              <span className="font-black text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-wider">Line Items</h3>
          <Button type="button" variant="ghost" size="sm" onClick={addItem} className="text-primary hover:text-primary">
            + Add Item
          </Button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group relative grid grid-cols-12 gap-3 items-start p-4 rounded-xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 shadow-sm"
            >
              <div className="col-span-12 sm:col-span-6">
                <Input
                  placeholder="What are you charging for?"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  required
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <Input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-3 sm:col-span-1 text-right pt-2.5">
                <span className="text-sm font-bold">{formatCurrency(item.total)}</span>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer disabled:hidden"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} className="min-w-[140px]">
          Create Invoice
        </Button>
      </div>
    </form>
  );
}
