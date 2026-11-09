import React, { useState, useEffect } from 'react';
import { CreditCard, Printer, FileText, MapPin } from 'lucide-react';
import { api } from '../../api';
import { Card, Badge, Button, Modal, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function MemberPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.getMemberPayments()
      .then(res => res.success && setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openInvoice = (p) => {
    setSelectedInvoice(p);
    setModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payments & Receipts</h2>
        <p className="text-xs text-slate-500 mt-0.5">Download or print digital tax receipts for your gym fee payments.</p>
      </div>

      <Card>
        {loading ? (
          <LoadingSpinner text="Fetching your payment history..." />
        ) : payments.length === 0 ? (
          <EmptyState title="No payments recorded" description="You have not made any payments yet." icon={CreditCard} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Mode & Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.payment_id}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.payment_date}</td>
                    <td className="py-3.5 px-4">
                      <Badge>{p.payment_method}</Badge>
                      {p.transaction_reference && (
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{p.transaction_reference}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600 text-sm">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4"><Badge>{p.payment_status}</Badge></td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="outline" size="sm" icon={FileText} onClick={() => openInvoice(p)}>
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

      {/* INVOICE MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Gym Fee Receipt" size="lg">
        {selectedInvoice && (
          <div>
            <div id="printable-invoice" className="p-6 bg-white border border-slate-200 rounded-2xl text-slate-800 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 font-black text-xl flex items-center justify-center">
                      RV
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-wider">RV FITNESS</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    Near Datta Mandir, Narsobawadi, Maharashtra 416104
                  </p>
                  <p className="text-[11px] text-slate-400">Phone: +91 98230 12345</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Official Receipt</span>
                  <span className="text-base font-extrabold font-mono text-slate-900 block mt-1">{selectedInvoice.payment_id}</span>
                  <span className="text-xs text-slate-500 block">Date: {selectedInvoice.payment_date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Billed Member:</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">{selectedInvoice.member_name || selectedInvoice.member_id}</p>
                  <p className="text-slate-600">Member ID: {selectedInvoice.member_id}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Payment Details:</span>
                  <p className="font-bold text-slate-800 mt-1">Method: {selectedInvoice.payment_method}</p>
                  <p className="text-slate-500 font-mono text-[11px]">Ref: {selectedInvoice.transaction_reference || 'Counter Receipt'}</p>
                </div>
              </div>

              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-t border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-3 font-bold text-slate-700">Description</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">Gym Membership Subscription</p>
                      <p className="text-[11px] text-slate-500">{selectedInvoice.notes || 'Full gym facility access'}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹{Number(selectedInvoice.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200">
                    <td className="py-3 px-3 text-right font-bold text-slate-600">Total Paid:</td>
                    <td className="py-3 px-3 text-right text-base font-black text-emerald-600">
                      ₹{Number(selectedInvoice.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="pt-6 border-t border-slate-100 flex items-end justify-between text-xs">
                <p className="text-[11px] text-slate-400 italic">* Computer generated digital tax receipt from RV FITNESS Narsobawadi.</p>
                <div className="text-center">
                  <div className="w-28 h-8 border-b border-slate-300 mx-auto"></div>
                  <span className="text-[10px] font-bold text-slate-600 block mt-1">Authorized Desk</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Close</Button>
              <Button variant="primary" icon={Printer} onClick={handlePrint}>Print Receipt</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
