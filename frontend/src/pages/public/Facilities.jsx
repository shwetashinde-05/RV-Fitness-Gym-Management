import React from 'react';
import { Dumbbell, Activity, Heart, Shield, Sparkles, Wind, Users, CheckCircle } from 'lucide-react';

export default function Facilities() {
  const facilityList = [
    {
      title: 'Commercial Heavy Weight Area',
      description: 'Olympic barbells, bumper plates, multiple power cages, incline/decline benches, heavy dumbbells, and selectorized weight stacks for maximum hypertrophy.',
      icon: Dumbbell
    },
    {
      title: 'Cardio & Aerobic Zone',
      description: 'Commercial motorized treadmills, elliptical cross trainers, spin bikes, and rowers with heart-rate monitoring displays.',
      icon: Heart
    },
    {
      title: 'Functional Turf & Crossfit Arena',
      description: 'Turf sled track, battle ropes, kettlebells, plyometric boxes, and resistance bands for athletic agility and stamina.',
      icon: Activity
    },
    {
      title: 'Locker Rooms & Clean Showers',
      description: 'Secure biometric digital lockers, clean changing areas, and high-pressure hot/cold showers.',
      icon: Shield
    },
    {
      title: 'Steam & Recovery Bath',
      description: 'Relax post-workout in our specialized hygienic steam room to reduce muscle soreness and promote blood circulation.',
      icon: Sparkles
    },
    {
      title: 'Air Conditioned & Fresh Air Ventilation',
      description: 'Continuous fresh-air circulation system ensuring low CO2 levels and cool workouts even during hot summer months.',
      icon: Wind
    }
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">State-Of-The-Art Equipment</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">
          World-Class Gym Facilities
        </h1>
        <p className="text-slate-400 text-sm mt-3">
          Explore our spacious workout floor in Narsobawadi designed for serious lifters and fitness enthusiasts alike.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilityList.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="p-8 rounded-3xl bg-[#121620] border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
