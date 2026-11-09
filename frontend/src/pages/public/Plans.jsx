import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../../api';
import { Button } from '../../components/UIComponents';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPublicPlans()
      .then(res => {
        if (res.success) setPlans(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Pricing & Packages</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">
          Transparent Gym Memberships
        </h1>
        <p className="text-slate-400 text-sm mt-3">
          No hidden fees. Free trainer consultation with quarterly and annual subscriptions.
        </p>
      </div>

      {!loading && plans.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#121620] border border-slate-800 max-w-lg mx-auto">
          <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-white">No Membership Plans Published Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Plans are currently being configured by the gym administration. Please check back soon or visit our front desk in Narsobawadi.</p>
          <div className="mt-6">
            <Link to="/contact">
              <Button variant="outline" size="sm">Contact Front Desk</Button>
            </Link>
          </div>
        </div>
      )}

      {plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const isYearly = p.duration_months >= 12;
            return (
              <div
                key={p.id}
                className={`p-8 rounded-3xl bg-[#121620] border transition-all flex flex-col justify-between ${
                  isYearly
                    ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-xl shadow-emerald-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {isYearly && (
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider mb-4 border border-emerald-500/30">
                      ★ Best Value Package
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Duration: <b>{p.duration_months} Month{p.duration_months > 1 ? 's' : ''}</b></span>
                  </div>

                  <div className="my-6">
                    <span className="text-4xl font-black text-white">₹{Number(p.price).toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-500 ml-1">/ {p.duration_months} mo</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {p.description || 'Full access to weight area, cardio machines, and locker facilities.'}
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> All Gym Equipment Access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Locker & Changing Room
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Online Portal Tracking
                    </li>
                    {isYearly && (
                      <li className="flex items-center gap-2 text-emerald-400 font-bold">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Free Steam Bath & Diet
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link to={`/register?plan=${p.id}`}>
                    <Button variant={isYearly ? 'accent' : 'outline'} className="w-full">
                      Enroll Online
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
