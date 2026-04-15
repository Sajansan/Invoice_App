'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-muted/10 rounded-lg ${className}`} />
  );
}

export function SkeletonCircle({ size = 'w-10 h-10', className = '' }: { size?: string, className?: string }) {
  return (
    <div className={`animate-pulse bg-muted/10 rounded-full ${size} ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 bg-surface border border-border rounded-2xl shadow-premium flex items-start justify-between">
            <div className="space-y-3 w-full">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
            <SkeletonCircle className="flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="p-5 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-4 w-1/2">
                   <SkeletonCircle size="w-8 h-8" />
                   <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
