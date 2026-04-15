'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn pb-10">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile section */}
      <Card className="p-8 space-y-6 border-none shadow-premium">
        <h2 className="text-xl font-black text-foreground tracking-tight">Profile Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            id="settings-name"
            label="Full Name"
            defaultValue="John Smith"
            placeholder="Your name"
          />
          <Input
            id="settings-email"
            label="Email Address"
            type="email"
            defaultValue="john@example.com"
            placeholder="you@example.com"
          />
        </div>
        <Input
          id="settings-company"
          label="Company Name"
          defaultValue="Acme Inc."
          placeholder="Your company"
        />
        <div className="flex justify-end pt-2">
          <Button size="md" id="save-profile-button" className="shadow-premium min-w-[140px]">
            Save Profile
          </Button>
        </div>
      </Card>

      {/* Invoice defaults */}
      <Card className="p-8 space-y-6 border-none shadow-premium">
        <h2 className="text-xl font-black text-foreground tracking-tight">
          Invoice Defaults
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            id="settings-currency"
            label="Currency"
            defaultValue="USD"
            placeholder="USD"
          />
          <Input
            id="settings-tax"
            label="Default Tax Rate (%)"
            type="number"
            defaultValue="0"
            min={0}
            max={100}
          />
        </div>
        <Input
          id="settings-notes"
          label="Default Footer Notes"
          placeholder="Thank you for your business!"
        />
        <div className="flex justify-end pt-2">
          <Button size="md" id="save-invoice-defaults-button" className="shadow-premium min-w-[140px]">
            Save Defaults
          </Button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="p-8 border-2 border-dashed border-red-500/20 bg-red-500/5 space-y-4">
        <h2 className="text-xl font-black text-red-500 tracking-tight">Danger Zone</h2>
        <p className="text-sm font-medium text-muted">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <div className="pt-2">
          <Button variant="danger" size="md" id="delete-account-button" className="shadow-lg shadow-red-500/20">
            Delete My Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
