import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';
import { api } from '../api';
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  Modal,
  LoadingSpinner,
  EmptyState
} from '../components/UIComponents';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');

  // Modal Mark Attendance
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    member_id: '',
    date: new Date().toISOString().split('T')[0],
    check_in_time: '',
    check_out_time: '',
    status: 'Present'
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [dateFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [attRes, memRes] = await Promise.all([
        api.getAttendance({ date: dateFilter, search }),
        api.getMembers()
      ]);
      setAttendance(attRes.data || []);
      setMembers(memRes.data || []);
      if (memRes.data && memRes.data.length > 0) {
        setFormData(prev => ({ ...prev, member_id: memRes.data[0].member_id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!formData.member_id) {
      alert('Please select a member.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await api.markAttendance(formData);
      if (res.success) {
        setToastMessage(`Attendance logged for ${formData.member_id}!`);
        setTimeout(() => setToastMessage(''), 3000);
        setModalOpen(false);
        loadData();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daily Gym Attendance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log check-ins, verify member passes, and track gym floor rush hours.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            const now = new Date();
            setFormData({
              member_id: members[0]?.member_id || '',
              date: new Date().toISOString().split('T')[0],
              check_in_time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              check_out_time: '',
              status: 'Present'
            });
            setErrorMsg('');
            setModalOpen(true);
          }}
        >
          Check-in Member
        </Button>
      </div>

      {/* Date & Filter controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter Date:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateFilter(new Date().toISOString().split('T')[0])}
          >
            Today
          </Button>
        </div>

        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search member name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadData()}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Attendance Log Table */}
      <Card
        title={`Attendance Records for ${dateFilter}`}
        subtitle={`Total check-ins: ${attendance.length}`}
      >
        {loading ? (
          <LoadingSpinner text="Fetching attendance logs..." />
        ) : attendance.length === 0 ? (
          <EmptyState
            title="No check-ins for this date"
            description="Use the Check-in Member button to register arrival at the gym."
            icon={CalendarCheck}
            action={
              <Button size="sm" onClick={() => setModalOpen(true)}>
                Check-in Member
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">Member ID</th>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Check-in Time</th>
                  <th className="py-3 px-4">Check-out Time</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {a.member_id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {a.member_name}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> {a.check_in_time || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {a.check_out_time || 'In Session'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge>{a.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MARK ATTENDANCE MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Check-in Gym Member"
        size="md"
      >
        <form onSubmit={handleMarkAttendance} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 min-w-4" />
              <span>{errorMsg}</span>
            </div>
          )}

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
                  {m.member_id} – {m.full_name} ({m.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Attendance Date *"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Check-in Time"
              placeholder="e.g. 06:30 AM"
              value={formData.check_in_time}
              onChange={(e) => setFormData({ ...formData, check_in_time: e.target.value })}
            />
          </div>

          <Select
            label="Attendance Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Present', label: 'Present' },
              { value: 'Late', label: 'Late' },
              { value: 'Special Session', label: 'Personal Training Session' }
            ]}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Confirm Check-in
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
