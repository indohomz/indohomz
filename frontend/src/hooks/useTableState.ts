import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from './useDebouncedValue';

export type SortState = { key: string; dir: 'asc' | 'desc' } | undefined;

export interface UseTableStateOptions<T> {
  /** Async query function expected to return paged rows plus total item count */
  queryFn: (params: { page: number; pageSize: number; sort?: SortState; search?: string }) => Promise<{ rows: T[]; total: number }>;
  initialPage?: number;
  initialPageSize?: number;
  debounceMs?: number;
}

export interface UseTableState<T> {
  page: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  sort: SortState;
  setSort: (s: SortState) => void;
  search: string;
  setSearch: (q: string) => void;
  rows: T[];
  total: number;
  loading: boolean;
  error: unknown;
  refetch: () => void;
}

/**
 * useTableState
 * Generic hook to manage server-side paginated/sorted/searched data for tables.
 * Keeps UI state and delegates data fetching to provided queryFn.
 * Designed so DataTable can later accept controlled props for server-side mode.
 */
export function useTableState<T>(opts: UseTableStateOptions<T>): UseTableState<T> {
  const {
    queryFn,
    initialPage = 1,
    initialPageSize = 10,
    debounceMs = 300,
  } = opts;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState<SortState>(undefined);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedValue(search, debounceMs);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['table', page, pageSize, sort?.key, sort?.dir, debouncedSearch],
    queryFn: () => queryFn({ page, pageSize, sort, search: debouncedSearch }),
    keepPreviousData: true,
  });

  const safeSetPage = useCallback((p: number) => {
    setPage(Math.max(1, p));
  }, []);

  const safeSetPageSize = useCallback((s: number) => {
    setPageSize(s);
    setPage(1); // reset to first page when page size changes
  }, []);

  const updateSort = useCallback((s: SortState) => {
    setSort(s);
    setPage(1); // reset pagination when sorting changes
  }, []);

  const updateSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1); // reset pagination when searching
  }, []);

  return {
    page,
    pageSize,
    setPage: safeSetPage,
    setPageSize: safeSetPageSize,
    sort,
    setSort: updateSort,
    search,
    setSearch: updateSearch,
    rows: data?.rows ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    error,
    refetch,
  };
}

export default useTableState;
