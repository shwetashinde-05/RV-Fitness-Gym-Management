import React, { useState, useEffect } from 'react';
import { Award, Briefcase, Phone, Mail, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../api';

export default function PublicTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPublicTrainers()
      .then(res => res.success && setTrainers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Coaching Excellence</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">
          Certified Fitness Trainers
        </h1>
        <p className="text-slate-400 text-sm mt-3">
          Our certified coaching staff provides continuous guidance on weightlifting posture, injury prevention, and meal scheduling.
        </p>
      </div>

      {!loading && trainers.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#121620] border border-slate-800 max-w-lg mx-auto">
          <Award className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-white">No Trainers Listed Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Our training staff profiles are currently being updated. Inquire at the front desk for coach allocations and personal training sessions.</p>
        </div>
      )}

      {trainers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {trainers.map((t) => (
            <div key={t.id} className="p-8 rounded-3xl bg-[#121620] border border-slate-800 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-md">
                  {t.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t.full_name}</h3>
                  <span className="text-xs font-semibold text-emerald-400">{t.specialization}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {t.bio || 'Specialist coach focusing on body composition, hypertrophy, and functional endurance.'}
              </p>

              <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>Experience: <b>{t.experience}</b></span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Status: <b className="text-emerald-400">Active Coach on Gym Floor</b></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
