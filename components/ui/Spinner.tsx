'use client';

import React from 'react';

export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-[3px] border-primary/10" />
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-[3px] border-transparent border-t-primary border-r-primary animate-spin" />
        <div className="absolute top-1 left-1 w-10 h-10 rounded-full border-[3px] border-transparent border-b-primary/40 border-l-primary/40 animate-spin-slow" />
      </div>
    </div>
  );
}
