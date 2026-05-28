import { useEffect, useRef, useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onToast: (text: string) => void;
}

export default function ProductModal({ product, onClose, onToast }: ProductModalProps) {
  const { dispatch } = useCart();
  const [qty, setQty] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setQty(1);
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  // Trap focus inside modal
  useEffect(() => {
    if (!product) return;
    const prev = document.activeElement as HTMLElement;
    return () => prev?.focus?.();
  }, [product]);

  if (!product) return null;

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleCotizar() {
    if (!product) return;
    dispatch({ type: 'ADD', product, quantity: qty });
    const short = product.descripcion.length > 50
      ? product.descripcion.slice(0, 50) + '…'
      : product.descripcion;
    onToast(`${short} agregado al carrito`);
    onClose();
  }

  const details: { label: string; value: string }[] = [
    { label: 'SKU', value: product.sku },
    { label: 'Marca', value: product.marca },
    { label: 'Equipo', value: product.equipo },
    { label: 'Part Number Fabricante', value: product.partNumberFabricante },
    { label: 'Código Globe', value: product.codigoGlobe },
  ].filter(d => d.value);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de ${product.descripcion}`}
    >
      <div
        ref={containerRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
            Detalle del producto
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: 2 columns */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-gray-50 rounded-xl aspect-square flex items-center justify-center p-6">
            <img
              src={product.imagen}
              alt={product.descripcion}
              className="w-full h-full object-contain"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = '/images/placeholder.svg';
              }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold text-gray-900 uppercase leading-snug">
              {product.descripcion}
            </h2>

            <table className="w-full text-sm border-collapse">
              <tbody>
                {details.map(d => (
                  <tr key={d.label} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-500 font-medium whitespace-nowrap w-1/3">
                      {d.label}
                    </td>
                    <td className="py-2 text-gray-800 font-semibold break-all">{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Quantity selector */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-medium text-gray-600">Cantidad:</span>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  aria-label="Disminuir cantidad"
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-40"
                  disabled={qty <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  aria-label="Cantidad"
                  className="w-12 text-center text-sm font-semibold border-0 focus:outline-none focus:ring-0 py-2"
                />
                <button
                  onClick={() => setQty(q => q + 1)}
                  aria-label="Aumentar cantidad"
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleCotizar}
              className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors text-base focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
            >
              COTIZAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
