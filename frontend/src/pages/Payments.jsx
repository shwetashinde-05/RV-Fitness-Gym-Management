import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CreditCard,
  Search,
  Plus,
  Printer,
  FileText,
  IndianRupee,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
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

export default function Payments() {
  const location = useLocation();
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    member_id: '',
    amount: '',
    payment_method: 'UPI',
    transaction_reference: '',
    payment_status: 'Completed',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openModal') === 'true') {
      setRecordModalOpen(true);
    }
    loadData();
  }, [location.search]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [payRes, memRes] = await Promise.all([
        api.getPayments({ search, status: statusFilter }),
        api.getMembers()
      ]);
      setPayments(payRes.data || []);
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

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!formData.member_id || !formData.amount) {
      alert('Member and amount are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createPayment(formData);
      if (res.success) {
        setRecordModalOpen(false);
        setFormData({
          member_id: members[0]?.member_id || '',
          amount: '',
          payment_method: 'UPI',
          transaction_reference: '',
          payment_status: 'Completed',
          notes: ''
        });
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const openInvoice = (payment) => {
    setSelectedInvoice(payment);
    setInvoiceModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payments & Invoicing</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit gym fees, record transactions, and generate printable receipts for members.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setRecordModalOpen(true)}>
          Record Payment
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search invoice ID, member name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadData()}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          {['All', 'Completed', 'Pending', 'Failed'].map((st) => (
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
          <Button variant="outline" size="sm" onClick={loadData}>
            Apply
          </Button>
        </div>
      </div>

      {/* Payments Table */}
      <Card>
        {loading ? (
          <LoadingSpinner text="Fetching transactions..." />
        ) : payments.length === 0 ? (
          <EmptyState
            title="No payments recorded"
            description="Collect subscription fees from members to generate invoices."
            icon={CreditCard}
            action={
              <Button size="sm" onClick={() => setRecordModalOpen(true)}>
                Record Payment
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3.5 px-4">Invoice ID</th>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Mode & Ref</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-950">
                      {p.payment_id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{p.member_name}</div>
                      <div className="text-xs text-slate-400 font-mono">{p.member_id}</div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600">
                      {p.payment_date}
                    </td>
                    <td className="py-4 px-4">
                      <Badge>{p.payment_method}</Badge>
                      {p.transaction_reference && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {p.transaction_reference}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-emerald-600">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <Badge>{p.payment_status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={FileText}
                        onClick={() => openInvoice(p)}
                      >
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        title="Record Member Payment"
        size="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Select Member *</label>
            <select
              value={formData.member_id}
              onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              required
            >
              {members.map((m) => (
                <option key={m.id} value={m.member_id}>
                  {m.member_id} – {m.full_name} ({m.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Amount Paid (₹) *"
              type="number"
              placeholder="e.g. 1500"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <Select
              label="Payment Method *"
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              options={[
                { value: 'UPI', label: 'UPI (GPay / PhonePe)' },
                { value: 'Cash', label: 'Cash' },
                { value: 'Card', label: 'Debit / Credit Card' },
                { value: 'Bank Transfer', label: 'Bank Transfer' }
              ]}
            />
          </div>

          <Input
            label="Transaction Reference / Note"
            placeholder="e.g. UPI Ref: 2603848123 or Counter receipt"
            value={formData.transaction_reference}
            onChange={(e) => setFormData({ ...formData, transaction_reference: e.target.value })}
          />

          <Select
            label="Payment Status"
            value={formData.payment_status}
            onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
            options={[
              { value: 'Completed', label: 'Completed (Verified)' },
              { value: 'Pending', label: 'Pending Verification' },
              { value: 'Failed', label: 'Failed' }
            ]}
          />

          <Textarea
            label="Additional Notes"
            placeholder="Any remarks on membership extension or locker deposit..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save Payment
            </Button>
          </div>
        </form>
      </Modal>

      {/* PRINTABLE INVOICE MODAL */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Official Gym Invoice"
        size="lg"
      >
        {selectedInvoice && (
          <div>
            <div
              id="printable-invoice"
              className="p-6 bg-white border border-slate-200 rounded-2xl text-slate-800 space-y-6"
            >
              {/* Gym Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 font-black text-xl flex items-center justify-center">
                      RV
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-wider">
                      RV FITNESS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    Near Datta Mandir, Narsobawadi, Maharashtra 416104
                  </p>
                  <p className="text-[11px] text-slate-400">Phone: +91 98230 12345 | contact@rvfitness.in</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                    Tax Invoice / Receipt
                  </span>
                  <span className="text-base font-extrabold font-mono text-slate-900 block mt-1">
                    {selectedInvoice.payment_id}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Date: {selectedInvoice.payment_date}
                  </span>
                </div>
              </div>

              {/* Billed to */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Billed To:</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">{selectedInvoice.member_name}</p>
                  <p className="text-slate-600">Member ID: {selectedInvoice.member_id}</p>
                  {selectedInvoice.member_phone && (
                    <p className="text-slate-600">Phone: {selectedInvoice.member_phone}</p>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Payment Details:</span>
                  <p className="font-bold text-slate-800 mt-1">Mode: {selectedInvoice.payment_method}</p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    Ref: {selectedInvoice.transaction_reference || 'N/A'}
                  </p>
                  <div className="mt-1">
                    <Badge>{selectedInvoice.payment_status}</Badge>
                  </div>
                </div>
              </div>

              {/* Itemized charges table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-t border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-3 font-bold text-slate-700">Description</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700 text-center">Qty</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">Gym Membership Subscription</p>
                      <p className="text-[11px] text-slate-500">
                        {selectedInvoice.notes || 'Full gym workout privileges, cardio & strength training.'}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center">1</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹{Number(selectedInvoice.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200">
                    <td colSpan="2" className="py-3 px-3 text-right font-bold text-slate-600">
                      Total Paid:
                    </td>
                    <td className="py-3 px-3 text-right text-base font-black text-emerald-600">
                      ₹{Number(selectedInvoice.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Stamp and signature */}
              <div className="pt-6 border-t border-slate-100 flex items-end justify-between text-xs">
                <div>
                  <p className="text-[11px] text-slate-400 italic">
                    * This is a computer generated digital receipt issued by RV FITNESS Narsobawadi.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-10 border-b border-slate-300 mx-auto"></div>
                  <span className="text-[11px] font-bold text-slate-600 block mt-1">Authorized Signatory</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setInvoiceModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" icon={Printer} onClick={handlePrint}>
                Print Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
