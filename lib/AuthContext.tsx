'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from './supabaseClient';
import toast from 'react-hot-toast';

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const SESSION_TIMESTAMP_KEY = 'sb-login-timestamp';

interface AuthContextType {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const signOut = async (isAutoLogout: boolean = false) => {
    try {
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
      await supabase.auth.signOut();
      setUser(null);
      
      if (isAutoLogout) {
        toast.error('Session expired. Please log in again.', { icon: '⏰' });
      }
      
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const checkSessionExpiry = () => {
    const loginTimestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    if (loginTimestamp) {
      const startTime = parseInt(loginTimestamp, 10);
      const currentTime = Date.now();
      
      if (currentTime - startTime > SESSION_TIMEOUT) {
        signOut(true);
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    // Initial session check
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session) {
          const expired = checkSessionExpiry();
          if (!expired && !localStorage.getItem(SESSION_TIMESTAMP_KEY)) {
            // Fallback for sessions that exist but lack a timestamp
            localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem(SESSION_TIMESTAMP_KEY);
      }
    });

    // Periodic check for session expiry
    const interval = setInterval(() => {
      if (localStorage.getItem(SESSION_TIMESTAMP_KEY)) {
        checkSessionExpiry();
      }
    }, 30000); // Check every 30 seconds for better responsiveness

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Check on every navigation
  useEffect(() => {
    if (user && pathname !== '/login') {
      checkSessionExpiry();
    }
  }, [pathname, user]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: () => signOut(false) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
