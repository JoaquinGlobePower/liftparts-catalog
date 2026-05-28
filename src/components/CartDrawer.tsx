import { useEffect, useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onRequestQuote: () => void;
}

export default function CartDrawer({ open, onClose, onRequestQuote }: CartDrawerProps) {
  const { items, totalUnits, dispatch } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => closeRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de cotización"
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col drawer-enter"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Carrito de cotización</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400 py-16">
              <ShoppingCart className="w-16 h-16 text-gray-200" />
              <p className="text-center text-gray-500 font-medium">
                Aún no has agregado productos a cotizar
              </p>
              <p className="text-sm text-center text-gray-400">
                Usa el botón "COTIZAR" en cualquier producto para agregarlo aquí.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.sku}
                  className="flex gap-3 items-start border-b border-gray-100 pb-4"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imagen}
                      alt={product.descripcion}
                      className="w-full h-full object-contain p-1"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).src = '/images/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 uppercase leading-tight line-clamp-2">
                      {product.descripcion}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{product.sku}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5 border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => dispatch({ type: 'SET_QTY', sku: product.sku, quantity: quantity - 1 })}
                          aria-label={`Disminuir cantidad de ${product.descripcion}`}
                          className="p-1 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-sm font-semibold min-w-[2rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => dispatch({ type: 'SET_QTY', sku: product.sku, quantity: quantity + 1 })}
                          aria-label={`Aumentar cantidad de ${product.descripcion}`}
                          className="p-1 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => dispatch({ type: 'REMOVE', sku: product.sku })}
                    aria-label={`Eliminar ${product.descripcion} del carrito`}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3 bg-gray-50">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total de unidades:</span>
              <span className="font-bold text-gray-900">{totalUnits}</span>
            </div>
            <button
              onClick={onRequestQuote}
              className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
            >
              Solicitar cotización
            </button>
          </div>
        )}
      </div>
    </>
  );
}
