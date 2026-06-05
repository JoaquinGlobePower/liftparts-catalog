import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCartOpen: () => void;
}

export default function Header({ onCartOpen }: HeaderProps) {
  const { totalItems } = useCart();

  return (
    <header className="bg-brand-950 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <img src="/LogoLiftParts.svg" alt="LiftParts Logo" className="h-10" />

        {/* Cart button */}
        <button
          onClick={onCartOpen}
          aria-label={`Abrir carrito de cotización, ${totalItems} productos`}
          className="relative p-2 rounded-lg hover:bg-brand-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <ShoppingCart className="w-7 h-7 text-white" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
