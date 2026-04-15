'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-3xl space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <Card className="overflow-hidden border-none shadow-premium">
            <div className="p-10 bg-muted/5 border-b border-border/50 flex justify-between">
              <div className="space-y-3">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="space-y-4 text-right">
                  <Skeleton className="h-3 w-20 ml-auto" />
                  <Skeleton className="h-6 w-40 ml-auto" />
                </div>
              </div>
              <div className="space-y-4 pt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between border-b border-border/30 pb-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fadeIn">
        <Card className="p-10 text-center max-w-md border-none shadow-premium bg-surface">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">Invoice Not Found</h2>
          <p className="text-sm font-medium text-muted"> This link might be expired, incorrect, or the invoice has been deleted.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 animate-fadeIn">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Invoice Overview</h1>
            <p className="text-sm font-medium text-muted mt-1">View and verify your invoice details below</p>
        </div>

        <Card className="overflow-hidden shadow-premium border-none bg-surface">
          {/* Header */}
          <div className="px-10 py-12 bg-primary text-background flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">Invoice Number</p>
              <h2 className="text-4xl font-black tracking-tighter">{invoice.invoice_number}</h2>
            </div>
            <div className="flex flex-col sm:items-end gap-3">
               <Badge status={invoice.status} className="bg-background text-primary px-5 py-2 text-xs font-black border-none shadow-lg" />
               <p className="text-sm font-bold opacity-80 tracking-tight">
                 Due on {new Date(invoice.due_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
               </p>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted/60">Billed To</p>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground tracking-tight">{invoice.clients?.name}</h3>
                    <p className="text-sm font-bold text-muted leading-relaxed">
                      {invoice.clients?.email}<br />
                      {invoice.clients?.address}
                    </p>
                  </div>
               </div>
               <div className="sm:text-right space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted/60">Date Issued</p>
                  <p className="text-xl font-black text-foreground tracking-tight">
                    {new Date(invoice.issue_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
               </div>
            </div>

            {/* Items */}
            <div className="overflow-x-auto -mx-2">
               <Table>
                 <TableHead>
                   <TableRow className="border-b-2 border-border">
                     <TableHeaderCell className="text-[11px] font-black uppercase tracking-[0.2em] text-muted py-4">Description</TableHeaderCell>
                     <TableHeaderCell className="text-right text-[11px] font-black uppercase tracking-[0.2em] text-muted py-4">Qty</TableHeaderCell>
                     <TableHeaderCell className="text-right text-[11px] font-black uppercase tracking-[0.2em] text-muted py-4">Price</TableHeaderCell>
                     <TableHeaderCell className="text-right text-[11px] font-black uppercase tracking-[0.2em] text-muted py-4">Total</TableHeaderCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {items.map((item) => (
                     <TableRow key={item.id} className="border-b border-border/30 last:border-0">
                       <TableCell className="py-5 font-bold text-foreground">{item.description}</TableCell>
                       <TableCell className="py-5 text-right font-bold text-muted">{item.quantity}</TableCell>
                       <TableCell className="py-5 text-right font-bold text-muted">{formatCurrency(item.price)}</TableCell>
                       <TableCell className="py-5 text-right font-black text-foreground">{formatCurrency(item.total)}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end pt-6 border-t border-border/50">
               <div className="w-full sm:w-72 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold">
                     <span className="text-muted">Subtotal</span>
                     <span className="text-foreground">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                     <span className="text-muted">Tax</span>
                     <span className="text-foreground">{formatCurrency(invoice.tax)}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between items-center">
                     <span className="text-lg font-black text-muted uppercase tracking-tighter">Total</span>
                     <span className="text-3xl font-black text-primary tracking-tight">{formatCurrency(invoice.total)}</span>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="bg-muted/5 p-6 text-center border-t border-border/50">
             <p className="text-[10px] font-black text-muted/50 uppercase tracking-[0.3em]">Generated by SaaS Invoice App</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
