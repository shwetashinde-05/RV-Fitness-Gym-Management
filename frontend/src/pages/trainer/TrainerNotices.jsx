import React, { useState, useEffect } from 'react';
import { Bell, Clock } from 'lucide-react';
import { api } from '../../api';
import { Card, LoadingSpinner, EmptyState } from '../../components/UIComponents';

export default function TrainerNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrainerDashboard()
      .then(res => res.success && setNotices(res.data.notices || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trainer Notices & Announcements</h2>
        <p className="text-xs text-slate-500 mt-0.5">Official gym updates and admin communications.</p>
      </div>

      <Card>
        {loading ? (
          <LoadingSpinner text="Fetching notices..." />
        ) : notices.length === 0 ? (
          <EmptyState title="No active announcements" description="Check back later for updates from management." icon={Bell} />
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {notices.map((n) => (
              <div key={n.id} className="p-4 space-y-1">
                <span className="font-bold text-slate-900 text-sm block">{n.title}</span>
                <p className="text-slate-600">{n.message}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
