'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'slate' | 'lavender' | 'charcoal' | 'sky';
type Mode = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('sky');
  const [mode, setMode] = useState<Mode>('light');

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('invoice-app-theme') as Theme;
    const savedMode = localStorage.getItem('invoice-app-mode') as Mode;
    if (savedTheme) setTheme(savedTheme);
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    // Sync with DOM
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);

    // Save to localStorage
    localStorage.setItem('invoice-app-theme', theme);
    localStorage.setItem('invoice-app-mode', mode);
  }, [theme, mode]);


  const toggleMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
