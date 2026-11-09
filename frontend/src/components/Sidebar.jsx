import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Layers,
  UserPlus,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  Utensils,
  TrendingUp,
  Bell,
  BarChart3,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  LogOut,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/members', label: 'Members', icon: Users },
  { path: '/admin/trainers', label: 'Trainers', icon: UserCheck },
  { path: '/admin/membership-plans', label: 'Membership Plans', icon: Layers },
  { path: '/admin/assign-membership', label: 'Assign Membership', icon: UserPlus },
  { path: '/admin/payments', label: 'Payments & Invoices', icon: CreditCard },
  { path: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
  { path: '/admin/workout-plans', label: 'Workout Plans', icon: Dumbbell },
  { path: '/admin/diet-plans', label: 'Diet Plans', icon: Utensils },
  { path: '/admin/progress', label: 'Progress Tracking', icon: TrendingUp },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { path: '/admin/users', label: 'User Roles & Logins', icon: ShieldCheck },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0F1218] border-r border-[#1E232E] transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E232E]">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 min-w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              RV
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-extrabold text-white tracking-wider text-base block">ADMIN PORTAL</span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> Narsobawadi
                </span>
              </div>
            )}
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 dark-sidebar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-[#1A202C]'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 min-w-5 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile / Status */}
        <div className="p-3 border-t border-[#1E232E] bg-[#0B0E13] space-y-2">
          {!collapsed ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    ADM
                  </div>
                  <div className="leading-tight truncate">
                    <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                    <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" /> Super Admin
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                <Link to="/" className="text-slate-400 hover:text-emerald-400 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Public Site
                </Link>
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="hidden lg:flex p-1 rounded-md text-slate-500 hover:text-white"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-400" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex p-1 rounded-md text-slate-500 hover:text-white"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
