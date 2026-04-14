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
        bg-surface rounded-2xl border border-border
        shadow-premium
        transition-all duration-300
        hover:border-primary/20
        ${className}
      `}
    >
      {children}
    </div>
  );
}
