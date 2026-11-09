import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle,
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { api } from '../api';
import {
  Button,
  Input,
  Textarea,
  Card,
  LoadingSpinner
} from '../components/UIComponents';

export default function Settings() {
  const [settings, setSettings] = useState({
    gym_name: 'RV FITNESS',
    tagline: 'The Ultimate Fitness & Strength Center',
    address: 'Near Datta Mandir, Narsobawadi, Tal. Shirol, Dist. Kolhapur, Maharashtra 416104, India',
    phone: '+91 98230 12345 / +91 94220 54321',
    email: 'contact@rvfitnessnarsobawadi.in',
    currency: '₹',
    opening_hours: 'Mon-Sat: 5:30 AM - 10:00 PM | Sun: 6:00 AM - 1:00 PM',
    admin_name: 'Gym Administrator',
    admin_email: 'admin@rvfitness.in'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateSettings(settings);
      if (res.success) {
        setToastMessage('Gym settings updated successfully!');
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading gym settings..." />;
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gym & System Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure business details, operational timings, and invoice contact information for RV FITNESS.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Branding */}
        <Card title="Gym Identity & Location" subtitle="Appears on all printed receipts, invoices, and banners">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Gym Business Name *"
              value={settings.gym_name}
              onChange={(e) => setSettings({ ...settings, gym_name: e.target.value })}
              required
            />
            <Input
              label="Tagline / Slogan"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Physical Address (Invoices & Receipts) *"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <Input
              label="Phone Number(s) *"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              required
            />
            <Input
              label="Official Email *"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              required
            />
            <Input
              label="Currency Symbol"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            />
          </div>
        </Card>

        {/* Operating Hours & Preferences */}
        <Card title="Operations & Administration" subtitle="Gym schedule and security credentials">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Gym Working Hours"
              value={settings.opening_hours}
              onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
            />
            <Input
              label="Admin Full Name"
              value={settings.admin_name}
              onChange={(e) => setSettings({ ...settings, admin_name: e.target.value })}
            />
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 min-w-5" />
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-800 block">PostgreSQL Database Connection</span>
              <p className="mt-0.5">
                Database: <code className="bg-white px-1.5 py-0.5 rounded border text-slate-800 font-mono">rv_fitness_db</code> on port <code className="bg-white px-1.5 py-0.5 rounded border text-slate-800 font-mono">5433</code>.
                All records, payments, and member profiles are safeguarded with transactional consistency.
              </p>
            </div>
          </div>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" icon={Save} loading={saving}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
