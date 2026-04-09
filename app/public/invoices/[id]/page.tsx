'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/Table';
import { supabase } from '@/lib/supabaseClient';
import type { Invoice, InvoiceItem } from '@/lib/types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export default function PublicInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicInvoice() {
      try {
        // Fetch invoice with client details (ensure RLS allows this if it's public)
        const { data: inv, error: invError } = await supabase
          .from('invoices')
          .select('*, clients(*)')
          .eq('id', invoiceId)
          .single();

        if (invError) throw invError;

        if (inv) {
          setInvoice(inv as Invoice);

          const { data: invoiceItems } = await supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', invoiceId);

          if (invoiceItems) setItems(invoiceItems);
        }
      } catch (err) {
        console.error('Fetch public invoice error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicInvoice();
  }, [invoiceId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Spinner />
    </div>
  );

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="p-8 text-center max-w-sm">
          <h2 className="text-xl font-black text-foreground mb-2">Invoice Not Found</h2>
          <p className="text-sm text-muted"> This link might be expired or incorrect.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Invoice Overview</h1>
            <p className="text-sm text-muted mt-1">View and verify your invoice details below</p>
        </div>

        <Card className="overflow-hidden shadow-2xl border-none">
          {/* Header */}
          <div className="px-8 py-10 bg-primary text-background flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Invoice Number</p>
              <h2 className="text-4xl font-black tracking-tighter">{invoice.invoice_number}</h2>
            </div>
            <div className="flex flex-col items-end gap-2">
               <Badge status={invoice.status} className="bg-background text-primary px-4 py-1.5 text-xs border-none" />
               <p className="text-sm font-medium opacity-90">
                 Due on {new Date(invoice.due_date).toLocaleDateString()}
               </p>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted mb-4">Billed To</p>
                  <h3 className="text-lg font-black text-foreground">{invoice.clients?.name}</h3>
                  <p className="text-sm text-muted mt-1 leading-relaxed">
                    {invoice.clients?.email}<br />
                    {invoice.clients?.address}
                  </p>
               </div>
               <div className="sm:text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-muted mb-4">Date Issued</p>
                  <p className="text-lg font-black text-foreground">
                    {new Date(invoice.issue_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
               </div>
            </div>

            {/* Items */}
            <div>
               <Table>
                 <TableHead>
                   <TableRow className="border-b-2 border-muted/50">
                     <TableHeaderCell className="text-xs font-black uppercase tracking-widest">Description</TableHeaderCell>
                     <TableHeaderCell className="text-right text-xs font-black uppercase tracking-widest">Qty</TableHeaderCell>
                     <TableHeaderCell className="text-right text-xs font-black uppercase tracking-widest">Price</TableHeaderCell>
                     <TableHeaderCell className="text-right text-xs font-black uppercase tracking-widest">Total</TableHeaderCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {items.map((item) => (
                     <TableRow key={item.id} className="border-b border-muted/30">
                       <TableCell className="py-4 font-medium">{item.description}</TableCell>
                       <TableCell className="py-4 text-right text-muted">{item.quantity}</TableCell>
                       <TableCell className="py-4 text-right text-muted">{formatCurrency(item.price)}</TableCell>
                       <TableCell className="py-4 text-right font-black text-foreground">{formatCurrency(item.total)}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end pt-4">
               <div className="w-full sm:w-64 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-muted font-medium">Subtotal</span>
                     <span className="text-foreground font-bold">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-muted font-medium">Tax</span>
                     <span className="text-foreground font-bold">{formatCurrency(invoice.tax)}</span>
                  </div>
                  <div className="h-px bg-muted/50 my-4" />
                  <div className="flex justify-between items-center">
                     <span className="text-lg font-black text-foreground">Total</span>
                     <span className="text-2xl font-black text-primary">{formatCurrency(invoice.total)}</span>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="bg-muted/10 p-4 text-center border-t border-muted/20">
             <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Generated by SaaS Invoice App</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
