import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  loading = false,
  disabled = false,
  ...props
}) {
  const base = "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 focus:ring-emerald-500 active:scale-[0.98]",
    accent: "bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold shadow-sm shadow-lime-500/25 focus:ring-lime-500 active:scale-[0.98]",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white focus:ring-slate-700",
    outline: "border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-300",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 focus:ring-rose-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5"
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
}

export function Badge({ children, variant = 'default', size = 'md' }) {
  const normalized = (typeof children === 'string' ? children.toLowerCase() : variant.toLowerCase());

  let style = "bg-slate-100 text-slate-700 border-slate-200";
  if (normalized === 'active' || normalized === 'completed' || normalized === 'present') {
    style = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  } else if (normalized === 'expired' || normalized === 'failed' || normalized === 'inactive' || normalized === 'absent') {
    style = "bg-rose-50 text-rose-700 border-rose-200/60";
  } else if (normalized === 'pending' || normalized === 'due') {
    style = "bg-amber-50 text-amber-700 border-amber-200/60";
  } else if (normalized === 'upi') {
    style = "bg-indigo-50 text-indigo-700 border-indigo-200/60";
  } else if (normalized === 'cash') {
    style = "bg-teal-50 text-teal-700 border-teal-200/60";
  } else if (normalized === 'card') {
    style = "bg-purple-50 text-purple-700 border-purple-200/60";
  }

  const sizes = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold"
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${style} ${sizes[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {children}
    </span>
  );
}

export function Card({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-100 overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald', trend }) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      border: 'border-emerald-100',
      glow: 'from-emerald-500/10'
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-100',
      glow: 'from-blue-500/10'
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-100',
      glow: 'from-amber-500/10'
    },
    rose: {
      bg: 'bg-rose-50',
      icon: 'text-rose-600',
      border: 'border-rose-100',
      glow: 'from-rose-500/10'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-100',
      glow: 'from-purple-500/10'
    }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className="relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm shadow-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">{title}</span>
          <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
          {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.icon}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span>↑</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`bg-white w-full ${sizeClasses[size] || sizeClasses.md} rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all`}>
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function Input({ label, error, helper, icon: Icon, className = '', labelClassName = '', ...props }) {
  const isDark = className.includes('bg-slate-900') || className.includes('bg-[#') || className.includes('text-white');

  return (
    <div className="space-y-1.5">
      {label && (
        <label className={`block text-xs font-semibold ${labelClassName || (isDark ? 'text-slate-300' : 'text-slate-700')}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
            error
              ? 'border-rose-400 bg-rose-50/20 text-rose-900 placeholder-rose-300'
              : isDark
              ? 'border-slate-700 bg-slate-900 text-white placeholder-slate-500'
              : 'border-slate-300 hover:border-slate-400 bg-white text-slate-900 placeholder-slate-400'
          } ${Icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      {helper && !error && <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{helper}</p>}
    </div>
  );
}

export function Select({ label, error, options = [], className = '', labelClassName = '', ...props }) {
  const isDark = className.includes('bg-slate-900') || className.includes('bg-[#') || className.includes('text-white');

  return (
    <div className="space-y-1.5">
      {label && (
        <label className={`block text-xs font-semibold ${labelClassName || (isDark ? 'text-slate-300' : 'text-slate-700')}`}>
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
          error
            ? 'border-rose-400 bg-rose-50/20 text-rose-900'
            : isDark
            ? 'border-slate-700 bg-slate-900 text-white'
            : 'border-slate-300 hover:border-slate-400 bg-white text-slate-900'
        } ${className}`}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', labelClassName = '', ...props }) {
  const isDark = className.includes('bg-slate-900') || className.includes('bg-[#') || className.includes('text-white');

  return (
    <div className="space-y-1.5">
      {label && (
        <label className={`block text-xs font-semibold ${labelClassName || (isDark ? 'text-slate-300' : 'text-slate-700')}`}>
          {label}
        </label>
      )}
      <textarea
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
          error
            ? 'border-rose-400 bg-rose-50/20 text-rose-900 placeholder-rose-300'
            : isDark
            ? 'border-slate-700 bg-slate-900 text-white placeholder-slate-500'
            : 'border-slate-300 hover:border-slate-400 bg-white text-slate-900 placeholder-slate-400'
        } ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon, action }) {
  return (
    <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
      {Icon && (
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export function LoadingSpinner({ text = 'Loading data...' }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-medium text-slate-500">{text}</p>
    </div>
  );
}
