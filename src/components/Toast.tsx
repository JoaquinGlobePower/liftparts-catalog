import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div
      aria-live="polite"
      aria-label="Notificaciones"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exit = setTimeout(() => setExiting(true), 2000);
    const remove = setTimeout(() => onRemove(toast.id), 2500);
    return () => { clearTimeout(exit); clearTimeout(remove); };
  }, [toast.id, onRemove]);

  return (
    <div
      role="status"
      className={`flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg pointer-events-auto text-sm ${
        exiting ? 'toast-exit' : 'toast-enter'
      }`}
    >
      <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
      <span>{toast.text}</span>
    </div>
  );
}
