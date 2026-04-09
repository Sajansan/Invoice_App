'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/Table';
import { supabase } from '@/lib/supabaseClient';
import type { Invoice } from '@/lib/types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('invoices')
        .select('*, clients(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const now = new Date();
        const typedInvoices = data.map(inv => {
          const dueDate = new Date(inv.due_date);
          let status = inv.status;
          if (status === 'pending' && dueDate < now) {
            status = 'overdue';
          }
          return {
            ...inv,
            status
          };
        }) as Invoice[];
        setInvoices(typedInvoices);
      }
    } catch (err) {
      console.error('Fetch invoices error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('invoices').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      await fetchInvoices();
    } catch (err) {
      console.error('Delete invoice error:', err);
    }
  }

  async function handleMarkPaid(id: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      await fetchInvoices();
    } catch (err) {
      console.error('Mark as paid error:', err);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your invoices
          </p>
        </div>
        <Link href="/create-invoice">
          <Button id="create-invoice-button">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Table or empty state */}
      {invoices.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="No invoices yet"
          description="Create your first invoice to start tracking payments."
          action={
            <Link href="/create-invoice">
              <Button size="sm">Create Invoice</Button>
            </Link>
          }
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Invoice #</TableHeaderCell>
              <TableHeaderCell>Client</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {inv.invoice_number}
                  </Link>
                </TableCell>
                <TableCell>{inv.clients?.name || '—'}</TableCell>
                <TableCell>
                  <Badge status={inv.status} />
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(inv.total)}
                </TableCell>
                <TableCell className="text-gray-500">
                  {new Date(inv.issue_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="px-2.5 py-1.5 text-xs font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      View
                    </Link>
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="px-2.5 py-1.5 text-xs font-medium text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="px-2.5 py-1.5 text-xs font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
