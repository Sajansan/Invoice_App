'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import AuthLayout from '@/components/layout/AuthLayout';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get('message');
    const error = searchParams.get('error');

    if (message) {
      toast.success(message, { duration: 6000 });
    }
    if (error) {
      toast.error(error, { duration: 6000 });
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Successfully signed in!');
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your credentials to access your account and manage your invoices."
    >
      <form onSubmit={handleLogin} className="space-y-7">
        <div className="relative group">
          <label className="absolute -top-3 left-4 bg-background px-2 text-[11px] font-bold uppercase tracking-widest text-primary z-10 transition-colors group-focus-within:text-primary/70">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-transparent border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-medium placeholder:text-muted/30"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className="relative group">
          <label className="absolute -top-3 left-4 bg-background px-2 text-[11px] font-bold uppercase tracking-widest text-primary z-10 transition-colors group-focus-within:text-primary/70">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-transparent border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-medium placeholder:text-muted/30"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors p-1 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <Link href="#" className="text-sm font-bold text-muted hover:text-primary transiton-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-primary text-slate-950 text-lg font-black tracking-tight hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_10px_30px_-5px_rgba(14,165,233,0.4)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
          ) : (
            <>
              Login to Dashboard
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted font-black tracking-widest">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-3 py-4 bg-surface/50 border-2 border-border rounded-2xl hover:bg-surface hover:border-primary/30 transition-all cursor-pointer font-bold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-2.108 4.088-1.036.792-2.612 1.564-5.732 1.564-5.176 0-9.264-4.14-9.264-9.264s4.088-9.264 9.264-9.264c2.72 0 4.8 1.048 6.48 2.64l2.32-2.32c-2.436-2.28-5.584-3.64-8.8-3.64-7.72 0-14 6.28-14 14s6.28 14 14 14c4.14 0 7.28-1.352 9.6-3.8 2.4-2.4 3.168-5.736 3.168-8.48 0-.816-.072-1.576-.2-2.304h-12.568z"/>
            </svg>
            Google
          </button>
          <button 
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center gap-3 py-4 bg-surface/50 border-2 border-border rounded-2xl hover:bg-surface hover:border-primary/30 transition-all cursor-pointer font-bold text-foreground"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="text-center text-muted font-bold pt-4">
          New here?{' '}
          <Link
            href="/signup"
            className="text-primary hover:underline underline-offset-4 decoration-2"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

