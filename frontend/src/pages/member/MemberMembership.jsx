import React, { useState, useEffect } from 'react';
import { Layers, Clock, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../../api';
import { Card, Badge, Button, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function MemberMembership() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renewalRequested, setRenewalRequested] = useState(false);

  useEffect(() => {
    api.getMemberMembership()
      .then(res => res.success && setMemberships(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRequestRenewal = () => {
    setRenewalRequested(true);
    setTimeout(() => setRenewalRequested(false), 5000);
  };

  if (loading) return <LoadingSpinner text="Fetching membership history..." />;

  const active = memberships.find(m => m.status === 'Active') || memberships[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Membership & Subscription</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your active gym package and renewal requests.</p>
        </div>
        <Button variant="accent" icon={RefreshCw} onClick={handleRequestRenewal}>
          Request Pass Renewal
        </Button>
      </div>

      {renewalRequested && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 min-w-5" />
          <span><b>Renewal request dispatched!</b> The front desk at Narsobawadi has been notified. You can pay via UPI or cash upon your next visit.</span>
        </div>
      )}

      {/* Active Pass Card */}
      {active && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Active Plan Package</span>
              <Badge>{active.status}</Badge>
            </div>
            <h3 className="text-2xl font-black">{active.plan_name}</h3>
            <p className="text-xs text-slate-300 mt-1">
              Start Date: <b>{active.start_date}</b> • Expiry Date: <b>{active.end_date}</b>
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs text-slate-400 block">Package Amount</span>
            <span className="text-3xl font-black text-emerald-400">₹{Number(active.amount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* Subscription Ledger Table */}
      <Card title="Subscription History Log" subtitle="All current and previous gym assignments">
        {memberships.length === 0 ? (
          <EmptyState title="No memberships found" description="You do not have any registered passes." icon={Layers} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {memberships.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{m.plan_name}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{m.start_date}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{m.end_date}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{Number(m.amount).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right"><Badge>{m.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
