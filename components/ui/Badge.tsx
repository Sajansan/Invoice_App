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
    bg: 'bg-mint/10',
    text: 'text-mint',
    dot: 'bg-mint shadow-[0_0_8px_rgba(62,207,178,0.5)]',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  },
  overdue: {
    label: 'Overdue',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
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
