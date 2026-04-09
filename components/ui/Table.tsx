'use client';

import React from 'react';

/* ─── Wrapper ────────────────────────────────────────────────── */
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      <table className={`min-w-full divide-y divide-white/5 ${className}`}>
        {children}
      </table>
    </div>
  );
}

/* ─── Head ───────────────────────────────────────────────────── */
export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-background/20">{children}</thead>;
}

/* ─── Header Cell ────────────────────────────────────────────── */
export function TableHeaderCell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted ${className}`}
    >
      {children}
    </th>
  );
}

/* ─── Body ───────────────────────────────────────────────────── */
export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

/* ─── Row ────────────────────────────────────────────────────── */
export function TableRow({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={`transition-colors hover:bg-primary/5 ${className}`}>
      {children}
    </tr>
  );
}

/* ─── Cell ───────────────────────────────────────────────────── */
export function TableCell({
  children,
  className = '',
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={`px-5 py-4 text-sm text-gray-300 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}
