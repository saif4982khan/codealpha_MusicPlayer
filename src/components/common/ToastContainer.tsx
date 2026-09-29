import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePlayerStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-28 right-4 lg:right-8 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#292D36]/95 backdrop-blur-md border border-white/10 shadow-2xl text-sm font-medium text-white transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-[#FF8A1F] shrink-0" />
            )}
            {toast.type === 'warning' && (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            {(!toast.type || toast.type === 'info') && (
              <Info className="w-5 h-5 text-[#FF8A1F] shrink-0" />
            )}
            <span className="leading-snug">{toast.text}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-white/50 hover:text-white rounded-lg transition-colors shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
