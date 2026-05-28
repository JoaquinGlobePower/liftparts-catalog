import { useCallback, useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Filters from './components/Filters';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import QuoteRequestModal from './components/QuoteRequestModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { useFilteredProducts } from './hooks/useFilteredProducts';
import type { Product, ToastMessage } from './types';
import productsData from './data/products.json';

const allProducts = productsData as Product[];

function AppContent() {
  const [search, setSearch] = useState('');
  const [equipo, setEquipo] = useState('');
  const [marca, setMarca] = useState('');
  const [page, setPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const filteredProducts = useFilteredProducts(allProducts, { search, equipo, marca });

  useEffect(() => { setPage(1); }, [search, equipo, marca]);

  function clearFilters() {
    setSearch('');
    setEquipo('');
    setMarca('');
  }

  const addToast = useCallback((text: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts, { id, text }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(ts => ts.filter(t => t.id !== id));
  }, []);

  function handleRequestQuote() {
    setCartOpen(false);
    setQuoteOpen(true);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Filters
        products={allProducts}
        search={search}
        equipo={equipo}
        marca={marca}
        onSearchChange={setSearch}
        onEquipoChange={setEquipo}
        onMarcaChange={setMarca}
        onClear={clearFilters}
        resultCount={filteredProducts.length}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid
          products={filteredProducts}
          currentPage={page}
          onPageChange={setPage}
          onViewMore={setSelectedProduct}
          onToast={addToast}
        />
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToast={addToast}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onRequestQuote={handleRequestQuote}
      />

      <QuoteRequestModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
