import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Dumbbell, CalendarCheck, Activity, ArrowRight, UserCheck, Bell, Plus } from 'lucide-react';
import { api } from '../../api';
import { Card, StatCard, Badge, Button, LoadingSpinner } from '../../components/UIComponents';

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrainerDashboard()
      .then(res => res.success && setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading your trainer dashboard..." />;

  const stats = data?.stats || {};
  const members = data?.assignedMembers || [];
  const workouts = data?.workouts || [];
  const notices = data?.notices || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F1420] to-[#162032] rounded-3xl p-6 sm:p-8 text-white border border-[#1E293B] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mb-3 border border-blue-500/30">
            Coach Desk • {data?.trainer?.trainer_id || 'Coach'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, Coach <span className="text-blue-400">{data?.trainer?.full_name || 'Trainer'}</span>!
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {data?.trainer?.specialization ? `Specialization: ${data.trainer.specialization}. ` : ''}Review your assigned members and assign training splits.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('/trainer/workouts')}>
            Assign Workout
          </Button>
          <Button variant="outline" size="sm" className="text-white border-slate-700 hover:bg-slate-800" icon={Users} onClick={() => navigate('/trainer/members')}>
            My Members ({members.length})
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Members"
          value={stats.assignedMembersCount || 0}
          subtitle="Members under your coaching"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.totalAssignedActive || 0}
          subtitle="Currently active passes"
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="Today's Floor Presence"
          value={stats.todayPresentCount || 0}
          subtitle="Checked in at gym today"
          icon={CalendarCheck}
          color="amber"
        />
        <StatCard
          title="Custom Workouts"
          value={stats.activeWorkoutsCount || 0}
          subtitle="Active split routines"
          icon={Dumbbell}
          color="purple"
        />
      </div>

      {/* Tables: Assigned Members & Recent Workouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="My Assigned Members"
          subtitle="Only members assigned to your supervision"
          action={
            <button
              onClick={() => navigate('/trainer/members')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="pb-2.5">Member ID</th>
                  <th className="pb-2.5">Name</th>
                  <th className="pb-2.5">Phone</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.length > 0 ? (
                  members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-900 font-mono">{m.member_id}</td>
                      <td className="py-3 font-semibold text-slate-800">{m.full_name}</td>
                      <td className="py-3 text-slate-500">{m.phone}</td>
                      <td className="py-3 text-right"><Badge>{m.status}</Badge></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400">
                      No members assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Assigned Routines */}
        <Card
          title="Assigned Workout Schedules"
          subtitle="Routines you have assigned"
          action={
            <button
              onClick={() => navigate('/trainer/workouts')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              Manage Splits <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="space-y-3">
            {workouts.length > 0 ? (
              workouts.map((w) => (
                <div key={w.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{w.plan_name}</h4>
                    <span className="text-slate-500">Member: {w.member_id} • Goal: {w.goal}</span>
                  </div>
                  <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                    Active
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No workout routines created yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Gym Broadcast Notices */}
      {notices.length > 0 && (
        <Card title="Gym Announcements" subtitle="Notices from Administration">
          <div className="space-y-2 text-xs">
            {notices.map((n) => (
              <div key={n.id} className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">{n.title}</span>
                <p>{n.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
