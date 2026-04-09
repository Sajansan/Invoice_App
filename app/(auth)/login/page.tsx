'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-muted text-sm font-medium">
            Sign in to manage your invoices and clients
          </p>
        </div>

        <Card className="p-8 shadow-xl border-t-4 border-t-primary">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-xs font-bold bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-background font-black tracking-tight hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(var(--primary),0.3)] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted font-medium">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-primary font-black hover:underline underline-offset-4 decoration-2"
            >
              Create Account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
