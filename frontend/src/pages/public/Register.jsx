import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Select, Textarea } from '../../components/UIComponents';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    gender: 'Male',
    address: 'Narsobawadi, Maharashtra'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      setError('Please fill all mandatory fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await register(formData);
      navigate('/member/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20 mb-4">
            RV
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Join RV FITNESS</h2>
          <p className="text-xs text-slate-400 mt-1">
            Register your member account online and receive immediate portal access.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800 shadow-xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 min-w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-xs text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 min-w-4" />
            <span>Registration automatically assigns your unique Member ID and links you to a trainer.</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <Input
              label="Full Name *"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
              labelClassName="text-slate-400"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number *"
                placeholder="+91 98000 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                labelClassName="text-slate-400"
                required
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                labelClassName="text-slate-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Create Password *"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                labelClassName="text-slate-400"
                required
              />
              <Select
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white"
                labelClassName="text-slate-400"
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
            </div>

            <Textarea
              label="Residential Address"
              placeholder="Your address in Narsobawadi / Shirol"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
              labelClassName="text-slate-400"
            />

            <div className="pt-2">
              <Button type="submit" variant="accent" className="w-full" loading={loading} icon={UserPlus}>
                Register & Enter Member Portal
              </Button>
            </div>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300">
              Sign In to Your Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
