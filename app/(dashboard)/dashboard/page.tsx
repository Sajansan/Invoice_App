'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
import EmptyState from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabaseClient';
import type { Invoice, DashboardStats } from '@/lib/types';

/* ─── Stat card icon backgrounds ─────────────────────────────── */
const statCards = [
  {
    key: 'totalInvoices',
    label: 'Total Invoices',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: 'paid',
    label: 'Paid',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'pending',
    label: 'Pending',
    iconBg: 'bg-secondary/20',
    iconColor: 'text-primary',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'overdue',
    label: 'Overdue',
    iconBg: 'bg-destructive/20',
    iconColor: 'text-destructive',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    iconBg: 'bg-primary/30',
    iconColor: 'text-foreground',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalRevenue: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: invoices, error } = await supabase
          .from('invoices')
          .select('*, clients(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (invoices) {
          const now = new Date();
          const typedInvoices = invoices.map(inv => {
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

          const paid = typedInvoices.filter((i) => i.status === 'paid');
          const pending = typedInvoices.filter((i) => i.status === 'pending');
          const overdue = typedInvoices.filter((i) => i.status === 'overdue');
          const totalRevenue = paid.reduce(
            (sum: number, i: Invoice) => sum + (i.total || 0),
            0
          );

          setStats({
            totalInvoices: typedInvoices.length,
            paid: paid.length,
            pending: pending.length,
            overdue: overdue.length,
            totalRevenue,
          });

          setRecentInvoices(typedInvoices.slice(0, 5));
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) return <Spinner />;

  const statValues: Record<string, string | number> = {
    totalInvoices: stats.totalInvoices,
    paid: stats.paid,
    pending: stats.pending,
    overdue: stats.overdue,
    totalRevenue: formatCurrency(stats.totalRevenue),
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Overview of your invoicing activity
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Card key={card.key} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-black text-foreground tracking-tight">
                  {statValues[card.key]}
                </p>
              </div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl ${card.iconBg} ${card.iconColor}`}
              >
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Recent Invoices
          </h2>
          <Link
            href="/invoices"
            className="text-sm font-bold text-primary hover:text-primary/80 transition-all hover:underline decoration-2 underline-offset-4"
          >
            View all →
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="No invoices yet"
            description="Create your first invoice to see it here."
            action={
              <Link
                href="/create-invoice"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-background bg-primary rounded-lg hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(var(--primary),0.2)]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Invoice
              </Link>
            }
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Invoice</TableHeaderCell>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="font-bold text-primary hover:text-primary/80 hover:underline transition-all"
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
                  <TableCell className="text-muted">
                    {new Date(inv.issue_date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
