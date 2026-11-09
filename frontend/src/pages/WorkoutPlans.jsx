import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Trash,
  User,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { api } from '../api';
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  Modal,
  LoadingSpinner,
  EmptyState
} from '../components/UIComponents';

export default function WorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [goal, setGoal] = useState('Muscle Building & Strength');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([
    { name: 'Barbell Bench Press', sets: '4', reps: '10', rest: '60s' },
    { name: 'Barbell Squats', sets: '4', reps: '10', rest: '90s' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [wRes, mRes, tRes] = await Promise.all([
        api.getWorkoutPlans(),
        api.getMembers(),
        api.getTrainers()
      ]);
      setPlans(wRes.data || []);
      setMembers(mRes.data || []);
      setTrainers(tRes.data || []);

      if (mRes.data && mRes.data.length > 0) setMemberId(mRes.data[0].member_id);
      if (tRes.data && tRes.data.length > 0) setTrainerId(tRes.data[0].trainer_id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addExerciseRow = () => {
    setExercises([...exercises, { name: '', sets: '3', reps: '12', rest: '60s' }]);
  };

  const removeExerciseRow = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planName.trim() || !memberId) {
      alert('Plan name and assigned member are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createWorkoutPlan({
        plan_name: planName,
        member_id: memberId,
        trainer_id: trainerId,
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
      alert(err.message || 'Error creating workout plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workout Plans & Splits</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Design targeted routines (hypertrophy, endurance, weight loss) and assign to members.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Create Workout Plan
        </Button>
      </div>

      {/* Plans List */}
      {loading ? (
        <LoadingSpinner text="Fetching workout routines..." />
      ) : plans.length === 0 ? (
        <EmptyState
          title="No workout plans created"
          description="Build training splits for members to follow."
          icon={Dumbbell}
          action={<Button size="sm" onClick={() => setModalOpen(true)}>Create Routine</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            let exerciseList = [];
            try {
              exerciseList = typeof plan.exercises === 'string' ? JSON.parse(plan.exercises) : (plan.exercises || []);
            } catch (e) {
              exerciseList = [];
            }

            return (
              <Card key={plan.id} className="relative hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{plan.plan_name}</h3>
                    <p className="text-xs text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" /> Goal: {plan.goal}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-800 block">Member: {plan.member_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Trainer: {plan.trainer_name}</span>
                  </div>
                </div>

                <div className="my-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Assigned Exercises:
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
                    {exerciseList.map((ex, i) => (
                      <div key={i} className="p-2.5 flex items-center justify-between bg-slate-50/50">
                        <span className="font-bold text-slate-800">{ex.name}</span>
                        <div className="flex items-center gap-3 text-slate-600 text-[11px]">
                          <span><b>{ex.sets}</b> Sets</span>
                          <span><b>{ex.reps}</b> Reps</span>
                          {ex.rest && <span className="text-slate-400">Rest: {ex.rest}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {plan.notes && (
                  <p className="text-xs text-slate-500 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    💡 Trainer Note: {plan.notes}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* CREATE WORKOUT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create & Assign Workout Plan"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Plan Routine Name *"
            placeholder="e.g. 5-Day Push Pull Legs Hypertrophy"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Assign to Member *</label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                required
              >
                {members.map((m) => (
                  <option key={m.id} value={m.member_id}>
                    {m.member_id} – {m.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Supervising Trainer</label>
              <select
                value={trainerId}
                onChange={(e) => setTrainerId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {trainers.map((t) => (
                  <option key={t.id} value={t.trainer_id}>
                    {t.trainer_id} – {t.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Fitness Goal"
            placeholder="e.g. Muscle Gain / Fat Loss / Core Stability"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />

          {/* Dynamic Exercise rows */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Exercises Routine:</span>
              <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addExerciseRow}>
                Add Exercise
              </Button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Exercise name"
                    value={ex.name}
                    onChange={(e) => updateExercise(i, 'name', e.target.value)}
                    className="flex-1 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sets"
                    value={ex.sets}
                    onChange={(e) => updateExercise(i, 'sets', e.target.value)}
                    className="w-16 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Reps"
                    value={ex.reps}
                    onChange={(e) => updateExercise(i, 'reps', e.target.value)}
                    className="w-16 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Rest"
                    value={ex.rest}
                    onChange={(e) => updateExercise(i, 'rest', e.target.value)}
                    className="w-16 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExerciseRow(i)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Textarea
            label="Trainer Coaching Notes"
            placeholder="Advice on hydration, warmup sets, form cues..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save Routine
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
