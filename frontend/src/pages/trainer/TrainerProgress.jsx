import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Scale, CheckCircle } from 'lucide-react';
import { api } from '../../api';
import { Card, Button, Input, Textarea, Modal, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function TrainerProgress() {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    member_id: '',
    record_date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    chest: '',
    waist: '',
    arms: '',
    fitness_notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, mRes] = await Promise.all([
        api.getProgressRecords(),
        api.getTrainerMembers()
      ]);
      const assignedIds = (mRes.data || []).map(m => m.member_id);
      // Filter records for assigned members only
      const filtered = (pRes.data || []).filter(r => assignedIds.includes(r.member_id));
      setRecords(filtered);
      setMembers(mRes.data || []);
      if (mRes.data && mRes.data.length > 0) {
        setFormData(prev => ({ ...prev, member_id: mRes.data[0].member_id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecord = async (e) => {
    e.preventDefault();
    if (!formData.member_id || !formData.weight) {
      alert('Member and weight are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createProgressRecord(formData);
      if (res.success) {
        setModalOpen(false);
        setFormData(prev => ({ ...prev, weight: '', chest: '', waist: '', arms: '', fitness_notes: '' }));
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Error recording progress');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fitness Observations & Measurements</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log body compositions, check-in weights, and coaching remarks for your athletes.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Record Observation
        </Button>
      </div>

      <Card>
        {loading ? (
          <LoadingSpinner text="Fetching observation records..." />
        ) : records.length === 0 ? (
          <EmptyState
            title="No measurement logs found"
            description="Log your first body composition assessment for an assigned member."
            icon={Scale}
            action={<Button size="sm" onClick={() => setModalOpen(true)}>Record Assessment</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Chest / Waist / Arms</th>
                  <th className="py-3 px-4">Coach Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{r.record_date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.member_name} ({r.member_id})</td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600 text-sm">{r.weight} kg</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span>C: {r.chest || '-'}</span> • <span>W: {r.waist || '-'}</span> • <span>A: {r.arms || '-'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 italic">{r.fitness_notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Member Observation" size="md">
        <form onSubmit={handleRecord} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700">Select Assigned Member *</label>
            <select
              value={formData.member_id}
              onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-medium bg-white"
              required
            >
              {members.map((m) => (
                <option key={m.id} value={m.member_id}>{m.member_id} – {m.full_name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date *"
              type="date"
              value={formData.record_date}
              onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
              required
            />
            <Input
              label="Weight (kg) *"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Chest (in)" type="number" step="0.5" value={formData.chest} onChange={(e) => setFormData({ ...formData, chest: e.target.value })} />
            <Input label="Waist (in)" type="number" step="0.5" value={formData.waist} onChange={(e) => setFormData({ ...formData, waist: e.target.value })} />
            <Input label="Arms (in)" type="number" step="0.5" value={formData.arms} onChange={(e) => setFormData({ ...formData, arms: e.target.value })} />
          </div>

          <Textarea
            label="Coach Observation / Form Critique"
            placeholder="e.g. Squat depth improved. Recommend increasing weight by 5% next week."
            value={formData.fitness_notes}
            onChange={(e) => setFormData({ ...formData, fitness_notes: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Save Observation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
