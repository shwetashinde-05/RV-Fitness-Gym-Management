import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  CreditCard,
  Dumbbell,
  Utensils,
  TrendingUp,
  CalendarCheck,
  User,
  LogOut,
  MapPin,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const memberNav = [
  { path: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/member/membership', label: 'My Membership', icon: Layers },
  { path: '/member/payments', label: 'Payments & Receipts', icon: CreditCard },
  { path: '/member/workout', label: 'My Workout Routine', icon: Dumbbell },
  { path: '/member/diet', label: 'My Nutrition Plan', icon: Utensils },
  { path: '/member/progress', label: 'My Body Progress', icon: TrendingUp },
  { path: '/member/attendance', label: 'Attendance Log', icon: CalendarCheck },
  { path: '/member/profile', label: 'My Profile', icon: User },
];

export default function MemberSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0F1218] border-r border-[#1E232E] transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E232E]">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 min-w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/20">
              RV
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-extrabold text-white tracking-wider text-base block">MEMBER PORTAL</span>
                <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> Narsobawadi
                </span>
              </div>
            )}
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 dark-sidebar">
          {memberNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-500/10'
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

        {/* Member Profile Footer */}
        <div className="p-3 border-t border-[#1E232E] bg-[#0B0E13] space-y-2">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
                  {user?.related_id ? user.related_id.slice(-4) : 'MB'}
                </div>
                <div className="leading-tight truncate">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Member'}</p>
                  <p className="text-[10px] text-purple-400 font-mono">{user?.related_id || 'Member ID'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400" title="Log out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
