'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
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
        const { data: inv } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', invoiceId)
          .single();

        if (inv) {
          setInvoice(inv);

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
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoice.id);
    setInvoice({ ...invoice, status: 'paid' });
  }

  if (loading) return <Spinner />;

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => router.push('/invoices')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Invoices
        </button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" id="download-pdf-button">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </Button>
          {invoice.status !== 'paid' && (
            <Button onClick={handleMarkPaid} id="mark-paid-button">
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Invoice card */}
      <Card className="overflow-hidden">
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {invoice.invoice_number}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Issued {new Date(invoice.issue_date).toLocaleDateString()} · Due{' '}
              {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          </div>
          <Badge status={invoice.status} />
        </div>

        {/* Client info */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Bill To
          </p>
          <p className="text-sm font-medium text-gray-900">
            {invoice.client_name || '—'}
          </p>
          {invoice.client_email && (
            <p className="text-sm text-gray-500">{invoice.client_email}</p>
          )}
          {invoice.client_address && (
            <p className="text-sm text-gray-500">{invoice.client_address}</p>
          )}
        </div>

        {/* Items table */}
        <div className="px-6 py-5 border-b border-gray-100">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell className="text-right">Qty</TableHeaderCell>
                <TableHeaderCell className="text-right">Price</TableHeaderCell>
                <TableHeaderCell className="text-right">Total</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.total)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-400">
                    No items
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="px-6 py-5">
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-8 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900 w-28 text-right">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="font-medium text-gray-900 w-28 text-right">
                {formatCurrency(invoice.tax)}
              </span>
            </div>
            <div className="h-px w-40 bg-gray-200 my-1" />
            <div className="flex items-center gap-8 text-base">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 w-28 text-right">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
