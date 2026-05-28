import type { Product } from '../types';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

const PAGE_SIZE = 8;

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewMore: (product: Product) => void;
  onToast: (text: string) => void;
}

export default function ProductGrid({
  products,
  currentPage,
  onPageChange,
  onViewMore,
  onToast,
}: ProductGridProps) {
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageProducts = products.slice(start, start + PAGE_SIZE);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" viewBox="0 0 64 64">
          <rect x="8" y="8" width="48" height="48" rx="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M24 32h16M32 24v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className="text-lg font-medium text-gray-500">No se encontraron productos</p>
        <p className="text-sm mt-1">Intenta cambiar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pageProducts.map(product => (
          <ProductCard
            key={product.sku}
            product={product}
            onViewMore={onViewMore}
            onToast={onToast}
          />
        ))}
      </div>
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
