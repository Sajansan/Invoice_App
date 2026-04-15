'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email || null);
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="hidden lg:flex sticky top-0 z-20 items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-xl border-b border-border">
      {/* Page breadcrumb area – intentionally left flexible */}
      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Theme & Mode Switcher */}
        <ThemeSwitcher />

        <div className="h-6 w-px bg-border mx-1" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground/80">{email || 'Loading...'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-bold text-muted rounded-lg hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer active:scale-95"
            id="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
