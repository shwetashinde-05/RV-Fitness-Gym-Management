import React, { useState } from 'react';
import { Camera, Sparkles, Dumbbell, Activity, Heart } from 'lucide-react';

export default function Gallery() {
  const [filter, setFilter] = useState('All');

  const photos = [
    {
      title: 'Olympic Free Weights & Squat Cages',
      category: 'Weights',
      color: 'from-emerald-600 to-teal-800',
      tag: 'Heavy Lifting'
    },
    {
      title: 'Commercial Pin-Loaded Cable Stations',
      category: 'Machines',
      color: 'from-slate-700 to-slate-900',
      tag: 'Hypertrophy'
    },
    {
      title: 'Cardio Deck & Aerobic Rowers',
      category: 'Cardio',
      color: 'from-blue-600 to-indigo-900',
      tag: 'Fat Burning'
    },
    {
      title: 'Rubberized Hex Dumbbells & Free Weights Zone',
      category: 'Weights',
      color: 'from-emerald-700 to-cyan-900',
      tag: 'Strength'
    },
    {
      title: 'Functional Sprint Turf & Battle Ropes',
      category: 'Functional',
      color: 'from-lime-600 to-emerald-900',
      tag: 'Crossfit'
    },
    {
      title: 'Locker Facility & Steam Room',
      category: 'Recovery',
      color: 'from-purple-700 to-slate-900',
      tag: 'Wellness'
    }
  ];

  const filtered = filter === 'All' ? photos : photos.filter(p => p.category === filter);

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Floor Showcase</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">
          RV FITNESS Workout Floor
        </h1>
        <p className="text-slate-400 text-sm mt-3">
          Take a visual tour through our premium training zones and facilities in Narsobawadi.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['All', 'Weights', 'Machines', 'Cardio', 'Functional', 'Recovery'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === cat
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((photo, i) => (
          <div
            key={i}
            className="group relative rounded-3xl overflow-hidden border border-slate-800 bg-[#121620] hover:border-emerald-500/40 transition-all aspect-[4/3] flex flex-col justify-end p-6"
          >
            {/* Visual gradient backdrop */}
            <div className={`absolute inset-0 bg-gradient-to-t ${photo.color} opacity-30 group-hover:opacity-45 transition-opacity`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent"></div>

            <div className="relative z-10">
              <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2 uppercase tracking-widest">
                {photo.tag}
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {photo.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
