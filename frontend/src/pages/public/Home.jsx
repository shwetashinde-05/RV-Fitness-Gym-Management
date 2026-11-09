import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  ShieldCheck,
  Award,
  Users,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle,
  MapPin,
  ChevronRight,
  Star,
  Activity,
  HeartPulse
} from 'lucide-react';
import { api } from '../../api';
import { Button } from '../../components/UIComponents';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    api.getPublicPlans().then(res => res.success && setPlans(res.data.slice(0, 3))).catch(() => {});
    api.getPublicTrainers().then(res => res.success && setTrainers(res.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-20 overflow-hidden">
        {/* Background Gradients & Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-lime-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Narsobawadi’s Premium Fitness Destination • Est. 2024
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
            TRANSFORM YOUR BODY AT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-400">RV FITNESS</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            State-of-the-art commercial gym machinery, certified coaches, dedicated turf, and customized Indian diet plans designed for maximum results.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="accent" size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-lg shadow-lime-500/20">
                Join RV FITNESS Today
              </Button>
            </Link>
            <Link to="/plans">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800">
                Explore Membership Plans
              </Button>
            </Link>
          </div>

          {/* Key Metric Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-xl font-extrabold text-emerald-400 block">Strength & Cardio</span>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Dedicated Training Zones</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-xl font-extrabold text-emerald-400 block">Certified Floor</span>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Expert Coach Guidance</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-xl font-extrabold text-emerald-400 block">Digital Portal</span>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Track Routine & Diet</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-xl font-extrabold text-emerald-400 block">Clean Facilities</span>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Hygienic Lockers & Steam</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE RV FITNESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Engineered For Serious Muscle & Stamina
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Whether you want weight loss, bodybuilding, athletic conditioning, or healthy living, RV FITNESS provides everything under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Heavy Free Weights & Machines</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Olympic squat racks, power cages, heavy dumbbells, and selectorized resistance machines.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Personalized Diet & Training</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Targeted workouts tailored to your body type, paired with balanced vegetarian and non-vegetarian Indian meal plans.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Role-Based SaaS Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent digital membership portal where members track weights, view attendance, download tax invoices, and follow routines.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED MEMBERSHIP PLANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Pricing Packages</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Affordable Memberships For Everyone
            </h2>
          </div>
          <Link to="/plans" className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1">
            View All Plans <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`p-8 rounded-3xl bg-[#121620] border transition-all flex flex-col justify-between ${
                  p.duration_months >= 12
                    ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-xl shadow-emerald-500/10'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{p.name}</span>
                  <div className="my-4">
                    <span className="text-4xl font-black text-white">₹{Number(p.price).toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400 ml-1">/ {p.duration_months} Months</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{p.description}</p>
                  <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Full gym floor access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Locker & shower room
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Digital portal tracking
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Link to="/register">
                    <Button variant={p.duration_months >= 12 ? 'accent' : 'outline'} className="w-full">
                      Enroll in {p.name}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-3xl bg-[#121620] border border-slate-800 text-center max-w-xl mx-auto">
            <p className="text-slate-300 font-bold text-sm">Flexible Membership Packages</p>
            <p className="text-xs text-slate-400 mt-1">Visit our front desk near Datta Mandir or register online to begin.</p>
            <div className="mt-4">
              <Link to="/register">
                <Button variant="accent" size="sm">Register Online</Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* TRAINERS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Coaching Staff</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Meet Our Expert Trainers
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Experienced body transformation coaches dedicated to guiding your form and nutrition.
          </p>
        </div>

        {trainers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {trainers.map((t) => (
              <div key={t.id} className="p-6 rounded-3xl bg-[#121620] border border-slate-800 flex items-center gap-5">
                <div className="w-16 h-16 min-w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-md">
                  {t.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t.full_name}</h3>
                  <span className="text-xs text-emerald-400 font-semibold">{t.specialization}</span>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.bio || 'Professional fitness coach at RV FITNESS Narsobawadi.'}</p>
                  <div className="mt-2 text-[11px] text-slate-500 font-medium">Experience: {t.experience}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-[#121620] border border-slate-800 text-center max-w-lg mx-auto">
            <p className="text-xs text-slate-400">Our certified coaching staff is available on the gym floor to supervise workout posture and create personal workout schedules.</p>
          </div>
        )}
      </section>

      {/* LOCATION & CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#121620] to-[#0D1016] border border-slate-800 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Join Narsobawadi's Best Gym</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Ready To Start Your Transformation?
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Visit us near Datta Mandir, Narsobawadi or register online in 60 seconds to get your personalized workout and diet routine.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/register">
                <Button variant="accent" size="lg">Join Online Now</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-white border-slate-700">Find Us On Map</Button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3 w-full lg:w-80">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 min-w-4 mt-0.5" />
              <span>Near Datta Mandir, Narsobawadi, Maharashtra 416104</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400 min-w-4" />
              <span>Daily: 5:30 AM - 10:00 PM</span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 block">Inquiries:</span>
              <span className="font-bold text-emerald-400 text-sm">+91 98230 12345</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
