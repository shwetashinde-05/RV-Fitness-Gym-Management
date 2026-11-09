import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Calendar,
  IndianRupee,
  CheckCircle,
  CreditCard,
  Clock,
  Layers,
  Users
} from 'lucide-react';
import { api } from '../api';
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  LoadingSpinner,
  EmptyState
} from '../components/UIComponents';

export default function AssignMembership() {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [membersRes, plansRes, assignRes] = await Promise.all([
        api.getMembers(),
        api.getPlans(),
        api.getMemberMemberships()
      ]);
      setMembers(membersRes.data || []);
      setPlans(plansRes.data || []);
      setAssignments(assignRes.data || []);

      if (membersRes.data && membersRes.data.length > 0) {
        setSelectedMemberId(membersRes.data[0].member_id);
      }
      if (plansRes.data && plansRes.data.length > 0) {
        const firstPlan = plansRes.data[0];
        setSelectedPlanId(firstPlan.id);
        setAmount(firstPlan.price);
        calculateEndDate(new Date().toISOString().split('T')[0], firstPlan.duration_months);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateEndDate = (start, durationMonths) => {
    if (!start || !durationMonths) return;
    const d = new Date(start);
    d.setMonth(d.getMonth() + parseInt(durationMonths, 10));
    setEndDate(d.toISOString().split('T')[0]);
  };

  const handlePlanChange = (planId) => {
    setSelectedPlanId(planId);
    const plan = plans.find(p => String(p.id) === String(planId));
    if (plan) {
      setAmount(plan.price);
      calculateEndDate(startDate, plan.duration_months);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    const plan = plans.find(p => String(p.id) === String(selectedPlanId));
    if (plan) {
      calculateEndDate(date, plan.duration_months);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedPlanId || !startDate || !endDate) {
      alert('Please fill all required assignment fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.assignMembership({
        member_id: selectedMemberId,
        plan_id: selectedPlanId,
        start_date: startDate,
        end_date: endDate,
        amount,
        payment_method: paymentMethod
      });

      if (res.success) {
        showToast(res.message);
        // Refresh assignments
        const updated = await api.getMemberMemberships();
        setAssignments(updated.data || []);
      }
    } catch (err) {
      alert(err.message || 'Failed to assign membership');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assign Membership Plan</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enroll members into fitness packages, compute valid duration automatically, and issue receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment Form */}
        <div className="lg:col-span-1">
          <Card title="New Subscription Assignment">
            {loading ? (
              <LoadingSpinner text="Loading options..." />
            ) : members.length === 0 || plans.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="font-bold text-slate-800">
                  {members.length === 0 && plans.length === 0
                    ? 'No members or plans available'
                    : members.length === 0
                    ? 'No members registered yet'
                    : 'No membership plans created yet'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Please add at least one member and one membership plan before assigning subscriptions.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Member selection */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Select Member *</label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    required
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.member_id}>
                        {m.member_id} – {m.full_name} ({m.phone})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plan selection */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">Select Membership Plan *</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    required
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.duration_months} mo) – ₹{Number(p.price).toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start & End Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Date *"
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    required
                  />
                  <Input
                    label="Auto End Date *"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                {/* Amount */}
                <Input
                  label="Subscription Amount (₹) *"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />

                {/* Payment Method */}
                <Select
                  label="Initial Payment Mode"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  options={[
                    { value: 'UPI', label: 'UPI (Google Pay, PhonePe, Paytm)' },
                    { value: 'Cash', label: 'Cash at Front Desk' },
                    { value: 'Card', label: 'Credit / Debit Card' },
                    { value: 'Bank Transfer', label: 'Bank Transfer (NEFT/IMPS)' }
                  ]}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={submitting}
                  >
                    Confirm & Assign Membership
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        {/* Existing Assigned Memberships Table */}
        <div className="lg:col-span-2">
          <Card title="Membership Assignment History" subtitle="Active and completed subscriptions">
            {assignments.length === 0 ? (
              <EmptyState
                title="No active assignments"
                description="Assign a plan to a gym member using the form."
                icon={Layers}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 font-semibold border-b border-slate-100 bg-slate-50/50">
                    <tr>
                      <th className="py-3 px-3">Member</th>
                      <th className="py-3 px-3">Plan Package</th>
                      <th className="py-3 px-3">Period</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignments.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900 block">{a.member_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{a.member_id}</span>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          {a.plan_name}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">
                          {a.start_date} <span className="text-slate-400">to</span> {a.end_date}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-emerald-600">
                          ₹{Number(a.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Badge>{a.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
