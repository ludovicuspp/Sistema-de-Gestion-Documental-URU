import { useCallback, useEffect, useRef, useState } from "react";
import type { PageResponse } from "@/services/api/http";

export interface PagedListState<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  reload: () => void;
}

/**
 * usePagedList - Hook
 *
 * Carga paginada contra endpoints que devuelven PageResponse<T>.
 * `load` recibe (page, size) y debe ser estable (useCallback) con los
 * filtros como dependencias; al cambiar los filtros, llamar setPage(0).
 */
export function usePagedList<T>(
  load: (page: number, size: number) => Promise<PageResponse<T>>,
  size = 20,
  onError?: (err: unknown) => void,
): PagedListState<T> {
  const [page, setPageState] = useState(0);
  const [items, setItems] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const requestSeq = useRef(0);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const setPage = useCallback((next: number) => {
    setPageState(Math.max(0, next));
  }, []);

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    const seq = ++requestSeq.current;
    setLoading(true);
    setError(null);
    load(page, size)
      .then((result) => {
        if (requestSeq.current !== seq) return;
        setItems(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((err: unknown) => {
        if (requestSeq.current !== seq) return;
        setError(err instanceof Error ? err.message : "Error inesperado");
        onErrorRef.current?.(err);
      })
      .finally(() => {
        if (requestSeq.current === seq) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, reloadToken, load]);

  return { items, page, totalPages, totalElements, loading, error, setPage, reload };
}
