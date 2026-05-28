import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface QuoteRequestModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
}

const EMPTY: FormData = { nombre: '', empresa: '', email: '', telefono: '', mensaje: '' };

export default function QuoteRequestModal({ open, onClose }: QuoteRequestModalProps) {
  const { items, dispatch } = useCart();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setSubmitted(false);
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function handleClose() {
    onClose();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, items };
    console.log('Solicitud de cotización:', payload);
    setSubmitted(true);
    dispatch({ type: 'CLEAR' });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Solicitar cotización"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Solicitar cotización</h2>
          <button
            ref={closeRef}
            onClick={handleClose}
            aria-label="Cerrar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">¡Solicitud enviada!</h3>
              <p className="text-gray-500">
                Hemos recibido tu solicitud. Te contactaremos pronto.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 px-6 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre *" name="nombre" value={form.nombre} onChange={handleChange} required />
                <Field label="Empresa" name="empresa" value={form.empresa} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email *" name="email" type="email" value={form.email} onChange={handleChange} required />
                <Field label="Teléfono" name="telefono" type="tel" value={form.telefono} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Agrega cualquier información adicional sobre tu solicitud..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-brand-50 rounded-xl p-4 text-sm text-brand-900">
                <p className="font-semibold mb-1">Resumen del carrito</p>
                <p className="text-brand-700">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'} ·{' '}
                  {items.reduce((s, i) => s + i.quantity, 0)} unidades totales
                </p>
              </div>

              <button
                type="submit"
                disabled={!form.nombre || !form.email}
                className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
              >
                Enviar solicitud
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
      />
    </div>
  );
}
