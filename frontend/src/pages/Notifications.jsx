import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  CreditCard,
  UserPlus,
  Megaphone,
  Clock
} from 'lucide-react';
import { api } from '../api';
import {
  Button,
  Card,
  Badge,
  LoadingSpinner,
  EmptyState
} from '../components/UIComponents';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'expiry':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case 'member':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      default:
        return <Megaphone className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gym Notifications & Alerts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts for expiring packages, received payments, and gym broadcasts.
          </p>
        </div>
        <Button variant="outline" icon={CheckCheck} onClick={markAllRead}>
          Mark All as Read
        </Button>
      </div>

      {/* Notifications list */}
      <Card>
        {loading ? (
          <LoadingSpinner text="Fetching alerts..." />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="All caught up!"
            description="No active alerts or notices for the gym at this time."
            icon={Bell}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !n.read_status ? 'bg-emerald-50/30' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-sm mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                      {!n.read_status && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.read_status && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 whitespace-nowrap cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
