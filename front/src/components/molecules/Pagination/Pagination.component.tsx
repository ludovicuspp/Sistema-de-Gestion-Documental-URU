import { Button } from "@/components/atoms/Button";
import "./Pagination.css";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination - Molecule
 *
 * Controles Anterior/Siguiente con indicador "Página X de Y".
 * page es 0-based; se muestra 1-based al usuario.
 */
export const Pagination = ({ page, totalPages, totalElements, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <nav className="pagination" aria-label="Paginación">
      <Button
        type="button"
        variant="secondary"
        size="small"
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>
      <span className="pagination__label">
        Página {page + 1} de {totalPages}
        {totalElements != null ? ` (${totalElements} registros)` : ""}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="small"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </Button>
    </nav>
  );
};
