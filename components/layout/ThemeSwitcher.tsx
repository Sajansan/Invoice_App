'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';

const themes = [
  { id: 'slate', name: 'Slate', primary: '#3ECFB2', secondary: '#3B4F5C' },
  { id: 'lavender', name: 'Lavender', primary: '#8b5cf6', secondary: '#4c1d95' },
  { id: 'charcoal', name: 'Charcoal', primary: '#f43f5e', secondary: '#4c0519' },
  { id: 'sky', name: 'Sky', primary: '#0ea5e9', secondary: '#0c4a6e' },
] as const;

export default function ThemeSwitcher() {
  const { theme, mode, setTheme, toggleMode } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      {/* Mode Toggle */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-xl bg-surface border border-border hover:bg-muted/10 text-foreground transition-all cursor-pointer shadow-premium active:scale-95"
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
          className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-border hover:bg-muted/10 transition-all cursor-pointer shadow-premium active:scale-95"
        >
          <div 
            className="w-5 h-5 rounded-full border border-border" 
            style={{ 
              background: `linear-gradient(135deg, ${themes.find(t => t.id === theme)?.secondary} 50%, ${themes.find(t => t.id === theme)?.primary} 50%)` 
            }}
          />
          <svg className={`w-4 h-4 text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-surface border border-border shadow-premium z-40 overflow-hidden animate-slideUp">
              <div className="p-2 space-y-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all
                      ${theme === t.id ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-muted/10'}
                    `}
                  >
                    <span className="font-medium">{t.name}</span>
                    <div 
                      className="w-4 h-4 rounded-full border border-border" 
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
