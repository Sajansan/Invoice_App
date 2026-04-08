'use client';

import React from 'react';

/* ─── Wrapper ────────────────────────────────────────────────── */
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <table className={`min-w-full divide-y divide-gray-200/80 ${className}`}>
        {children}
      </table>
    </div>
  );
}

/* ─── Head ───────────────────────────────────────────────────── */
export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-50/80">{children}</thead>;
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
      className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${className}`}
    >
      {children}
    </th>
  );
}

/* ─── Body ───────────────────────────────────────────────────── */
export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
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
    <tr className={`transition-colors hover:bg-gray-50/60 ${className}`}>
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
    <td colSpan={colSpan} className={`px-5 py-4 text-sm text-gray-700 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}
