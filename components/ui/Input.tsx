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
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5
          text-sm text-gray-900 placeholder:text-gray-400
          transition-all duration-200
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
