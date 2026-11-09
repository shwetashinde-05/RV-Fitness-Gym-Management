import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Save, CheckCircle, Shield } from 'lucide-react';
import { api } from '../../api';
import { Card, Button, Input, Textarea, LoadingSpinner } from '../../components/UIComponents';

export default function MemberProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.getMemberProfile()
      .then(res => res.success && setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateMemberProfile(profile);
      if (res.success) {
        setToast('Profile updated successfully!');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your profile..." />;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-purple-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile & Contact</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage your phone number, emergency contacts, and residential address.</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6 text-xs">
        <Card title="Personal Details" subtitle={`Member ID: ${profile?.member_id}`}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={profile?.full_name || ''} disabled className="bg-slate-100" />
            <Input label="Member ID" value={profile?.member_id || ''} disabled className="bg-slate-100 font-mono font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Phone Number *"
              value={profile?.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              value={profile?.email || ''}
              disabled
              className="bg-slate-100"
            />
          </div>

          <div className="mt-4">
            <Input
              label="Emergency Contact Phone"
              placeholder="+91 98234 00000 (Parent/Spouse)"
              value={profile?.emergency_contact || ''}
              onChange={(e) => setProfile({ ...profile, emergency_contact: e.target.value })}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Residential Address"
              value={profile?.address || ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" variant="primary" icon={Save} loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
