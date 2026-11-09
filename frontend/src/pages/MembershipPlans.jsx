import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Check,
  Edit2,
  Clock,
  IndianRupee,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { api } from '../api';
import {
  Button,
  Input,
  Select,
  Textarea,
  Badge,
  Modal,
  Card,
  LoadingSpinner,
  EmptyState
} from '../components/UIComponents';

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    duration_months: 1,
    price: '',
    description: '',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await api.getPlans();
      if (res.success) {
        setPlans(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      duration_months: 1,
      price: '',
      description: '',
      status: 'Active'
    });
    setModalOpen(true);
  };

  const openEdit = (plan) => {
    setIsEditing(true);
    setCurrentId(plan.id);
    setFormData({
      name: plan.name,
      duration_months: plan.duration_months,
      price: plan.price,
      description: plan.description,
      status: plan.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration_months) {
      alert('Plan name, duration, and price are required.');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await api.updatePlan(currentId, formData);
      } else {
        await api.createPlan(formData);
      }
      setModalOpen(false);
      loadPlans();
    } catch (err) {
      alert(err.message || 'Error saving plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (plan) => {
    const newStatus = plan.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.updatePlan(plan.id, { status: newStatus });
      loadPlans();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Membership Packages</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define pricing tiers, durations, and fitness privileges for gym members.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAdd}>
          Create New Plan
        </Button>
      </div>

      {/* Plans List */}
      {loading ? (
        <LoadingSpinner text="Fetching membership plans..." />
      ) : plans.length === 0 ? (
        <EmptyState
          title="No membership plans found"
          description="Create your first gym subscription plan."
          icon={Layers}
          action={<Button size="sm" onClick={openAdd}>Create Plan</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const isYearly = p.duration_months >= 12;
            return (
              <div
                key={p.id}
                className={`relative bg-white rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isYearly
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                    : 'border-slate-200/80 shadow-sm hover:shadow-md'
                }`}
              >
                {isYearly && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" /> Best Value Plan
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{p.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Duration: <b>{p.duration_months} Month{p.duration_months > 1 ? 's' : ''}</b></span>
                      </div>
                    </div>
                    <Badge>{p.status}</Badge>
                  </div>

                  <div className="my-6">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-1">
                      / {p.duration_months} mo
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {p.description || 'Full gym facility access, cardio zone, weights section, and locker room.'}
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 min-w-4" />
                      <span>Full Access to Gym Equipment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 min-w-4" />
                      <span>Locker & Shower Facility</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 min-w-4" />
                      <span>Initial Fitness Assessment</span>
                    </li>
                    {isYearly && (
                      <li className="flex items-center gap-2 font-bold text-slate-900">
                        <Check className="w-4 h-4 text-emerald-500 min-w-4" />
                        <span>Free Diet & Steam Bath Access</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit2}
                    className="w-full"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </Button>
                  <button
                    onClick={() => handleToggleStatus(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      p.status === 'Active'
                        ? 'border-slate-200 text-slate-500 hover:bg-slate-100'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {p.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add/Edit Plan */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Membership Plan' : 'Create New Membership Plan'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Plan Title *"
            placeholder="e.g. Quarterly Strength Pack"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Duration (Months) *"
              type="number"
              min="1"
              max="60"
              placeholder="3"
              value={formData.duration_months}
              onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
              required
            />
            <Input
              label="Price (₹) *"
              type="number"
              placeholder="4000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <Textarea
            label="Plan Description & Perks"
            placeholder="Describe what is included in this membership package..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {isEditing ? 'Update Plan' : 'Save Plan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
