'use client';

import React from 'react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      {/* Spacer for mobile hamburger */}
      <div className="lg:hidden w-10" />

      {/* Page breadcrumb area – intentionally left flexible */}
      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          id="notifications-button"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-700">john@example.com</p>
          </div>
          <button
            className="px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
            id="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
