import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Users,
  IndianRupee,
  CreditCard,
  CalendarCheck,
  Award,
  Layers
} from 'lucide-react';
import { api } from '../api';
import {
  Button,
  Card,
  StatCard,
  LoadingSpinner
} from '../components/UIComponents';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await api.getReports();
      if (res.success) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!reportData) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Members', reportData.membershipStats?.totalMembers],
      ['Active Members', reportData.membershipStats?.active],
      ['Expired Members', reportData.membershipStats?.expired],
      ['Total Revenue (INR)', reportData.financialStats?.totalIncome],
      ['UPI Collections (INR)', reportData.financialStats?.upiIncome],
      ['Cash Collections (INR)', reportData.financialStats?.cashIncome],
      ['Card Collections (INR)', reportData.financialStats?.cardIncome],
      ['Total Invoices Issued', reportData.financialStats?.totalInvoices],
      ['Active Trainers', reportData.trainerCount],
      ['Total Attendance Entries', reportData.totalAttendanceLogs]
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RV_FITNESS_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingSpinner text="Compiling financial & gym performance reports..." />;
  }

  const mem = reportData?.membershipStats || {};
  const fin = reportData?.financialStats || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Business Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real data generated from verified database ledger, member enrollments, and revenue channels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Printer} onClick={() => window.print()}>
            Print Report
          </Button>
          <Button variant="primary" icon={Download} onClick={exportCSV}>
            Export to CSV
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={`₹${Number(fin.totalIncome || 0).toLocaleString('en-IN')}`}
          subtitle={`${fin.totalInvoices || 0} Total invoices`}
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard
          title="Active Members"
          value={mem.active || 0}
          subtitle={`Out of ${mem.totalMembers || 0} total enrolled`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Gym Trainers"
          value={reportData?.trainerCount || 0}
          subtitle="Certified staff on floor"
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Attendance Logs"
          value={reportData?.totalAttendanceLogs || 0}
          subtitle="Total member check-in visits"
          icon={CalendarCheck}
          color="amber"
        />
      </div>

      {/* Revenue Payment Modes Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Payment Method Revenue Breakdown" subtitle="Distribution of collections across payment options">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>UPI Payments (GPay / PhonePe)</span>
                <span className="text-indigo-600">₹{Number(fin.upiIncome || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full"
                  style={{
                    width: `${fin.totalIncome ? (fin.upiIncome / fin.totalIncome) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Cash Collections</span>
                <span className="text-teal-600">₹{Number(fin.cashIncome || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-teal-500 h-2.5 rounded-full"
                  style={{
                    width: `${fin.totalIncome ? (fin.cashIncome / fin.totalIncome) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Debit / Credit Card (POS)</span>
                <span className="text-purple-600">₹{Number(fin.cardIncome || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-500 h-2.5 rounded-full"
                  style={{
                    width: `${fin.totalIncome ? (fin.cardIncome / fin.totalIncome) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Membership Retention Ratio */}
        <Card title="Membership Status Ratio" subtitle="Active vs expired membership status">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-xs text-emerald-700 font-bold uppercase">Active</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">{mem.active || 0}</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <span className="text-xs text-rose-700 font-bold uppercase">Expired</span>
                <p className="text-2xl font-black text-rose-700 mt-1">{mem.expired || 0}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
                <span className="text-xs text-slate-700 font-bold uppercase">Inactive</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{mem.inactive || 0}</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-2">
              Maintain an active retention above 75% through periodic renewal reminder alerts and customized workout consultations.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
