import React, { useState, useEffect } from 'react';
import { Utensils, Flame, Apple, CheckCircle } from 'lucide-react';
import { api } from '../../api';
import { Card, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function MemberDiet() {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMemberDiet()
      .then(res => res.success && setDiets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Fetching your nutrition plan..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Nutrition Plan</h2>
        <p className="text-xs text-slate-500 mt-0.5">Meal timings and macronutrient targets designed for your body.</p>
      </div>

      {diets.length === 0 ? (
        <EmptyState
          title="No diet plan prescribed yet"
          description="Your trainer will design your daily calorie and protein chart."
          icon={Utensils}
        />
      ) : (
        <div className="space-y-6">
          {diets.map((d) => {
            let mealList = [];
            try {
              mealList = typeof d.meals === 'string' ? JSON.parse(d.meals) : (d.meals || []);
            } catch (e) {
              mealList = [];
            }

            return (
              <Card key={d.id}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{d.plan_name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Flame className="w-3.5 h-3.5 text-amber-600" /> Target: {d.calorie_target} kcal / day
                      </span>
                    </div>
                  </div>
                </div>

                <div className="my-6 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Daily Meal Breakdown</span>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                    {mealList.map((m, i) => (
                      <div key={i} className="p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-sm mb-1">{m.meal}</div>
                          <p className="text-slate-600">{m.items}</p>
                        </div>
                        {m.protein && (
                          <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 font-bold text-xs whitespace-nowrap self-start sm:self-auto">
                            Protein: {m.protein}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {d.nutrition_notes && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900">
                    <span className="font-bold block mb-1">Dietician / Coach Note:</span>
                    <p className="italic">{d.nutrition_notes}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
