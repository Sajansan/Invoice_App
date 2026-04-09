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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your client directory
          </p>
        </div>
        <Button onClick={openAdd} id="add-client-button">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </Button>
      </div>

      {/* Table or empty state */}
      {clients.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          title="No clients yet"
          description="Add your first client to start sending invoices."
          action={
            <Button onClick={openAdd} size="sm">
              Add Client
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium text-gray-900">
                  {client.name}
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {client.address || '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(client)}
                      className="px-2.5 py-1.5 text-xs font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
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

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClient ? 'Edit Client' : 'Add Client'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          <Input
            id="client-name"
            label="Name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            id="client-email"
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            id="client-address"
            label="Address"
            placeholder="123 Main St, City, Country"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
