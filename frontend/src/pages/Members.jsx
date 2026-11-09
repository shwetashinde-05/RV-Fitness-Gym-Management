import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  Dumbbell,
  CreditCard,
  TrendingUp,
  X
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

export default function Members() {
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    emergency_contact: '',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    // If URL contains openModal=true or search param
    const params = new URLSearchParams(location.search);
    if (params.get('openModal') === 'true') {
      setAddModalOpen(true);
    }
    if (params.get('search')) {
      setSearch(params.get('search'));
    }
    loadMembers();
  }, [location.search]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await api.getMembers({ search, status: statusFilter });
      if (res.success) {
        setMembers(res.data);
      }
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const res = await api.createMember(formData);
      if (res.success) {
        showToast(`Member created successfully with ID: ${res.data.member_id}`);
        setAddModalOpen(false);
        setFormData({
          full_name: '',
          phone: '',
          email: '',
          date_of_birth: '',
          gender: 'Male',
          address: '',
          emergency_contact: '',
          status: 'Active'
        });
        loadMembers();
      }
    } catch (err) {
      alert(err.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const res = await api.updateMember(selectedMember.id, formData);
      if (res.success) {
        showToast('Member details updated successfully');
        setEditModalOpen(false);
        loadMembers();
      }
    } catch (err) {
      alert(err.message || 'Failed to update member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (member) => {
    const action = member.status === 'Active' ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${member.full_name} (${member.member_id})?`)) {
      return;
    }
    try {
      const res = await api.deleteMember(member.id);
      if (res.success) {
        showToast(`Member is now ${res.data.status}`);
        loadMembers();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openDetails = async (member) => {
    setSelectedMember(member);
    setDetailModalOpen(true);
    setDetailsLoading(true);
    try {
      const res = await api.getMember(member.member_id);
      if (res.success) {
        setMemberDetails(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const openEdit = (member) => {
    setSelectedMember(member);
    setFormData({
      full_name: member.full_name || '',
      phone: member.phone || '',
      email: member.email || '',
      date_of_birth: member.date_of_birth || '',
      gender: member.gender || 'Male',
      address: member.address || '',
      emergency_contact: member.emergency_contact || '',
      status: member.status || 'Active'
    });
    setFormErrors({});
    setEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Members Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage registrations, view subscriptions, and inspect member fitness files.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setFormData({
              full_name: '',
              phone: '',
              email: '',
              date_of_birth: '',
              gender: 'Male',
              address: '',
              emergency_contact: '',
              status: 'Active'
            });
            setFormErrors({});
            setAddModalOpen(true);
          }}
        >
          Add New Member
        </Button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, ID, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadMembers()}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          {['All', 'Active', 'Expired', 'Inactive'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
          <Button variant="outline" size="sm" onClick={loadMembers}>
            Apply
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <Card>
        {loading ? (
          <LoadingSpinner text="Fetching members..." />
        ) : members.length === 0 ? (
          <EmptyState
            title="No members found"
            description="Try modifying your search or filter, or register a new gym member."
            icon={Users}
            action={
              <Button size="sm" onClick={() => setAddModalOpen(true)}>
                Add Member
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3.5 px-4">Member ID</th>
                  <th className="py-3.5 px-4">Name & Contact</th>
                  <th className="py-3.5 px-4">Gender</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-950 font-mono">
                      {member.member_id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{member.full_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {member.phone}
                        </span>
                        {member.email && (
                          <span className="hidden sm:flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" /> {member.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 font-medium">
                      {member.gender || 'Not specified'}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {member.registration_date || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <Badge>{member.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDetails(member)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(member)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            member.status === 'Active'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={member.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ADD MEMBER MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Gym Member"
        size="lg"
      >
        <form onSubmit={handleCreateMember} className="space-y-4">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Member ID will be auto-generated in the sequence (e.g. <b>RVF-0005</b>).</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              placeholder="e.g. Rahul Patil"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              error={formErrors.full_name}
              required
            />
            <Input
              label="Phone Number *"
              placeholder="e.g. +91 98234 56789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={formErrors.phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>

          <Input
            label="Emergency Contact"
            placeholder="e.g. +91 98234 00000 (Father)"
            value={formData.emergency_contact}
            onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
          />

          <Textarea
            label="Residential Address"
            placeholder="Street address in Narsobawadi / Shirol"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save & Register Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT MEMBER MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Member: ${selectedMember?.member_id}`}
        size="lg"
      >
        <form onSubmit={handleUpdateMember} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              error={formErrors.full_name}
              required
            />
            <Input
              label="Phone Number *"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={formErrors.phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Expired', label: 'Expired' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
            />
          </div>

          <Input
            label="Emergency Contact"
            value={formData.emergency_contact}
            onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
          />

          <Textarea
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Update Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* MEMBER DETAILS MODAL */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Member Fitness Profile"
        size="xl"
      >
        {detailsLoading ? (
          <LoadingSpinner text="Fetching full history..." />
        ) : memberDetails ? (
          <div className="space-y-6">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-extrabold text-sm">
                    {memberDetails.member_id}
                  </span>
                  <Badge>{memberDetails.status}</Badge>
                </div>
                <h3 className="text-xl font-bold mt-1">{memberDetails.full_name}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>Phone: {memberDetails.phone}</span>
                  {memberDetails.email && <span>Email: {memberDetails.email}</span>}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-300">
                <p>Joined: {memberDetails.registration_date}</p>
                <p className="mt-0.5">Emergency: {memberDetails.emergency_contact || 'None'}</p>
                <p className="mt-0.5 text-slate-400">{memberDetails.address}</p>
              </div>
            </div>

            {/* Subscriptions History */}
            <div>
              <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Membership Subscriptions
              </h4>
              {memberDetails.memberships && memberDetails.memberships.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
                  {memberDetails.memberships.map((mm) => (
                    <div key={mm.id} className="p-3 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <span className="font-bold text-slate-900">{mm.plan_name}</span>
                        <span className="text-slate-500 ml-2">
                          ({mm.start_date} to {mm.end_date})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">₹{mm.amount}</span>
                        <Badge>{mm.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No assigned membership packages</p>
              )}
            </div>

            {/* Payment History */}
            <div>
              <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Payment Records
              </h4>
              {memberDetails.payments && memberDetails.payments.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
                  {memberDetails.payments.map((p) => (
                    <div key={p.id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{p.payment_id}</span>
                        <span className="text-slate-500 ml-2">via {p.payment_method} on {p.payment_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">₹{p.amount}</span>
                        <Badge>{p.payment_status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No payments recorded</p>
              )}
            </div>

            {/* Progress metrics */}
            <div>
              <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Body Measurements & Fitness Progress
              </h4>
              {memberDetails.progress && memberDetails.progress.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {memberDetails.progress.map((pr) => (
                    <div key={pr.id} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50">
                      <div className="font-bold text-slate-800">{pr.record_date}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-slate-600">
                        <span>Weight: <b>{pr.weight} kg</b></span>
                        {pr.chest && <span>Chest: <b>{pr.chest}"</b></span>}
                        {pr.waist && <span>Waist: <b>{pr.waist}"</b></span>}
                        {pr.arms && <span>Arms: <b>{pr.arms}"</b></span>}
                      </div>
                      {pr.fitness_notes && (
                        <p className="mt-1 text-[11px] text-slate-500 italic">"{pr.fitness_notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No progress check-ins recorded yet</p>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
