import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Award, Briefcase, Save, CheckCircle } from 'lucide-react';
import { api } from '../../api';
import { Card, Button, Input, Textarea, LoadingSpinner } from '../../components/UIComponents';

export default function TrainerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.getTrainerProfile()
      .then(res => res.success && setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateTrainerProfile(profile);
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

  if (loading) return <LoadingSpinner text="Loading coach profile..." />;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trainer Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage your public trainer credentials and contact info.</p>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl space-y-6 text-xs">
        <Card title="Coach Information" subtitle={`Trainer ID: ${profile?.trainer_id}`}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={profile?.full_name || ''} disabled className="bg-slate-100" />
            <Input
              label="Specialization"
              value={profile?.specialization || ''}
              onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Phone Number"
              value={profile?.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={profile?.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Years of Experience"
              value={profile?.experience || ''}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Coach Biography"
              value={profile?.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" variant="primary" icon={Save} loading={saving}>
              Save Profile
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
