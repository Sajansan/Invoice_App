'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import AuthLayout from '@/components/layout/AuthLayout';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/login&message=Email verified successfully! Please log in.`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile in the public profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              address: formData.address,
              mobile: formData.mobile,
            },
          ]);

        if (profileError) {
          console.error('Error creating profile row:', profileError);
          // We don't throw here to allow the user to still benefit from the account creation
          // They can update their profile later in the Profile tab
        }
      }

      toast.success('Account created! Please check your email for confirmation.', {
        duration: 6000,
      });
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={<><span className="text-primary">Create</span> Account</>} 
      subtitle="Join thousands of businesses managing their finances professionally with InvoiceGen."
      maxWidth="max-w-md"
    >


        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <label className="absolute -top-3 left-4 bg-background px-2 text-[10px] font-bold uppercase tracking-widest text-primary z-10 transition-colors group-focus-within:text-primary/70">
                First Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-transparent border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-medium placeholder:text-muted/30 text-sm"
                  placeholder="John"
                />
              </div>
            </div>
            <div className="relative group">
              <label className="absolute -top-3 left-4 bg-background px-2 text-[10px] font-bold uppercase tracking-widest text-primary z-10 transition-colors group-focus-within:text-primary/70">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-transparent border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-medium placeholder:text-muted/30 text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div className="relative group">
            <label className="absolute -top-3 left-4 bg-background px-2 text-[10px] font-bold uppercase tracking-widest text-primary z-10 transition-colors group-focus-within:text-primary/70">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-transparent border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-medium placeholder:text-muted/30 text-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="relative group">
            <label className="absolute -top-3 left-4 bg-background px-2 text-[10px] font-bold uppercase tracking-widest text-primary z-10 transition-colors group-focus-within:text-primary/70">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <input
                name="mobile"
                type="tel"
                required
                value={formData.mobile}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-transparent border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-medium placeholder:text-muted/30 text-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="relative group">
            <label className="absolute -top-3 left-4 bg-background px-2 text-[10px] font-bold uppercase tracking-widest text-primary z-10 transition-colors group-focus-within:text-primary/70">
              Address (Optional)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-5 text-muted group-focus-within:text-primary transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-transparent border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-medium placeholder:text-muted/30 text-sm resize-none"
                placeholder="123 Street Name, City"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <label className="absolute -top-3 left-4 bg-background px-2 text-[10px] font-bold uppercase tracking-widest text-primary z-10 transition-colors group-focus-within:text-primary/70">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-transparent border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-medium placeholder:text-muted/30 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="relative group">
              <label className="absolute -top-3 left-4 bg-background px-2 text-[10px] font-bold uppercase tracking-widest text-primary z-10 transition-colors group-focus-within:text-primary/70">
                Confirm
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-transparent border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-medium placeholder:text-muted/30 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-2xl bg-primary text-slate-950 text-lg font-black tracking-tight hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_10px_30px_-5px_rgba(14,165,233,0.4)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3 group mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
            ) : (
              <>
                Create Your Account
                <User className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

      <div className="relative py-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-background px-4 text-muted font-black tracking-widest">Or sign up with</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          type="button"
          onClick={async () => {
            try {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
              if (error) throw error;
            } catch (err: any) {
              toast.error(err.message || 'Failed to sign in with Google');
            }
          }}
          className="w-full flex items-center justify-center gap-3 py-4 bg-white dark:bg-surface border-2 border-border rounded-2xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all duration-300 cursor-pointer font-bold group/google text-foreground"
        >
          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full p-1 shadow-sm group-hover/google:scale-110 transition-transform duration-300">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <span>Sign up with Google</span>
        </button>
      </div>

      <p className="text-center text-muted font-bold pt-6">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary hover:underline underline-offset-4 decoration-2"
        >
          Sign In
        </Link>
      </p>
      </AuthLayout>
  );
}

