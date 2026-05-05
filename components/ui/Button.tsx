'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-background hover:brightness-105 active:scale-95 shadow-[0_4px_16px_rgba(var(--primary),0.2)] font-bold',
  secondary:
    'bg-surface text-foreground border border-border hover:bg-muted/10 active:scale-95 shadow-sm',
  danger:
    'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm',
  ghost:
    'bg-transparent text-muted hover:bg-muted/10 hover:text-foreground active:scale-95',
  outline:
    'bg-transparent text-foreground border-2 border-border hover:border-primary/50 hover:bg-primary/5 active:scale-95 transition-all',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};


export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-bold
        transition-all duration-300 ease-in-out
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
