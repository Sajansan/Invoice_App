'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = '',
  ...rest
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-foreground/80"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          block w-full rounded-xl border border-border bg-surface px-4 py-3
          text-sm text-foreground placeholder:text-muted/60
          transition-all duration-300
          focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none
          disabled:opacity-50
          ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : ''}
          ${className}
        `}
        {...rest}
      />
      {error && <p className="text-xs font-medium text-red-400 mt-1">{error}</p>}
    </div>
  );
}
