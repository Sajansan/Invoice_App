'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-mint text-[#0a0e12] hover:bg-mint/90 focus-visible:ring-mint shadow-[0_4px_16px_rgba(62,207,178,0.2)] font-bold',
  secondary:
    'bg-slate text-white border border-white/10 hover:bg-slate/80 focus-visible:ring-slate-500 shadow-sm',
  danger:
    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-sm',
  ghost:
    'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white focus-visible:ring-gray-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
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
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
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
