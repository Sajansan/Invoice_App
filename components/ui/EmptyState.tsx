'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface/30 rounded-3xl border-2 border-dashed border-white/5">
      {icon && (
        <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-slate/30 text-mint mb-6 shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 mb-8 text-center max-w-sm">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
