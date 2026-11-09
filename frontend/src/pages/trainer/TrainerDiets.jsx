import React, { useState, useEffect } from 'react';
import { Utensils, Plus, Trash, Flame } from 'lucide-react';
import { api } from '../../api';
import { Card, Button, Input, Textarea, Modal, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function TrainerDiets() {
  const [diets, setDiets] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [calorieTarget, setCalorieTarget] = useState('2400');
  const [nutritionNotes, setNutritionNotes] = useState('');
  const [meals, setMeals] = useState([
    { meal: 'Breakfast (8 AM)', items: '4 Egg whites / Sprouts + Oats + Banana', protein: '30g' },
    { meal: 'Lunch (1 PM)', items: '3 Chapati + Dal + Chicken breast / Paneer + Salad', protein: '40g' },
    { meal: 'Dinner (8 PM)', items: 'Grilled Fish / Tofu + Green Veg Soup + 1 Roti', protein: '30g' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dRes, mRes] = await Promise.all([
        api.getDietPlans(),
        api.getTrainerMembers()
      ]);
      setDiets(dRes.data || []);
      setMembers(mRes.data || []);
      if (mRes.data && mRes.data.length > 0) setMemberId(mRes.data[0].member_id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = () => {
    setMeals([...meals, { meal: 'Snack / Pre-Workout', items: '', protein: '15g' }]);
  };

  const removeMeal = (idx) => {
    setMeals(meals.filter((_, i) => i !== idx));
  };

  const updateMeal = (idx, field, val) => {
    const copy = [...meals];
    copy[idx][field] = val;
    setMeals(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planName || !memberId) {
      alert('Plan title and member are required.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.createDietPlan({
        plan_name: planName,
        member_id: memberId,
        calorie_target: calorieTarget,
        meals,
        nutrition_notes: nutritionNotes
      });
      if (res.success) {
        setModalOpen(false);
        setPlanName('');
        setNutritionNotes('');
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to save diet plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assigned Nutrition Plans</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescribe daily macros, protein intake, and local meal combinations for your members.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Prescribe Diet
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching diet plans..." />
      ) : diets.length === 0 ? (
        <EmptyState
          title="No diets prescribed yet"
          description="Prepare customized meal guidelines for your assigned members."
          icon={Utensils}
          action={<Button size="sm" onClick={() => setModalOpen(true)}>Prescribe Diet</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diets.map((d) => {
            let mealList = [];
            try {
              mealList = typeof d.meals === 'string' ? JSON.parse(d.meals) : (d.meals || []);
            } catch (e) {
              mealList = [];
            }

            return (
              <Card key={d.id}>
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{d.plan_name}</h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mt-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" /> {d.calorie_target} kcal / day
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-800 block">Member: {d.member_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{d.member_id}</span>
                  </div>
                </div>

                <div className="my-4 space-y-2">
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
                    {mealList.map((m, i) => (
                      <div key={i} className="p-3 bg-slate-50/50">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{m.meal}</span>
                          <span className="text-emerald-600 font-semibold">{m.protein}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{m.items}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {d.nutrition_notes && (
                  <p className="text-xs text-slate-600 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    🥗 Coach Note: {d.nutrition_notes}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Prescribe Diet Schedule" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Diet Plan Title *"
            placeholder="e.g. Lean Muscle Mass Nutrition"
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
            <Input
              label="Calorie Target (kcal) *"
              type="number"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Daily Meals:</span>
              <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addMeal}>Add Meal</Button>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {meals.map((m, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Meal time"
                    value={m.meal}
                    onChange={(e) => updateMeal(i, 'meal', e.target.value)}
                    className="w-36 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Food items"
                    value={m.items}
                    onChange={(e) => updateMeal(i, 'items', e.target.value)}
                    className="flex-1 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Prot (30g)"
                    value={m.protein}
                    onChange={(e) => updateMeal(i, 'protein', e.target.value)}
                    className="w-20 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {meals.length > 1 && (
                    <button type="button" onClick={() => removeMeal(i)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Textarea label="Nutrition Advice" value={nutritionNotes} onChange={(e) => setNutritionNotes(e.target.value)} />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Save Diet Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
