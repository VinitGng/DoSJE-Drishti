import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
  CloudCheck,
  Cloud,
  WifiOff,
  Wifi,
} from 'lucide-react';
import { SyncToast } from '../../types';

export const ToastContainer: React.FC = () => {
  const { syncToasts, dismissSyncToast } = useApp();

  if (syncToasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {syncToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissSyncToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: SyncToast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CloudCheck className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Cloud className="w-5 h-5 text-indigo-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-950/40',
    warning: 'border-amber-500/40 bg-slate-900/95 shadow-amber-950/40',
    info: 'border-indigo-500/40 bg-slate-900/95 shadow-indigo-950/40',
    error: 'border-rose-500/40 bg-slate-900/95 shadow-rose-950/40',
  };

  const badgeColors = {
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    info: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    error: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md text-white transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${borders[toast.type]}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-1 rounded-lg bg-slate-800/80 mt-0.5">
          {icons[toast.type]}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-white truncate">{toast.title}</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${badgeColors[toast.type]}`}>
              {toast.type === 'success' ? 'FIREBASE SYNC' : toast.type.toUpperCase()}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">{toast.message}</p>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
            <span>{toast.timestamp}</span>
            {toast.itemCount !== undefined && toast.itemCount > 0 && (
              <span className="text-emerald-400 font-semibold">
                ✓ {toast.itemCount} Record{toast.itemCount > 1 ? 's' : ''} Committed
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg transition-colors cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Auto-dismiss timer progress bar */}
      <div className="mt-2.5 h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full animate-toast-timer ${
            toast.type === 'success'
              ? 'bg-emerald-400'
              : toast.type === 'warning'
              ? 'bg-amber-400'
              : toast.type === 'error'
              ? 'bg-rose-400'
              : 'bg-indigo-400'
          }`}
          style={{
            animation: 'toastCountdown 5.5s linear forwards',
          }}
        />
      </div>
    </div>
  );
};
