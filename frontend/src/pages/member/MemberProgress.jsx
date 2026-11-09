import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Scale } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../../api';
import { Card, Button, Input, Textarea, Modal, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function MemberProgress() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [arms, setArms] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getMemberProgress();
      if (res.success) setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) {
      alert('Please enter your body weight.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createMemberProgress({
        weight,
        chest,
        waist,
        arms,
        fitness_notes: notes
      });
      if (res.success) {
        setModalOpen(false);
        setWeight('');
        setChest('');
        setWaist('');
        setArms('');
        setNotes('');
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Error recording weight');
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = [...records].reverse().map(r => ({
    date: r.record_date,
    weight: parseFloat(r.weight)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Body Measurements</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track your weight loss or muscle building progress over time.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Self-Log Measurement
        </Button>
      </div>

      {chartData.length > 0 && (
        <Card title="Weight Progression Trend (kg)" subtitle="Bodyweight changes over time">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="kg" domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip formatter={(val) => [`${val} kg`, 'Weight']} contentStyle={{ borderRadius: '12px' }} />
                <Line type="monotone" dataKey="weight" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5, fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <Card title="Measurement Logs">
        {loading ? (
          <LoadingSpinner text="Fetching logs..." />
        ) : records.length === 0 ? (
          <EmptyState title="No logs yet" description="Record your first weight measurement to see your chart." icon={Scale} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Chest / Waist / Arms</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{r.record_date}</td>
                    <td className="py-3.5 px-4 font-extrabold text-purple-600 text-sm">{r.weight} kg</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span>C: {r.chest || '-'}</span> • <span>W: {r.waist || '-'}</span> • <span>A: {r.arms || '-'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 italic">{r.fitness_notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Body Measurements" size="md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Current Body Weight (kg) *"
            type="number"
            step="0.1"
            placeholder="e.g. 74.2"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <Input label="Chest (in)" type="number" step="0.5" value={chest} onChange={(e) => setChest(e.target.value)} />
            <Input label="Waist (in)" type="number" step="0.5" value={waist} onChange={(e) => setWaist(e.target.value)} />
            <Input label="Arms (in)" type="number" step="0.5" value={arms} onChange={(e) => setArms(e.target.value)} />
          </div>

          <Textarea label="Personal Notes" placeholder="How did you feel today? Any soreness?" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Save Check-in</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
