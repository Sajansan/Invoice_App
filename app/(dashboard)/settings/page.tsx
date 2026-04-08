'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile section */}
      <Card className="p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="settings-name"
            label="Full Name"
            defaultValue="John Smith"
            placeholder="Your name"
          />
          <Input
            id="settings-email"
            label="Email"
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
        <div className="flex justify-end">
          <Button size="sm" id="save-profile-button">
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Invoice defaults */}
      <Card className="p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">
          Invoice Defaults
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          label="Default Notes"
          placeholder="Thank you for your business!"
        />
        <div className="flex justify-end">
          <Button size="sm" id="save-invoice-defaults-button">
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="p-6 border-red-200 space-y-4">
        <h2 className="text-base font-semibold text-red-600">Danger Zone</h2>
        <p className="text-sm text-gray-500">
          Permanently delete your account and all associated data.
        </p>
        <Button variant="danger" size="sm" id="delete-account-button">
          Delete Account
        </Button>
      </Card>
    </div>
  );
}
