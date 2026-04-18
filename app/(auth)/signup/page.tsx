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
          console.error('Error creating profile:', profileError);
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
      title="Create Account" 
      subtitle="Join thousands of businesses managing their finances professionally with InvoiceGen."
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

        <p className="text-center text-muted font-bold pt-2">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary hover:underline underline-offset-4 decoration-2"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

