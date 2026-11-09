import React, { useState, useEffect } from 'react';
import { CalendarCheck, Clock } from 'lucide-react';
import { api } from '../../api';
import { Card, Badge, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function MemberAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMemberAttendance()
      .then(res => res.success && setAttendance(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Fetching your gym check-ins..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gym Attendance Log</h2>
          <p className="text-xs text-slate-500 mt-0.5">Historical verification of your presence at RV FITNESS.</p>
        </div>
        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
          Total Check-ins: {attendance.length} Sessions
        </span>
      </div>

      <Card>
        {attendance.length === 0 ? (
          <EmptyState title="No attendance logs" description="Check-in at the front desk when you arrive for a workout." icon={CalendarCheck} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200/80 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check-in Time</th>
                  <th className="py-3 px-4">Check-out Time</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{a.date}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" /> {a.check_in_time || 'Recorded'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{a.check_out_time || 'Session Finished'}</td>
                    <td className="py-3.5 px-4 text-right"><Badge>{a.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
