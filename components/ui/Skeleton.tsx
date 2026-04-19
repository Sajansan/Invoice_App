'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-muted/20 rounded-lg ${className}`} />
  );
}

export function SkeletonCircle({ size = 'w-10 h-10', className = '' }: { size?: string, className?: string }) {
  return (
    <div className={`animate-pulse bg-muted/20 rounded-full ${size} ${className}`} />
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

export function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
      {/* Header Skeleton */}
      <div className="space-y-3 pb-2 border-b border-border/50">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Card Skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface/40 border border-border rounded-2xl shadow-premium overflow-hidden">
            <div className="h-24 bg-muted/10 w-full" />
            <div className="px-8 pb-8 -mt-12 flex flex-col items-center">
              <SkeletonCircle size="w-28 h-28" className="border-4 border-surface shadow-xl" />
              <div className="mt-6 flex flex-col items-center gap-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="w-full mt-8 pt-8 border-t border-border space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <SkeletonCircle size="w-8 h-8" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-2 w-16 opacity-50" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-2xl border border-dashed border-border" />
        </div>

        {/* Right Form Skeleton */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 sm:p-10 bg-surface border border-border rounded-3xl shadow-premium space-y-10">
            <div className="flex items-center gap-4">
              <SkeletonCircle size="w-12 h-12" />
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>

              <div className="flex justify-end pt-6 border-t border-border/50">
                <Skeleton className="h-12 w-48 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
