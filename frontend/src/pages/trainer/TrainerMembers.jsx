import React, { useState, useEffect } from 'react';
import { Users, Search, Eye, Phone, Mail, Clock, Dumbbell, Utensils, TrendingUp } from 'lucide-react';
import { api } from '../../api';
import { Card, Badge, Button, Modal, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function TrainerMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [details, setDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await api.getTrainerMembers();
      if (res.success) setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openMemberDetails = async (m) => {
    setSelectedMember(m);
    setModalOpen(true);
    try {
      setDetailsLoading(true);
      const res = await api.getTrainerMemberDetails(m.member_id);
      if (res.success) setDetails(res.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filtered = members.filter(m =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.member_id.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Assigned Members</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Athletes and gym members officially assigned to your coaching roster.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="w-full sm:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search assigned member name, phone or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">Total Assigned: {members.length}</span>
      </div>

      <Card>
        {loading ? (
          <LoadingSpinner text="Fetching your members..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No assigned members found"
            description="You do not have any members assigned matching your search."
            icon={Users}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">Member ID</th>
                  <th className="py-3 px-4">Name & Contact</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Pass Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">{m.member_id}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{m.full_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {m.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 font-medium">{m.gender || 'Male'}</td>
                    <td className="py-4 px-4 text-xs text-slate-500">{m.registration_date}</td>
                    <td className="py-4 px-4"><Badge>{m.status}</Badge></td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="outline" size="sm" icon={Eye} onClick={() => openMemberDetails(m)}>
                        Profile & History
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MEMBER DETAILS MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assigned Member Fitness Record"
        size="lg"
      >
        {detailsLoading ? (
          <LoadingSpinner text="Loading member fitness file..." />
        ) : details ? (
          <div className="space-y-6 text-xs">
            {/* Header */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="font-mono text-blue-400 font-bold">{details.member_id}</span>
                <h3 className="text-lg font-bold mt-0.5">{details.full_name}</h3>
                <p className="text-slate-400 mt-1">Phone: {details.phone} • Emergency: {details.emergency_contact || 'None'}</p>
              </div>
              <Badge>{details.status}</Badge>
            </div>

            {/* Current Workout */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-blue-600" /> Assigned Workout Routine
              </h4>
              {details.workouts && details.workouts.length > 0 ? (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <p className="font-bold text-slate-900">{details.workouts[0].plan_name}</p>
                  <p className="text-slate-600">Goal: {details.workouts[0].goal}</p>
                  {details.workouts[0].notes && <p className="italic text-slate-500">"{details.workouts[0].notes}"</p>}
                </div>
              ) : (
                <p className="text-slate-400 italic">No workout assigned yet.</p>
              )}
            </div>

            {/* Recent Progress */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Recent Body Measurements
              </h4>
              {details.progress && details.progress.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {details.progress.slice(0, 2).map((pr) => (
                    <div key={pr.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="font-bold text-slate-900 block">{pr.record_date}</span>
                      <p className="mt-1 text-slate-700">Weight: <b>{pr.weight} kg</b></p>
                      <p className="text-slate-600">Chest: {pr.chest || '-'} • Waist: {pr.waist || '-'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">No progress check-ins recorded.</p>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
