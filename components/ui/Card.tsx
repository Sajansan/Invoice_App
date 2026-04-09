'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-surface rounded-2xl border border-white/5
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        transition-all duration-300
        hover:border-mint/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.2)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
