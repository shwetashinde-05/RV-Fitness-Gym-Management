import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  Scale,
  Calendar,
  Activity,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
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

export default function ProgressTracking() {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('All');

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
        api.getMembers()
      ]);
      setRecords(pRes.data || []);
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

  const handleCreateRecord = async (e) => {
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
        setFormData(prev => ({
          ...prev,
          weight: '',
          height: '',
          chest: '',
          waist: '',
          arms: '',
          fitness_notes: ''
        }));
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Error recording progress');
    } finally {
      setSubmitting(false);
    }
  };

  const displayedRecords = selectedMemberFilter === 'All'
    ? records
    : records.filter(r => r.member_id === selectedMemberFilter);

  // Format data for weight progression chart
  const chartData = [...displayedRecords]
    .reverse()
    .map(r => ({
      date: r.record_date,
      weight: parseFloat(r.weight),
      member: r.member_name
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Body Measurement & Progress</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log physical body stats, BMI tracking, and weight progression curves.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Record Measurement
        </Button>
      </div>

      {/* Filter by Member */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter by Member:</label>
          <select
            value={selectedMemberFilter}
            onChange={(e) => setSelectedMemberFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Members Progress</option>
            {members.map((m) => (
              <option key={m.id} value={m.member_id}>
                {m.member_id} – {m.full_name}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-slate-500">
          Showing <b>{displayedRecords.length}</b> historical records
        </span>
      </div>

      {/* Weight Progression Chart */}
      {chartData.length > 0 && (
        <Card title="Weight Progression Timeline" subtitle="Bodyweight changes across recorded dates">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  unit="kg"
                />
                <Tooltip
                  formatter={(val) => [`${val} kg`, 'Weight']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10B981' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Progress Cards Grid */}
      <Card title="Measurement History Log">
        {loading ? (
          <LoadingSpinner text="Fetching progress..." />
        ) : displayedRecords.length === 0 ? (
          <EmptyState
            title="No progress records logged"
            description="Start recording member body measurements to graph physical transformation."
            icon={Scale}
            action={<Button size="sm" onClick={() => setModalOpen(true)}>Log Measurement</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Height (cm)</th>
                  <th className="py-3 px-4">Chest / Waist / Arms</th>
                  <th className="py-3 px-4">Trainer Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {displayedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{r.record_date}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{r.member_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{r.member_id}</div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600 text-sm">
                      {r.weight} kg
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {r.height ? `${r.height} cm` : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span>C: {r.chest || '-'}</span> • <span>W: {r.waist || '-'}</span> • <span>A: {r.arms || '-'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 italic max-w-xs truncate">
                      {r.fitness_notes || 'Routine check-in'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* RECORD MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Member Body Measurement"
        size="md"
      >
        <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700">Select Member *</label>
            <select
              value={formData.member_id}
              onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
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

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Measurement Date *"
              type="date"
              value={formData.record_date}
              onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
              required
            />
            <Input
              label="Weight (kg) *"
              type="number"
              step="0.1"
              placeholder="e.g. 74.5"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Height (cm)"
              type="number"
              placeholder="e.g. 175"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
            <Input
              label="Chest (in)"
              type="number"
              step="0.5"
              placeholder="e.g. 38"
              value={formData.chest}
              onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
            />
            <Input
              label="Waist (in)"
              type="number"
              step="0.5"
              placeholder="e.g. 32"
              value={formData.waist}
              onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
            />
          </div>

          <Input
            label="Arms (in)"
            type="number"
            step="0.5"
            placeholder="e.g. 14.5"
            value={formData.arms}
            onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
          />

          <Textarea
            label="Fitness Notes / Coach Observation"
            placeholder="e.g. Muscle definition in shoulders increased. Stamina improved."
            value={formData.fitness_notes}
            onChange={(e) => setFormData({ ...formData, fitness_notes: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
