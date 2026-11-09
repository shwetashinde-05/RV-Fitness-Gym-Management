import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Utensils,
  TrendingUp,
  User,
  Bell,
  LogOut,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const trainerNav = [
  { path: '/trainer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trainer/members', label: 'Assigned Members', icon: Users },
  { path: '/trainer/workouts', label: 'Workout Plans', icon: Dumbbell },
  { path: '/trainer/diets', label: 'Diet Plans', icon: Utensils },
  { path: '/trainer/progress', label: 'Fitness Observations', icon: TrendingUp },
  { path: '/trainer/profile', label: 'Trainer Profile', icon: User },
  { path: '/trainer/notices', label: 'Notices', icon: Bell },
];

export default function TrainerSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0F1218] border-r border-[#1E232E] transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E232E]">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 min-w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
              TR
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-extrabold text-white tracking-wider text-base block">TRAINER PORTAL</span>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> RV FITNESS
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
          {trainerNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
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

        {/* Coach ID badge and Logout */}
        <div className="p-3 border-t border-[#1E232E] bg-[#0B0E13] space-y-2">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                  {user?.related_id || 'TR'}
                </div>
                <div className="leading-tight truncate">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Coach'}</p>
                  <p className="text-[10px] text-blue-400 font-mono">Trainer Role</p>
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
