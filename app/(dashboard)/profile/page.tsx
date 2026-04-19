'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';

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

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
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
        // Fallback to auth metadata if profile doesn't exist yet
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
      setLoading(false);
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Your Profile</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your personal information and account settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-6">
          <Card className="p-8 border-none shadow-premium text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-primary text-3xl font-black mb-4">
              {formData.first_name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <h2 className="text-xl font-black text-foreground truncate w-full">
              {formData.first_name} {formData.last_name}
            </h2>
            <p className="text-sm text-muted truncate w-full mb-6">{user?.email}</p>
            
            <div className="w-full pt-6 border-t border-border space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user?.email}</span>
              </div>
              {formData.mobile && (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <Phone className="w-4 h-4" />
                  <span>{formData.mobile}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2 space-y-8">
          <Card className="p-8 space-y-6 border-none shadow-premium">
            <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="profile-first_name" className="text-xs font-bold uppercase tracking-wider text-muted ml-1">
                  First Name
                </label>
                <Input
                  id="profile-first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="bg-surface/50 border-border/50 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="profile-last_name" className="text-xs font-bold uppercase tracking-wider text-muted ml-1">
                  Last Name
                </label>
                <Input
                  id="profile-last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Smith"
                  className="bg-surface/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">
                Email Address (View only)
              </label>
              <Input
                id="profile-email"
                value={formData.email}
                disabled
                className="bg-muted/10 opacity-70 cursor-not-allowed border-dashed"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-mobile" className="text-xs font-bold uppercase tracking-wider text-muted ml-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
                <Input
                  id="profile-mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="pl-10 bg-surface/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-address" className="text-xs font-bold uppercase tracking-wider text-muted ml-1">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted/50" />
                <textarea
                  id="profile-address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Business Ave, Suite 100"
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all outline-none text-foreground font-medium text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
                className="shadow-premium min-w-[160px] flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Danger zone */}
          <Card className="p-8 border-2 border-dashed border-red-500/10 bg-red-500/5 space-y-4">
            <h2 className="text-xl font-black text-red-500 tracking-tight">Account Safety</h2>
            <p className="text-sm font-medium text-muted">
              Once you delete your account, there is no going back. All your data will be permanently removed.
            </p>
            <div className="pt-2">
              <Button variant="danger" size="md" className="shadow-lg shadow-red-500/10">
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
