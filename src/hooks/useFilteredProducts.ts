import { useMemo } from 'react';
import type { Product } from '../types';

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

interface Filters {
  search: string;
  equipo: string;
  marca: string;
}

export function useFilteredProducts(products: Product[], filters: Filters) {
  return useMemo(() => {
    const q = normalize(filters.search.trim());

    return products.filter(p => {
      if (filters.equipo && p.equipo !== filters.equipo) return false;
      if (filters.marca && p.marca !== filters.marca) return false;

      if (q) {
        const haystack = normalize(
          [p.sku, p.descripcion, p.partNumberFabricante, p.codigoGlobe, p.subNombres].join(' ')
        );
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [products, filters]);
}
