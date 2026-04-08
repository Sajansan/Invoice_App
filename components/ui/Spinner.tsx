'use client';

import React from 'react';

export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-600 animate-spin" />
      </div>
    </div>
  );
}
