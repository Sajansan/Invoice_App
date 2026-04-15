'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton';
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
import CreateInvoiceForm from '@/components/forms/CreateInvoiceForm';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
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

  if (loading && invoices.length === 0) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="p-5 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-4 w-1/4">
                   <SkeletonCircle size="w-8 h-8" />
                   <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted">
            Track and manage all your invoices in one place
          </p>
        </div>
        <Button 
          id="create-invoice-button" 
          onClick={() => setIsCreateModalOpen(true)}
          className="shadow-premium active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </Button>
      </div>

      {/* Table or empty state */}
      {invoices.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-10 h-10 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="No invoices yet"
          description="Create your first invoice to start tracking payments."
          action={
            <Button size="md" onClick={() => setIsCreateModalOpen(true)}>Create Invoice</Button>
          }
        />
      ) : (
        <div className="bg-surface rounded-2xl border border-border shadow-premium overflow-hidden">
          <Table>
            <TableHead>
              <TableRow className="bg-muted/5 border-b border-border">
                <TableHeaderCell className="text-[11px] uppercase tracking-wider font-black text-muted">Invoice #</TableHeaderCell>
                <TableHeaderCell className="text-[11px] uppercase tracking-wider font-black text-muted">Client</TableHeaderCell>
                <TableHeaderCell className="text-[11px] uppercase tracking-wider font-black text-muted">Status</TableHeaderCell>
                <TableHeaderCell className="text-[11px] uppercase tracking-wider font-black text-muted">Total</TableHeaderCell>
                <TableHeaderCell className="text-[11px] uppercase tracking-wider font-black text-muted">Date</TableHeaderCell>
                <TableHeaderCell className="text-right text-[11px] uppercase tracking-wider font-black text-muted">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-muted/5 transition-colors">
                  <TableCell>
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="font-bold text-primary hover:underline transition-all"
                    >
                      {inv.invoice_number}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{inv.clients?.name || '—'}</TableCell>
                  <TableCell>
                    <Badge status={inv.status} />
                  </TableCell>
                  <TableCell className="font-black text-foreground">
                    {formatCurrency(inv.total)}
                  </TableCell>
                  <TableCell className="text-muted font-medium">
                    {new Date(inv.issue_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="px-3 py-1.5 text-xs font-bold text-muted rounded-xl hover:bg-muted/10 hover:text-foreground transition-all"
                      >
                        View
                      </Link>
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkPaid(inv.id)}
                          className="px-3 py-1.5 text-xs font-bold text-emerald-500 rounded-xl hover:bg-emerald-500/10 transition-all cursor-pointer"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="px-3 py-1.5 text-xs font-bold text-red-500 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Invoice"
        description="Enter the details below to generate a professional invoice for your client."
      >
        <CreateInvoiceForm 
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchInvoices();
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
