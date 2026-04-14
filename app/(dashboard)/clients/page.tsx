'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
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
import type { Client } from '@/lib/types';

const emptyClient = { name: '', email: '', address: '' };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyClient);
  const [saving, setSaving] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setClients(data as Client[]);
    } catch (err) {
      console.error('Fetch clients error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  /* ─── Open modal ──────────────────────────────────────────── */
  function openAdd() {
    setEditingClient(null);
    setForm(emptyClient);
    setModalOpen(true);
  }

  function openEdit(client: Client) {
    setEditingClient(client);
    setForm({ name: client.name, email: client.email || '', address: client.address || '' });
    setModalOpen(true);
  }

  /* ─── Save (create / update) ─────────────────────────────── */
  async function handleSave() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update({ name: form.name, email: form.email, address: form.address })
          .eq('id', editingClient.id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clients').insert([
          { name: form.name, email: form.email, address: form.address, user_id: user.id },
        ]);
        if (error) throw error;
      }
      setModalOpen(false);
      await fetchClients();
    } catch (err) {
      console.error('Save client error:', err);
    } finally {
      setSaving(false);
    }
  }

  /* ─── Delete ─────────────────────────────────────────────── */
  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this client?')) return;
    await supabase.from('clients').delete().eq('id', id);
    await fetchClients();
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your client directory and contact information
          </p>
        </div>
        <Button onClick={openAdd} id="add-client-button" className="shadow-premium active:scale-95">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </Button>
      </div>

      {/* Table or empty state */}
      {clients.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-10 h-10 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          title="No clients yet"
          description="Add your first client to start sending invoices."
          action={
            <Button onClick={openAdd} size="md">
              Add Client
            </Button>
          }
        />
      ) : (
        <div className="bg-surface rounded-2xl border border-border shadow-premium overflow-hidden">
          <Table>
            <TableHead>
              <TableRow className="bg-muted/5 border-b border-border">
                <TableHeaderCell className="text-[11px] uppercase tracking-wider font-black text-muted">Name</TableHeaderCell>
                <TableHeaderCell className="text-[11px] uppercase tracking-wider font-black text-muted">Email</TableHeaderCell>
                <TableHeaderCell className="text-[11px] uppercase tracking-wider font-black text-muted">Address</TableHeaderCell>
                <TableHeaderCell className="text-right text-[11px] uppercase tracking-wider font-black text-muted">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="font-bold text-foreground">
                    {client.name}
                  </TableCell>
                  <TableCell className="text-muted font-medium">{client.email}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted font-medium">
                    {client.address || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(client)}
                        className="px-3 py-1.5 text-xs font-bold text-muted rounded-xl hover:bg-muted/10 hover:text-foreground transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClient ? 'Edit Client' : 'Add Client'}
        description={editingClient ? 'Update the details for this client.' : 'Enter the information below to add a new client to your directory.'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <Input
              id="client-name"
              label="FullName"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              id="client-email"
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              id="client-address"
              label="Billing Address"
              placeholder="123 Main St, City, Country"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="min-w-[120px]">
              {editingClient ? 'Update Client' : 'Add Client'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
