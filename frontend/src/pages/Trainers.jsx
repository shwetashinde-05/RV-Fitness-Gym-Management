import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Phone,
  Mail,
  Award,
  Calendar,
  IndianRupee,
  Edit2,
  Trash2,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { api } from '../api';
import {
  Button,
  Input,
  Select,
  Badge,
  Modal,
  Card,
  LoadingSpinner,
  EmptyState
} from '../components/UIComponents';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    specialization: '',
    experience: '',
    salary: '',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const res = await api.getTrainers({ search });
      if (res.success) {
        setTrainers(res.data);
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
      full_name: '',
      phone: '',
      email: '',
      specialization: '',
      experience: '',
      salary: '',
      status: 'Active'
    });
    setModalOpen(true);
  };

  const openEdit = (trainer) => {
    setIsEditing(true);
    setCurrentId(trainer.id);
    setFormData({
      full_name: trainer.full_name,
      phone: trainer.phone,
      email: trainer.email,
      specialization: trainer.specialization,
      experience: trainer.experience,
      salary: trainer.salary,
      status: trainer.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone) {
      alert('Full name and phone are required');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await api.updateTrainer(currentId, formData);
      } else {
        await api.createTrainer(formData);
      }
      setModalOpen(false);
      loadTrainers();
    } catch (err) {
      alert(err.message || 'Error saving trainer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (trainer) => {
    const newStatus = trainer.status === 'Active' ? 'Inactive' : 'Active';
    if (!window.confirm(`Set status of ${trainer.full_name} to ${newStatus}?`)) return;
    try {
      await api.updateTrainer(trainer.id, { status: newStatus });
      loadTrainers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trainers & Coaches</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage fitness instructors, experience levels, certifications, and compensation.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAdd}>
          Add Trainer
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="w-full sm:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, specialization, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadTrainers()}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        <Button variant="outline" size="sm" onClick={loadTrainers}>
          Search
        </Button>
      </div>

      {/* Trainers Grid */}
      {loading ? (
        <LoadingSpinner text="Loading trainers..." />
      ) : trainers.length === 0 ? (
        <EmptyState
          title="No trainers found"
          description="Register a trainer to oversee member workouts and diets."
          icon={UserCheck}
          action={<Button size="sm" onClick={openAdd}>Add Trainer</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((t) => (
            <Card key={t.id} className="relative hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-500/20">
                    {t.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{t.full_name}</h3>
                    <span className="text-xs font-mono font-bold text-emerald-600">{t.trainer_id}</span>
                  </div>
                </div>
                <Badge>{t.status}</Badge>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Award className="w-4 h-4 text-emerald-600 min-w-4" />
                  <span className="font-medium">{t.specialization}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase className="w-4 h-4 text-slate-400 min-w-4" />
                  <span>Experience: <b>{t.experience}</b></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 min-w-4" />
                  <span>{t.phone}</span>
                </div>
                {t.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 min-w-4" />
                    <span>{t.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-900 font-bold pt-1">
                  <IndianRupee className="w-4 h-4 text-emerald-600 min-w-4" />
                  <span>Salary: ₹{Number(t.salary || 0).toLocaleString('en-IN')}/mo</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => openEdit(t)}
                >
                  Edit
                </Button>
                <button
                  onClick={() => handleToggleStatus(t)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    t.status === 'Active'
                      ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                  title={t.status === 'Active' ? 'Deactivate' : 'Activate'}
                >
                  {t.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Trainer Profile' : 'Add New Gym Trainer'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Vikram Jadhav"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number *"
              placeholder="+91 98500 12345"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="trainer@rvfitness.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Specialization"
              placeholder="e.g. Strength & Crossfit"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
            <Input
              label="Experience"
              placeholder="e.g. 5 Years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Monthly Salary (₹)"
              type="number"
              placeholder="30000"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
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
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {isEditing ? 'Save Changes' : 'Register Trainer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
