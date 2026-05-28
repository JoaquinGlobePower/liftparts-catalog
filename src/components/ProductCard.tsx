import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewMore: (product: Product) => void;
  onToast: (text: string) => void;
}

export default function ProductCard({ product, onViewMore, onToast }: ProductCardProps) {
  const { dispatch } = useCart();

  function handleCotizar() {
    dispatch({ type: 'ADD', product, quantity: 1 });
    const short = product.descripcion.length > 50
      ? product.descripcion.slice(0, 50) + '…'
      : product.descripcion;
    onToast(`${short} agregado al carrito`);
  }

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="bg-gray-50 aspect-square flex items-center justify-center p-4 overflow-hidden">
        <img
          src={product.imagen}
          alt={product.descripcion}
          className="w-full h-full object-contain"
          onError={e => {
            (e.currentTarget as HTMLImageElement).src = '/images/placeholder.svg';
          }}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p
          className="font-semibold text-gray-900 text-sm uppercase leading-tight line-clamp-2"
          title={product.descripcion}
        >
          {product.descripcion}
        </p>
        <p className="text-gray-400 text-xs">{product.sku}</p>

        {/* Actions */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-gray-100">
          <button
            onClick={() => onViewMore(product)}
            className="text-brand-700 text-xs font-semibold hover:text-brand-600 transition-colors whitespace-nowrap"
            aria-label={`Ver más detalles de ${product.descripcion}`}
          >
            VER MÁS →
          </button>
          <button
            onClick={handleCotizar}
            className="px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors whitespace-nowrap"
            aria-label={`Cotizar ${product.descripcion}`}
          >
            COTIZAR
          </button>
        </div>
      </div>
    </article>
  );
}
