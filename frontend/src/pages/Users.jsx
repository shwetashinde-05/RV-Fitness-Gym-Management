import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Search, Shield, User, Key } from 'lucide-react';
import { api } from '../api';
import { Card, Button, Input, Select, Badge, Modal, LoadingSpinner, EmptyState } from '../components/UIComponents';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'trainer',
    related_id: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert('Name, email, and password are required.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.createUser(formData);
      if (res.success) {
        setModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'trainer', related_id: '', phone: '' });
        loadUsers();
      }
    } catch (err) {
      alert(err.message || 'Error creating user');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.related_id && u.related_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Users & Role Access</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage portal credentials, assign roles (Admin, Trainer, Member), and link accounts.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Create User Account
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="w-full sm:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by user name, email, or linked ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">Total Accounts: {users.length}</span>
      </div>

      <Card>
        {loading ? (
          <LoadingSpinner text="Fetching user accounts..." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No users found" description="Create user accounts to grant portal login access." icon={UserCheck} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Linked Entity ID</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                        u.role === 'admin'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : u.role === 'trainer'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {u.related_id || 'System Superuser'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge>{u.status || 'Active'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* CREATE MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create User Account" size="md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Full Name *"
            placeholder="e.g. Ramesh Kulkarni"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address *"
              type="email"
              placeholder="ramesh@rvfitness.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Assigned Role *"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'trainer', label: 'Trainer (Coach)' },
                { value: 'member', label: 'Member' },
                { value: 'admin', label: 'Admin (Full Access)' }
              ]}
            />
            <Input
              label="Linked Entity ID"
              placeholder="e.g. TR-003 or RVF-0006"
              value={formData.related_id}
              onChange={(e) => setFormData({ ...formData, related_id: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Create Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
