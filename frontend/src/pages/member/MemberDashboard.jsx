import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  Dumbbell,
  Utensils,
  TrendingUp,
  CalendarCheck,
  Clock,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  CheckCircle,
  Phone
} from 'lucide-react';
import { api } from '../../api';
import { Card, StatCard, Badge, Button, LoadingSpinner } from '../../components/UIComponents';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMemberDashboard()
      .then(res => res.success && setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading your personal fitness hub..." />;

  const member = data?.member || {};
  const activePlan = data?.activeMembership || null;
  const trainer = data?.trainer || null;
  const workout = data?.workout || null;
  const diet = data?.diet || null;
  const progress = data?.latestProgress || null;
  const daysAttended = data?.monthlyAttendanceCount || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F1420] to-[#1E1B2E] rounded-3xl p-6 sm:p-8 text-white border border-[#2D2845] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-3 border border-purple-500/30">
            Member Desk • {member.member_id || 'Member'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, <span className="text-purple-400">{member.full_name || 'Member'}</span>!
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Track your workout split, daily nutrition targets, and membership subscription validity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button variant="accent" size="sm" icon={Dumbbell} onClick={() => navigate('/member/workout')}>
            View Today's Workout
          </Button>
          <Button variant="outline" size="sm" className="text-white border-slate-700 hover:bg-slate-800" icon={Layers} onClick={() => navigate('/member/membership')}>
            Membership Info
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Days remaining */}
        <StatCard
          title="Membership Validity"
          value={activePlan ? `${activePlan.daysRemaining} Days` : 'Expired'}
          subtitle={activePlan ? `Expires: ${activePlan.end_date}` : 'Please renew pass'}
          icon={Clock}
          color={activePlan && activePlan.daysRemaining > 7 ? 'emerald' : 'rose'}
        />

        {/* Days attended */}
        <StatCard
          title="Monthly Attendance"
          value={`${daysAttended} Days`}
          subtitle="Workout check-ins this month"
          icon={CalendarCheck}
          color="blue"
        />

        {/* Latest weight */}
        <StatCard
          title="Current Weight"
          value={progress ? `${progress.weight} kg` : 'Not recorded'}
          subtitle={progress ? `Recorded: ${progress.record_date}` : 'Log measurement'}
          icon={TrendingUp}
          color="purple"
        />

        {/* Calorie target */}
        <StatCard
          title="Daily Calorie Goal"
          value={diet ? `${diet.calorie_target} kcal` : 'Not assigned'}
          subtitle={diet ? "Target energy balance" : "Consult your trainer"}
          icon={Flame}
          color="amber"
        />
      </div>

      {/* Main Grid: Current Membership, Assigned Trainer & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Plan Card */}
        <Card title="Current Subscription Package">
          {activePlan ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{activePlan.plan_name}</h4>
                  <span className="text-slate-500 font-mono">Status: {activePlan.status}</span>
                </div>
                <Badge>{activePlan.status}</Badge>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-700 font-bold uppercase">Time Remaining</span>
                  <p className="text-2xl font-black text-emerald-800">{activePlan.daysRemaining} Days</p>
                </div>
                <div className="text-right text-[11px] text-emerald-700">
                  <p>Valid from: <b>{activePlan.start_date}</b></p>
                  <p>Valid till: <b>{activePlan.end_date}</b></p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link to="/member/membership">
                  <Button variant="outline" size="sm">View Plan Details →</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800">No active membership found</p>
              <p className="mt-1">Contact the front desk or renew your package online.</p>
              <div className="mt-4">
                <Link to="/member/membership">
                  <Button size="sm">Renew Membership</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* Assigned Trainer */}
        <Card title="Assigned Personal Coach">
          {trainer ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                  {trainer.full_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{trainer.full_name}</h4>
                  <span className="text-xs text-blue-600 font-semibold">{trainer.specialization}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-slate-600">
                <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-blue-500" /> {trainer.phone}
                </p>
                <p className="text-[11px] text-slate-500">
                  Coach ID: <span className="font-mono font-bold text-slate-700">{trainer.trainer_id}</span>
                </p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your coach designs your split workouts, form critiques, and meal plan. Reach out during floor hours for spotting.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No coach assigned yet.</p>
          )}
        </Card>

        {/* Workout Preview */}
        <Card title="Active Training Split">
          {workout ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{workout.plan_name}</h4>
                <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold border border-purple-200">
                  {workout.goal}
                </span>
              </div>

              {workout.notes && (
                <p className="text-slate-600 italic bg-purple-50/50 p-2 rounded-xl border border-purple-100 text-[11px]">
                  Coach: "{workout.notes}"
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <Link to="/member/workout">
                  <Button variant="outline" size="sm" icon={Dumbbell}>View Full Routine →</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              <p>No workout routine assigned yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">Ask your coach to assign your first split!</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
