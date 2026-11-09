import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const trainerTitles = {
  '/trainer/dashboard': 'Coach Overview',
  '/trainer/members': 'My Assigned Gym Members',
  '/trainer/workouts': 'Workout Schedules & Exercises',
  '/trainer/diets': 'Diet & Nutrition Prescriptions',
  '/trainer/progress': 'Member Fitness Observations',
  '/trainer/profile': 'My Trainer Profile',
  '/trainer/notices': 'Notices & Announcements'
};

export default function TrainerNavbar({ collapsed, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const title = trainerTitles[location.pathname] || 'Trainer Portal';

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 ${
        collapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            <span className="text-[11px] text-blue-600 font-bold">Assigned Coach: {user?.name} ({user?.related_id})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-900 font-semibold hidden sm:block">
            Public Website →
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
