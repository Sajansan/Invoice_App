'use client';

import React from 'react';
import type { InvoiceStatus } from '@/lib/types';

interface BadgeProps {
  status: InvoiceStatus;
}

const statusConfig: Record<
  InvoiceStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  paid: {
    label: 'Paid',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  overdue: {
    label: 'Overdue',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
};

export default function Badge({ status }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.bg} ${config.text}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
