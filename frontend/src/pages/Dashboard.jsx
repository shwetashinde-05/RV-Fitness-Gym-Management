import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  IndianRupee,
  Activity,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { api } from '../api';
import { StatCard, Card, Badge, Button, LoadingSpinner } from '../components/UIComponents';

const PIE_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getDashboardCharts()
      ]);
      setStats(statsRes.data);
      setCharts(chartsRes.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading RV FITNESS Dashboard metrics..." />;
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span>Error loading dashboard metrics: {error}</span>
        </div>
        <Button variant="danger" size="sm" onClick={fetchDashboardData}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="bg-gradient-to-r from-[#0F1218] via-[#161B24] to-[#0F1218] rounded-3xl p-6 sm:p-8 text-white border border-[#202634] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Gym Management Active • Narsobawadi
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome to <span className="text-emerald-400">RV FITNESS</span> Portal
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Real-time monitoring of members, payments, workouts, and attendance.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="accent"
              size="sm"
              icon={PlusCircle}
              onClick={() => navigate('/members?openModal=true')}
            >
              Add Member
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-slate-700 hover:bg-slate-800"
              icon={Layers}
              onClick={() => navigate('/assign-membership')}
            >
              Assign Plan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-slate-700 hover:bg-slate-800"
              icon={CreditCard}
              onClick={() => navigate('/payments?openModal=true')}
            >
              Record Payment
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-slate-700 hover:bg-slate-800"
              icon={CalendarCheck}
              onClick={() => navigate('/attendance')}
            >
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Members"
          value={stats?.totalMembers ?? 0}
          subtitle="Registered gym members"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Active Members"
          value={stats?.activeMembers ?? 0}
          subtitle="Currently active passes"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Expired Members"
          value={stats?.expiredMemberships ?? 0}
          subtitle="Needs renewal follow-up"
          icon={ShieldAlert}
          color="rose"
        />
        <StatCard
          title="Gym Trainers"
          value={stats?.totalTrainers ?? 0}
          subtitle="Certified trainers"
          icon={UserCheck}
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${(stats?.monthlyRevenue ?? 0).toLocaleString('en-IN')}`}
          subtitle="Current calendar month"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Today's Attendance"
          value={stats?.todayAttendance ?? 0}
          subtitle="Members checked in"
          icon={CalendarCheck}
          color="amber"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends Chart */}
        <div className="lg:col-span-2">
          <Card
            title="Monthly Revenue & Admissions"
            subtitle="Financial inflow from membership subscriptions"
          >
            <div className="h-72 w-full">
              {charts?.revenueByMonth && charts.revenueByMonth.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.revenueByMonth}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No revenue history available
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Membership Plan Distribution */}
        <div>
          <Card
            title="Plan Distribution"
            subtitle="Active members by plan type"
          >
            <div className="h-72 w-full flex items-center justify-center">
              {charts?.planDistribution && charts.planDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {charts.planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span className="text-xs text-slate-600 font-medium">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-400 text-xs">No plan distribution data</div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Tables: Recent Members and Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <Card
          title="Recent Members"
          subtitle="Newly registered fitness enthusiasts"
          action={
            <button
              onClick={() => navigate('/members')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
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
                {stats?.recentMembers && stats.recentMembers.length > 0 ? (
                  stats.recentMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-900">{m.member_id}</td>
                      <td className="py-3 font-semibold text-slate-800">{m.full_name}</td>
                      <td className="py-3 text-slate-500">{m.phone}</td>
                      <td className="py-3 text-right">
                        <Badge>{m.status}</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400">
                      No members registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Invoices / Payments */}
        <Card
          title="Recent Transactions"
          subtitle="Latest verified payment records"
          action={
            <button
              onClick={() => navigate('/payments')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              View Invoices <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="pb-2.5">Invoice ID</th>
                  <th className="pb-2.5">Member</th>
                  <th className="pb-2.5">Method</th>
                  <th className="pb-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentPayments && stats.recentPayments.length > 0 ? (
                  stats.recentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-900">{p.payment_id}</td>
                      <td className="py-3 text-slate-800 font-medium">{p.member_name}</td>
                      <td className="py-3">
                        <Badge>{p.payment_method}</Badge>
                      </td>
                      <td className="py-3 text-right font-extrabold text-emerald-600">
                        ₹{Number(p.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400">
                      No recent payments recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
