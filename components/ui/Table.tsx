'use client';

import React from 'react';

/* ─── Wrapper ────────────────────────────────────────────────── */
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-border/50">
        {children}
      </table>
    </div>
  );
}

/* ─── Head ───────────────────────────────────────────────────── */
export function TableHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <thead className={`bg-muted/5 ${className}`}>{children}</thead>;
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
      className={`px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.1em] text-muted/80 ${className}`}
    >
      {children}
    </th>
  );
}

/* ─── Body ───────────────────────────────────────────────────── */
export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border/50 bg-transparent">{children}</tbody>;
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
    <tr className={`transition-colors hover:bg-muted/5 ${className}`}>
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
    <td colSpan={colSpan} className={`px-6 py-5 text-sm text-foreground font-medium whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}

