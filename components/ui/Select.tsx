'use client';

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export default function Select({
  label,
  options,
  placeholder = 'Select…',
  error,
  id,
  className = '',
  ...rest
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-foreground/80">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`
            block w-full rounded-xl border border-border bg-surface px-4 py-3
            text-sm text-foreground appearance-none
            transition-all duration-300
            focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none
            disabled:opacity-50
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs font-medium text-red-400 mt-1">{error}</p>}
    </div>
  );
}
