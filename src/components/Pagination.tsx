import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1 py-8"
      aria-label="Paginación"
    >
      <PageBtn
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="Primera página"
      >
        <ChevronsLeft className="w-4 h-4" />
      </PageBtn>

      <PageBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </PageBtn>

      <span className="px-4 py-2 text-sm text-gray-600 select-none">
        página <strong className="text-gray-900">{currentPage}</strong> de{' '}
        <strong className="text-gray-900">{totalPages}</strong>
      </span>

      <PageBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </PageBtn>

      <PageBtn
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Última página"
      >
        <ChevronsRight className="w-4 h-4" />
      </PageBtn>
    </nav>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  'aria-label': string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-colors"
    >
      {children}
    </button>
  );
}
