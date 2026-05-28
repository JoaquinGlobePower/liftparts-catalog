import { useMemo } from 'react';
import type { Product } from '../types';

interface FiltersProps {
  products: Product[];
  search: string;
  equipo: string;
  marca: string;
  onSearchChange: (v: string) => void;
  onEquipoChange: (v: string) => void;
  onMarcaChange: (v: string) => void;
  onClear: () => void;
  resultCount: number;
}

export default function Filters({
  products,
  search,
  equipo,
  marca,
  onSearchChange,
  onEquipoChange,
  onMarcaChange,
  onClear,
  resultCount,
}: FiltersProps) {
  const equipos = useMemo(
    () => [...new Set(products.map(p => p.equipo).filter(Boolean))].sort(),
    [products]
  );
  const marcas = useMemo(
    () => [...new Set(products.map(p => p.marca).filter(Boolean))].sort(),
    [products]
  );

  const hasFilters = search || equipo || marca;

  return (
    <div className="bg-brand-950 border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="search"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Buscar por SKU, descripción, sinónimo..."
            aria-label="Buscar productos"
            className="flex-1 sm:max-w-md px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm"
          />

          {/* Equipo select */}
          <select
            value={equipo}
            onChange={e => onEquipoChange(e.target.value)}
            aria-label="Filtrar por equipo"
            className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm appearance-none cursor-pointer"
          >
            <option value="" className="bg-brand-950 text-white">Todos los equipos</option>
            {equipos.map(eq => (
              <option key={eq} value={eq} className="bg-brand-950 text-white">{eq}</option>
            ))}
          </select>

          {/* Marca select */}
          <select
            value={marca}
            onChange={e => onMarcaChange(e.target.value)}
            aria-label="Filtrar por marca"
            className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm appearance-none cursor-pointer"
          >
            <option value="" className="bg-brand-950 text-white">Todas las marcas</option>
            {marcas.map(m => (
              <option key={m} value={m} className="bg-brand-950 text-white">{m}</option>
            ))}
          </select>

          {/* Clear button */}
          {hasFilters && (
            <button
              onClick={onClear}
              className="px-4 py-2 rounded-lg bg-white text-brand-950 font-semibold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="text-gray-300 text-sm">
          Mostrando{' '}
          <span className="text-white font-semibold">{resultCount}</span>{' '}
          {resultCount === 1 ? 'producto' : 'productos'} en{' '}
          <span className="text-white font-semibold">
            {equipo || 'todos los equipos'}
          </span>
          {marca && (
            <>
              {' '}·{' '}
              <span className="text-white font-semibold">{marca}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
