import React from 'react';
import { ShieldCheck, Target, Award, Users, MapPin, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Our Story & Mission</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">
          Redefining Fitness In Narsobawadi
        </h1>
        <p className="text-slate-400 text-sm mt-4 leading-relaxed">
          RV FITNESS was founded with a singular mission: to bring world-class gym equipment, science-backed athletic programming, and certified coaching to the people of Narsobawadi and the surrounding Shirol taluka.
        </p>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Our Vision</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To make premier fitness accessible, affordable, and scientifically structured for youth, working professionals, and seniors in our town.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Certified Guidance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every workout routine and nutrition chart is overseen by certified physical trainers with verified coaching credentials in strength training.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Transparent System</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            With our real-time SaaS platform, members track their attendance, invoices, weight progression, and diet plans directly online.
          </p>
        </div>
      </div>

      {/* Location Details */}
      <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Gym Location</span>
          <h3 className="text-xl font-bold text-white mt-1">Conveniently Located in Narsobawadi</h3>
          <p className="text-xs text-slate-400 mt-2">
            Near Datta Mandir, Main Road, Narsobawadi, Tal. Shirol, Dist. Kolhapur, Maharashtra 416104.
          </p>
        </div>
        <div className="text-xs text-slate-300 bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800 space-y-1">
          <p><b>Operating Hours:</b></p>
          <p>Mon - Sat: 5:30 AM – 10:00 PM</p>
          <p>Sunday: 6:00 AM – 1:00 PM</p>
        </div>
      </div>
    </div>
  );
}
