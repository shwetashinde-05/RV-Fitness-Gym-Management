import React, { useState, useEffect } from 'react';
import { Dumbbell, Target, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../api';
import { Card, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function MemberWorkout() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMemberWorkout()
      .then(res => res.success && setPlans(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Fetching your workout schedule..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Workout Routine</h2>
        <p className="text-xs text-slate-500 mt-0.5">Exercises prescribed specifically for your body transformation goal.</p>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          title="No workout plan assigned yet"
          description="Your personal trainer will configure and assign your split routine soon."
          icon={Dumbbell}
        />
      ) : (
        <div className="space-y-6">
          {plans.map((p) => {
            let exerciseList = [];
            try {
              exerciseList = typeof p.exercises === 'string' ? JSON.parse(p.exercises) : (p.exercises || []);
            } catch (e) {
              exerciseList = [];
            }

            return (
              <Card key={p.id}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{p.plan_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold border border-purple-200">
                        Goal: {p.goal}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Supervisor: {p.trainer_id || 'Gym Coach'}</span>
                </div>

                <div className="my-6 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Prescribed Exercises</span>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                    {exerciseList.map((ex, i) => (
                      <div key={i} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                            {i + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{ex.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600 text-xs">
                          <span>Sets: <b className="text-slate-900">{ex.sets}</b></span>
                          <span>Reps: <b className="text-slate-900">{ex.reps}</b></span>
                          {ex.rest && <span className="text-slate-400">Rest: {ex.rest}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {p.notes && (
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900">
                    <span className="font-bold block mb-1">Coach Note:</span>
                    <p className="italic">{p.notes}</p>
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
