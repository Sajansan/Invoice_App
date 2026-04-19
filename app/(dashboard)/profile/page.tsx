'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Save, Loader2, Shield, Trash2, Camera, ExternalLink } from 'lucide-react';
import { ProfileSkeleton } from '@/components/ui/Skeleton';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: user.email || '',
          mobile: data.mobile || '',
          address: data.address || '',
        });
      } else {
        setFormData({
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          email: user.email || '',
          mobile: '',
          address: '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      // Simulate slightly longer load for smooth animation
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const field = id.replace('profile-', '');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          mobile: formData.mobile,
          address: formData.address,
        });

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/50">
        <div className="space-y-1">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary mb-2 uppercase tracking-widest">
            Account Settings
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight sm:text-5xl">
            Your Profile
          </h1>
          <p className="text-muted font-medium max-w-md">
            Manage your digital identity and account information. Personalize your experience across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex items-center gap-2 border-border/50 hover:bg-surface"
          >
            <ExternalLink className="w-4 h-4" />
            View Public Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Profile Preview */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <Card className="p-0 overflow-hidden border-none shadow-premium-lg bg-surface/40 backdrop-blur-xl group">
            {/* Visual Header */}
            <div className="h-24 bg-gradient-to-r from-primary/20 via-blue-500/10 to-purple-600/20 relative" />
            
            <div className="px-8 pb-8 -mt-12 relative flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-28 h-28 rounded-3xl bg-surface border-4 border-surface shadow-2xl flex items-center justify-center text-primary text-4xl font-black relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                   {formData.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                   <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors" />
                </div>
                <button className="absolute -bottom-1 -right-1 p-2 bg-primary text-white rounded-xl shadow-lg border-2 border-surface hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 space-y-1 w-full">
                <h2 className="text-2xl font-black text-foreground truncate px-4">
                  {(formData.first_name || formData.last_name) ? `${formData.first_name} ${formData.last_name}` : 'Setup your name'}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-muted font-medium bg-muted/5 py-1 px-3 rounded-full mx-auto w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active Account
                </div>
              </div>

              <div className="w-full mt-8 pt-8 border-t border-border/50 space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted group/item">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-muted group-hover/item:text-primary transition-colors shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Email Address</span>
                    <span className="truncate w-full font-semibold text-foreground/80">{user?.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted group/item">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-muted group-hover/item:text-primary transition-colors shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Phone Number</span>
                    <span className="font-semibold text-foreground/80">{formData.mobile || 'Not set'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted group/item">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-muted group-hover/item:text-primary transition-colors shadow-sm">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Account Security</span>
                    <span className="font-semibold text-foreground/80">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="p-6 rounded-2xl border border-dashed border-border/60 bg-surface/20 flex flex-col items-center text-center space-y-3">
             <p className="text-xs font-medium text-muted px-4">
               Your information is stored securely and never shared with third parties.
             </p>
             <button className="text-xs font-bold text-primary hover:underline">Read Privacy Policy</button>
          </div>
        </div>

        {/* Right Content: Edit Profile Form */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-8 sm:p-10 border-none shadow-premium bg-surface">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Personal Information</h2>
                <p className="text-sm text-muted font-medium">Update your name and primary contact details</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label htmlFor="profile-first_name" className="text-xs font-bold uppercase tracking-widest text-muted ml-0.5 flex items-center gap-2">
                    First Name
                  </label>
                  <Input
                    id="profile-first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="h-12 bg-surface/50 border-border/80 focus:border-primary px-4 rounded-xl font-semibold placeholder:font-normal placeholder:opacity-50"
                  />
                </div>
                <div className="space-y-2.5">
                  <label htmlFor="profile-last_name" className="text-xs font-bold uppercase tracking-widest text-muted ml-0.5 flex items-center gap-2">
                    Last Name
                  </label>
                  <Input
                    id="profile-last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="h-12 bg-surface/50 border-border/80 focus:border-primary px-4 rounded-xl font-semibold placeholder:font-normal placeholder:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted ml-0.5 opacity-60">
                  Email Address (Primary)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40" />
                  <Input
                    id="profile-email"
                    value={formData.email}
                    disabled
                    className="h-12 pl-11 bg-muted/5 opacity-80 cursor-not-allowed border-dashed border-border text-muted font-medium rounded-xl"
                  />
                </div>
                <p className="text-[10px] text-muted font-medium ml-1 flex items-center gap-1.5 leading-none">
                  <Shield className="w-3 h-3" /> Email cannot be changed for security reasons
                </p>
              </div>

              <div className="space-y-2.5">
                <label htmlFor="profile-mobile" className="text-xs font-bold uppercase tracking-widest text-muted ml-0.5">
                  Mobile Number
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <Input
                    id="profile-mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="+94 (77) 000-0000"
                    className="h-12 pl-11 bg-surface/50 border-border/80 focus:border-primary px-4 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label htmlFor="profile-address" className="text-xs font-bold uppercase tracking-widest text-muted ml-0.5">
                  Physical Address
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
                  <textarea
                    id="profile-address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your full business or personal address"
                    rows={4}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-surface/50 border border-border/80 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground font-semibold text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-6 border-t border-border/50 gap-4">
                <Button 
                  variant="outline"
                  onClick={fetchProfile}
                  disabled={saving}
                  className="rounded-xl border-border/50 h-12 px-6 font-bold"
                >
                  Discard Changes
                </Button>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  className="rounded-xl h-12 px-10 shadow-premium-primary min-w-[180px] font-black tracking-wide bg-primary group"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Danger zone - Refined */}
          <div className="p-10 rounded-3xl border border-red-500/10 bg-gradient-to-br from-red-500/[0.03] to-surface relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
               <Trash2 className="w-32 h-32 text-red-500" />
            </div>
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-lg">
                <div className="flex items-center gap-2 text-red-500">
                  <Trash2 className="w-5 h-5" />
                  <h2 className="text-xl font-black tracking-tight">Danger Zone</h2>
                </div>
                <p className="text-sm font-medium text-muted leading-relaxed">
                  Permanently delete your account and all associated data including invoices, client history, and settings. This action is <span className="text-red-500 font-bold">irreversible</span>.
                </p>
              </div>
              <Button 
                variant="danger" 
                size="md" 
                className="bg-transparent border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-none px-8 font-black rounded-xl h-12"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
