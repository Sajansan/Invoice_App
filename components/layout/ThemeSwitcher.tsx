'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';

const themes = [
  { id: 'slate', name: 'Slate', primary: '#3ECFB2', secondary: '#3B4F5C' },
  { id: 'lavender', name: 'Lavender', primary: '#3D2B7A', secondary: '#EAE6F8' },
  { id: 'charcoal', name: 'Charcoal', primary: '#FF6B6B', secondary: '#2C2C2E' },
  { id: 'sky', name: 'Sky', primary: '#4A90D9', secondary: '#FAFAF8' },
  { id: 'pale-mint', name: 'Pale Mint', primary: '#D4F0E8', secondary: '#1E2D2A' },
  { id: 'lilac', name: 'Lilac', primary: '#D8CCF0', secondary: '#1A1A2E' },
  { id: 'warm-ivory', name: 'Warm Ivory', primary: '#FAF6ED', secondary: '#2A6041' },
  { id: 'sky-lavender', name: 'Sky Lavender', primary: '#C8D8F0', secondary: '#B84A28' },
] as const;

export default function ThemeSwitcher() {
  const { theme, mode, setTheme, toggleMode } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      {/* Mode Toggle */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-xl bg-surface border border-white/5 hover:bg-white/5 text-foreground transition-all cursor-pointer shadow-sm"
        title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {mode === 'dark' ? (
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L5.121 5.121" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Theme Selection */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-surface border border-white/5 hover:bg-white/5 transition-all cursor-pointer shadow-sm"
        >
          <div 
            className="w-5 h-5 rounded-full border border-white/10" 
            style={{ 
              background: `linear-gradient(135deg, ${themes.find(t => t.id === theme)?.secondary} 50%, ${themes.find(t => t.id === theme)?.primary} 50%)` 
            }}
          />
          <svg className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-surface border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-40 overflow-hidden animate-slideUp">
              <div className="p-2 space-y-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all
                      ${theme === t.id ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-white/5'}
                    `}
                  >
                    <span className="font-medium">{t.name}</span>
                    <div 
                      className="w-4 h-4 rounded-full border border-white/10" 
                      style={{ 
                        background: `linear-gradient(135deg, ${t.secondary} 50%, ${t.primary} 50%)` 
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
