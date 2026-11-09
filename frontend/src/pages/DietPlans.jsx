import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Plus,
  Flame,
  Apple,
  Trash,
  CheckCircle,
  Clock
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

export default function DietPlans() {
  const [dietPlans, setDietPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [calorieTarget, setCalorieTarget] = useState('2200');
  const [nutritionNotes, setNutritionNotes] = useState('');
  const [meals, setMeals] = useState([
    { meal: 'Breakfast (8:00 AM)', items: '4 Boiled Eggs / Paneer Bhurji + Oats + Almonds', protein: '30g' },
    { meal: 'Lunch (1:30 PM)', items: '3 Chapati / Brown Rice + Dal + Chicken / Soya chunks + Salad', protein: '40g' },
    { meal: 'Dinner (8:30 PM)', items: 'Grilled Paneer / Fish + Mixed Veg Soup + 1 Roti', protein: '30g' }
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
        api.getMembers()
      ]);
      setDietPlans(dRes.data || []);
      setMembers(mRes.data || []);
      if (mRes.data && mRes.data.length > 0) setMemberId(mRes.data[0].member_id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMealRow = () => {
    setMeals([...meals, { meal: 'Snack / Pre-Workout', items: '', protein: '15g' }]);
  };

  const removeMealRow = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const updateMeal = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planName.trim() || !memberId) {
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
      alert(err.message || 'Error saving diet plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nutrition & Diet Plans</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescribe daily macros, calorie targets, and local Maharashtrian vegetarian/non-veg diet options.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Create Diet Plan
        </Button>
      </div>

      {/* Plans List */}
      {loading ? (
        <LoadingSpinner text="Fetching diet plans..." />
      ) : dietPlans.length === 0 ? (
        <EmptyState
          title="No diet plans created"
          description="Prepare customized nutrition guidelines for members."
          icon={Utensils}
          action={<Button size="sm" onClick={() => setModalOpen(true)}>Create Diet Plan</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dietPlans.map((diet) => {
            let mealList = [];
            try {
              mealList = typeof diet.meals === 'string' ? JSON.parse(diet.meals) : (diet.meals || []);
            } catch (e) {
              mealList = [];
            }

            return (
              <Card key={diet.id} className="relative hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{diet.plan_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Flame className="w-3.5 h-3.5 text-amber-600" /> {diet.calorie_target} kcal / day
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-800 block">Member: {diet.member_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{diet.member_id}</span>
                  </div>
                </div>

                <div className="my-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Daily Meal Breakdown:
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
                    {mealList.map((m, i) => (
                      <div key={i} className="p-3 bg-slate-50/50">
                        <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                          <span>{m.meal}</span>
                          {m.protein && (
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Prot: {m.protein}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-[11px]">{m.items}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {diet.nutrition_notes && (
                  <p className="text-xs text-slate-500 italic bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    🥗 Diet Advice: {diet.nutrition_notes}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* CREATE DIET MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Design Member Nutrition Plan"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Diet Plan Title *"
            placeholder="e.g. High Protein Lean Mass Gain"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">Assign Member *</label>
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

            <Input
              label="Target Calories (kcal) *"
              type="number"
              placeholder="e.g. 2400"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(e.target.value)}
              required
            />
          </div>

          {/* Meals rows */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Meals Schedule:</span>
              <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addMealRow}>
                Add Meal
              </Button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {meals.map((m, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Meal (e.g. Breakfast 8 AM)"
                    value={m.meal}
                    onChange={(e) => updateMeal(i, 'meal', e.target.value)}
                    className="w-44 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Food items (e.g. 4 eggs, oats, banana)"
                    value={m.items}
                    onChange={(e) => updateMeal(i, 'items', e.target.value)}
                    className="flex-1 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Protein (30g)"
                    value={m.protein}
                    onChange={(e) => updateMeal(i, 'protein', e.target.value)}
                    className="w-20 p-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {meals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMealRow(i)}
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
            label="Nutrition Notes & Water Intake"
            placeholder="e.g. Minimum 3.5 liters water daily. Electrolytes during workout."
            value={nutritionNotes}
            onChange={(e) => setNutritionNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save Diet Plan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
