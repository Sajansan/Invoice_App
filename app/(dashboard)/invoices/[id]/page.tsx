'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton';
import Spinner from '@/components/ui/Spinner';
import { jsPDF } from 'jspdf';
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

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: inv, error: invError } = await supabase
          .from('invoices')
          .select('*, clients(*)')
          .eq('id', invoiceId)
          .eq('user_id', user.id)
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
        console.error('Fetch invoice error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [invoiceId]);

  async function handleMarkPaid() {
    if (!invoice) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', invoice.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setInvoice({ ...invoice, status: 'paid' });
    } catch (err) {
      console.error('Mark as paid error:', err);
    }
  }

  async function handleDownloadPDF() {
    if (!invoice) return;
    
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', margin, y);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.invoice_number, doc.internal.pageSize.width - margin, y, { align: 'right' });
    
    y += 15;
    doc.setDrawColor(200);
    doc.line(margin, y, doc.internal.pageSize.width - margin, y);
    
    y += 15;
    
    // Parties
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO:', margin, y);
    
    doc.setFont('helvetica', 'normal');
    y += 6;
    doc.text(invoice.clients?.name || '', margin, y);
    y += 5;
    doc.text(invoice.clients?.email || '', margin, y);
    y += 5;
    doc.text(invoice.clients?.address || '', margin, y);
    
    y = 50; // Reset Y for right side
    doc.setFont('helvetica', 'bold');
    doc.text('DATE ISSUED:', 140, y);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(invoice.issue_date).toLocaleDateString(), 140, y + 6);
    
    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('DUE DATE:', 140, y);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(invoice.due_date).toLocaleDateString(), 140, y + 6);
    
    y += 25;
    
    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y - 5, doc.internal.pageSize.width - (margin * 2), 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', margin + 5, y);
    doc.text('Qty', 130, y, { align: 'right' });
    doc.text('Price', 155, y, { align: 'right' });
    doc.text('Total', 190, y, { align: 'right' });
    
    y += 10;
    doc.setFont('helvetica', 'normal');
    
    items.forEach((item) => {
      doc.text(item.description, margin + 5, y);
      doc.text(item.quantity.toString(), 130, y, { align: 'right' });
      doc.text(formatCurrency(item.price), 155, y, { align: 'right' });
      doc.text(formatCurrency(item.total), 190, y, { align: 'right' });
      y += 8;
    });
    
    y += 10;
    doc.line(margin, y, doc.internal.pageSize.width - margin, y);
    y += 10;
    
    // Totals
    const rightSide = 190;
    doc.text('Subtotal:', 150, y);
    doc.text(formatCurrency(invoice.subtotal), rightSide, y, { align: 'right' });
    y += 8;
    doc.text('Tax:', 150, y);
    doc.text(formatCurrency(invoice.tax), rightSide, y, { align: 'right' });
    y += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 150, y);
    doc.text(formatCurrency(invoice.total), rightSide, y, { align: 'right' });

    doc.save(`${invoice.invoice_number}.pdf`);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <div className="bg-surface rounded-2xl border border-border shadow-premium overflow-hidden">
          <div className="p-10 bg-muted/5 border-b border-border/50 flex justify-between">
             <div className="space-y-3">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
             </div>
             <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-2">
             <div className="p-10 border-r border-border/50 space-y-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-48" />
             </div>
             <div className="p-10 bg-muted/5 space-y-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-48" />
             </div>
          </div>
          <div className="p-10 space-y-6">
             <Skeleton className="h-4 w-full" />
             <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between border-b border-border/30 pb-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-gray-900">Invoice not found</h2>
        <p className="text-sm text-gray-500 mt-1">
          The invoice you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push('/invoices')}>
          ← Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Back + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <button
          onClick={() => router.push('/invoices')}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-all cursor-pointer group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Invoices
        </button>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="shadow-premium"
            onClick={() => {
              const url = `${window.location.origin}/public/invoices/${invoice.id}`;
              navigator.clipboard.writeText(url);
              alert('Public link copied to clipboard!');
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </Button>
          <Button variant="secondary" className="shadow-premium" id="download-pdf-button" onClick={handleDownloadPDF}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </Button>
          {invoice.status !== 'paid' && (
            <Button onClick={handleMarkPaid} id="mark-paid-button" className="shadow-premium">
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Invoice card */}
      <Card className="overflow-hidden border-none shadow-2xl">
        {/* Header bar */}
        <div className="px-10 py-10 bg-muted/5 border-b border-border/50 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-foreground tracking-tighter">
              {invoice.invoice_number}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-muted">
              <span>Issued {new Date(invoice.issue_date).toLocaleDateString()}</span>
              <span className="text-border">•</span>
              <span className="text-primary">Due {new Date(invoice.due_date).toLocaleDateString()}</span>
            </div>
          </div>
          <Badge status={invoice.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-border/50">
          {/* Client info */}
          <div className="px-10 py-10 border-b md:border-b-0 md:border-r border-border/50">
            <p className="text-[11px] font-black uppercase tracking-widest text-muted/60 mb-4">
              Billed To
            </p>
            <p className="text-xl font-black text-foreground">
              {invoice.clients?.name || '—'}
            </p>
            <div className="mt-2 space-y-1 text-sm font-bold text-muted/80">
              {invoice.clients?.email && <p>{invoice.clients?.email}</p>}
              {invoice.clients?.address && <p className="leading-relaxed">{invoice.clients?.address}</p>}
            </div>
          </div>

          {/* Business Info (Optional/Placeholder) */}
          <div className="px-10 py-10 bg-muted/5">
            <p className="text-[11px] font-black uppercase tracking-widest text-muted/60 mb-4">
              Your Business
            </p>
            <p className="text-xl font-black text-foreground">
              InvoiceSaaS Inc.
            </p>
            <p className="mt-2 text-sm font-bold text-muted/80 leading-relaxed">
              123 Finance Plaza<br />
              London, United Kingdom
            </p>
          </div>
        </div>

        {/* Items table */}
        <div className="px-10 py-10">
          <Table>
            <TableHead>
              <TableRow className="border-b-2 border-border">
                <TableHeaderCell className="text-[11px] font-black uppercase tracking-widest text-muted py-4">Description</TableHeaderCell>
                <TableHeaderCell className="text-right text-[11px] font-black uppercase tracking-widest text-muted py-4">Qty</TableHeaderCell>
                <TableHeaderCell className="text-right text-[11px] font-black uppercase tracking-widest text-muted py-4">Price</TableHeaderCell>
                <TableHeaderCell className="text-right text-[11px] font-black uppercase tracking-widest text-muted py-4">Total</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id} className="border-b border-border/30 last:border-0">
                    <TableCell className="py-5 font-bold text-foreground">{item.description}</TableCell>
                    <TableCell className="text-right py-5 font-bold text-muted">{item.quantity}</TableCell>
                    <TableCell className="text-right py-5 font-bold text-muted">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-right py-5 font-black text-foreground">
                      {formatCurrency(item.total)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted font-bold">
                    No items listed
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="px-10 py-10 bg-muted/5 border-t border-border/50">
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-12 text-sm font-bold">
              <span className="text-muted">Subtotal</span>
              <span className="text-foreground w-32 text-right">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            <div className="flex items-center gap-12 text-sm font-bold">
              <span className="text-muted">Tax</span>
              <span className="text-foreground w-32 text-right">
                {formatCurrency(invoice.tax)}
              </span>
            </div>
            <div className="h-px w-48 bg-border my-2" />
            <div className="flex items-center gap-12">
              <span className="text-xl font-black text-muted uppercase tracking-tighter">Total Amount</span>
              <span className="text-3xl font-black text-primary w-40 text-right tracking-tight">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
