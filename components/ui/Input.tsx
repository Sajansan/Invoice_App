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
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-bold text-foreground/70 tracking-tight px-0.5"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          block w-full rounded-xl border border-border bg-surface px-4 py-2.5
          text-sm text-foreground placeholder:text-muted/50
          transition-all duration-300
          hover:border-primary/30
          focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none
          disabled:opacity-50 disabled:bg-muted/10
          ${error ? 'border-red-500 font-medium focus:border-red-500 focus:ring-red-500/10' : ''}
          ${className}
        `}
        {...rest}
      />
      {error && <p className="text-xs font-semibold text-red-500 mt-1 ml-1">{error}</p>}
    </div>

  );
}
