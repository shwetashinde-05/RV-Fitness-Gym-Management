import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/UIComponents';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectByRole = (role) => {
    if (role === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (role === 'trainer') navigate('/trainer/dashboard', { replace: true });
    else if (role === 'member') navigate('/member/dashboard', { replace: true });
    else navigate('/', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20 mb-4">
            RV
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Portal Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your dedicated RV FITNESS dashboard based on your role.
          </p>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800 shadow-xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 min-w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <Input
              label="Email Address *"
              type="email"
              placeholder="e.g. admin@rvfitness.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
              labelClassName="text-slate-400"
              required
            />

            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
              labelClassName="text-slate-400"
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full" loading={loading} icon={LogIn}>
                Sign In to Portal
              </Button>
            </div>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800">
            Don’t have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300">
              Register as New Member →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
