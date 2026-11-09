import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Trash, Target } from 'lucide-react';
import { api } from '../../api';
import { Card, Button, Input, Textarea, Modal, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function TrainerWorkouts() {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [goal, setGoal] = useState('Strength & Hypertrophy');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([
    { name: 'Flat Barbell Bench Press', sets: '4', reps: '10', rest: '60s' },
    { name: 'Incline Dumbbell Press', sets: '3', reps: '12', rest: '60s' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [wRes, mRes] = await Promise.all([
        api.getWorkoutPlans(),
        api.getTrainerMembers()
      ]);
      setPlans(wRes.data || []);
      setMembers(mRes.data || []);
      if (mRes.data && mRes.data.length > 0) setMemberId(mRes.data[0].member_id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    setExercises([...exercises, { name: '', sets: '3', reps: '10', rest: '60s' }]);
  };

  const removeRow = (idx) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const updateRow = (idx, field, val) => {
    const copy = [...exercises];
    copy[idx][field] = val;
    setExercises(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planName || !memberId) {
      alert('Plan name and assigned member are required.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.createWorkoutPlan({
        plan_name: planName,
        member_id: memberId,
        goal,
        exercises,
        notes
      });
      if (res.success) {
        setModalOpen(false);
        setPlanName('');
        setNotes('');
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to save workout plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assigned Workout Routines</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescribe exercises, sets, repetitions, and rest intervals for your assigned athletes.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Create Routine
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching workout routines..." />
      ) : plans.length === 0 ? (
        <EmptyState
          title="No routines assigned yet"
          description="Create customized workout schedules for your members."
          icon={Dumbbell}
          action={<Button size="sm" onClick={() => setModalOpen(true)}>Assign Routine</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((p) => {
            let exerciseList = [];
            try {
              exerciseList = typeof p.exercises === 'string' ? JSON.parse(p.exercises) : (p.exercises || []);
            } catch (e) {
              exerciseList = [];
            }

            return (
              <Card key={p.id}>
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{p.plan_name}</h3>
                    <p className="text-xs text-blue-600 font-bold mt-0.5 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" /> Goal: {p.goal}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-800 block">Member: {p.member_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.member_id}</span>
                  </div>
                </div>

                <div className="my-4 space-y-2">
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
                    {exerciseList.map((ex, i) => (
                      <div key={i} className="p-2.5 flex items-center justify-between bg-slate-50/50">
                        <span className="font-bold text-slate-800">{ex.name}</span>
                        <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                          <span><b>{ex.sets}</b> Sets</span>
                          <span><b>{ex.reps}</b> Reps</span>
                          {ex.rest && <span className="text-slate-400">Rest: {ex.rest}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {p.notes && (
                  <p className="text-xs text-slate-600 italic bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    💡 Coaching Tip: {p.notes}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Assign Workout Routine" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Routine Title *"
            placeholder="e.g. 4-Day Strength & Conditioning"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Select Assigned Member *</label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-medium bg-white"
                required
              >
                {members.map((m) => (
                  <option key={m.id} value={m.member_id}>
                    {m.member_id} – {m.full_name}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Exercises Routine:</span>
              <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addRow}>Add Exercise</Button>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Exercise"
                    value={ex.name}
                    onChange={(e) => updateRow(i, 'name', e.target.value)}
                    className="flex-1 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sets"
                    value={ex.sets}
                    onChange={(e) => updateRow(i, 'sets', e.target.value)}
                    className="w-16 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Reps"
                    value={ex.reps}
                    onChange={(e) => updateRow(i, 'reps', e.target.value)}
                    className="w-16 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Rest"
                    value={ex.rest}
                    onChange={(e) => updateRow(i, 'rest', e.target.value)}
                    className="w-16 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {exercises.length > 1 && (
                    <button type="button" onClick={() => removeRow(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Textarea label="Coaching Instructions" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Save Routine</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
