"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AuthLayout from "@/components/layout/AuthLayout";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    const error = searchParams.get("error");

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
      toast.success("Successfully signed in!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
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
      title={
        <>
          <span className="text-primary">Welcome</span> Back
        </>
      }
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
              type={showPassword ? "text" : "password"}
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
            <Link
              href="#"
              className="text-sm font-bold text-muted hover:text-primary transiton-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-primary text-slate-950 text-lg font-black tracking-tight hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_10px_30px_-5px_rgba(14,165,233,0.4)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
          ) : (
            <>
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Login
            </>
          )}
        </button>
      </form>

      <div className="relative py-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-background px-4 text-muted font-black tracking-widest">
            Or
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="w-full flex items-center justify-center gap-3 py-4 bg-white dark:bg-surface border-2 border-border rounded-2xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all duration-300 cursor-pointer font-bold group/google text-foreground"
        >
          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full p-1 shadow-sm group-hover/google:scale-110 transition-transform duration-300">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          <span>Continue with Google</span>
        </button>
      </div>

      <p className="text-center text-muted font-bold pt-4">
        New here?{" "}
        <Link
          href="/signup"
          className="text-primary hover:underline underline-offset-4 decoration-2"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
