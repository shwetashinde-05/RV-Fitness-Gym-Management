import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Menu, X, LogIn, UserPlus, Shield, Dumbbell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../UIComponents';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Membership Plans', path: '/plans' },
    { name: 'Trainers', path: '/trainers-public' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'trainer') return '/trainer/dashboard';
    if (user.role === 'member') return '/member/dashboard';
    return '/admin/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              RV
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-wider block text-white">
                RV <span className="text-emerald-400">FITNESS</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> Narsobawadi, MH
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-colors ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-slate-700 hover:bg-slate-800"
                  onClick={() => navigate(getDashboardPath())}
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                  {user.role === 'admin' ? 'Admin Portal' : user.role === 'trainer' ? 'Trainer Portal' : 'Member Portal'}
                </Button>
                <button
                  onClick={logout}
                  className="text-xs text-slate-400 hover:text-rose-400 font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                    icon={LogIn}
                  >
                    Portal Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent" size="sm" icon={UserPlus}>
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0B0E14] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {item.name}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <Button
                variant="primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardPath());
                }}
              >
                Go to {user.role.toUpperCase()} Portal
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-white border-slate-700">
                    Portal Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="accent" className="w-full">
                    Join RV FITNESS
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
