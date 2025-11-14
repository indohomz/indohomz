import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { cn } from '../../utils/cn';
import type { DataTableProps, Column } from './types';

function sortData<T>(rows: T[], col?: Column<T>, dir: 'asc' | 'desc' = 'asc') {
  if (!col || !col.sortable) return rows;
  const key = col.key as keyof T;
  return [...rows].sort((a: any, b: any) => {
    const av = typeof key === 'string' ? (a as any)[key] : (a as any)[key as any];
    const bv = typeof key === 'string' ? (b as any)[key] : (b as any)[key as any];
    if (av == null && bv == null) return 0;
    if (av == null) return dir === 'asc' ? -1 : 1;
    if (bv == null) return dir === 'asc' ? 1 : -1;
    if (typeof av === 'number' && typeof bv === 'number') return dir === 'asc' ? av - bv : bv - av;
    return dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
}

function filterData<T>(rows: T[], q: string, keys: (keyof T)[] = []) {
  const query = q.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) => {
    if (!keys.length) return JSON.stringify(row).toLowerCase().includes(query);
    return keys.some((k) => String((row as any)[k]).toLowerCase().includes(query));
  });
}

export default function DataTable<T>({
  columns,
  data,
  loading,
  pageSizeOptions = [5, 10, 20, 50],
  initialPageSize = 10,
  searchableKeys,
  onRowClick,
  dense,
  selectable = false,
  getRowId,
  onSelectionChange,
  initialVisibility,
  // controlled mode
  serverSide,
  page: cPage,
  totalItems,
  onPageChange,
  pageSize: cPageSize,
  onPageSizeChange,
  sort: cSort,
  onSortChange,
  query: cQuery,
  onQueryChange,
}: DataTableProps<T>) {
  const isServer = !!serverSide;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [query, setQuery] = useState('');
  const [sortCol, setSortCol] = useState<Column<T> | undefined>(undefined);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selection, setSelection] = useState<Array<string | number>>([]);
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
    const v: Record<string, boolean> = {};
    columns.forEach(c => { v[String(c.key)] = initialVisibility?.[String(c.key)] ?? true; });
    return v;
  });

  const effectiveQuery = isServer ? (cQuery ?? '') : query;
  const debounced = useDebouncedValue(effectiveQuery, 250);

  const filtered = useMemo(() => {
    if (isServer) return data ?? [];
    return filterData(data ?? [], debounced, searchableKeys);
  }, [data, debounced, searchableKeys, isServer]);

  const sorted = useMemo(() => {
    if (isServer) return filtered;
    return sortData(filtered, sortCol, sortDir);
  }, [filtered, sortCol, sortDir, isServer]);

  const usedPageSize = isServer ? (cPageSize ?? pageSize) : pageSize;
  const controlledPage = isServer ? (cPage ?? 1) : page;
  const total = isServer ? (totalItems ?? data.length) : sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / usedPageSize));
  const currentPage = Math.min(controlledPage, totalPages);
  const start = (currentPage - 1) * usedPageSize;
  const visible = isServer ? (sorted ?? []) : sorted.slice(start, start + usedPageSize);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    if (isServer) {
      const key = String(col.key);
      const next: { key: string; dir: 'asc' | 'desc' } = cSort && cSort.key === key ? { key, dir: cSort.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' };
      onSortChange?.(next);
      return;
    }
    if (sortCol?.key === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const toggleAll = (checked: boolean) => {
    if (!selectable) return;
    const ids = checked ? visible.map((row, idx) => (getRowId ? getRowId(row, start + idx) : start + idx)) : [];
    setSelection(ids as Array<string | number>);
    onSelectionChange?.(ids as Array<string | number>);
  };

  const toggleOne = (row: T, idx: number, checked: boolean) => {
    const id = getRowId ? getRowId(row, idx) : idx;
    setSelection(prev => {
      const next = checked ? Array.from(new Set([...prev, id])) : prev.filter(x => x !== id);
      onSelectionChange?.(next);
      return next;
    });
  };

  const allOnPageSelected = selectable && visible.every((row, i) => selection.includes(getRowId ? getRowId(row, start + i) : start + i));
  const someOnPageSelected = selectable && !allOnPageSelected && visible.some((row, i) => selection.includes(getRowId ? getRowId(row, start + i) : start + i));

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            value={isServer ? (cQuery ?? '') : query}
            onChange={(e) => {
              if (isServer) {
                onPageChange?.(1);
                onQueryChange?.(e.target.value);
              } else {
                setPage(1);
                setQuery(e.target.value);
              }
            }}
            placeholder="Search..."
            className="input pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Column visibility toggles */}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            {columns.map((c) => (
              <label key={String(c.key)} className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300">
                <input type="checkbox" className="h-3.5 w-3.5" checked={!!visibility[String(c.key)]} onChange={(e) => setVisibility(v => ({ ...v, [String(c.key)]: e.target.checked }))} />
                {c.header}
              </label>
            ))}
          </div>
          <label className="text-sm text-neutral-500">Rows:</label>
          <select
            value={isServer ? (cPageSize ?? pageSize) : pageSize}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (isServer) {
                onPageChange?.(1);
                onPageSizeChange?.(val);
              } else {
                setPage(1);
                setPageSize(val);
              }
            }}
            className="input h-9 w-24"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className={cn('min-w-full divide-y divide-neutral-200 dark:divide-neutral-700', dense ? 'text-sm' : 'text-base')}>
          <thead className="bg-white dark:bg-neutral-900">
            <tr>
              {selectable && (
                <th className="px-4 py-3">
                  <input
                    aria-label="Select all on page"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={!!allOnPageSelected}
                    ref={el => { if (el) el.indeterminate = Boolean(someOnPageSelected); }}
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((col) => (
                visibility[String(col.key)] && (
                <th key={String(col.key)} className={cn('px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 select-none', col.align === 'right' && 'text-right', col.align === 'center' && 'text-center')}>
                  <button className={cn('inline-flex items-center gap-1', col.sortable && 'hover:text-neutral-800 dark:hover:text-neutral-200')} onClick={() => handleSort(col)}>
                    {col.header}
                    {!isServer && sortCol?.key === col.key && (
                      sortDir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                    )}
                    {isServer && cSort?.key === String(col.key) && (
                      cSort.dir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </th>
                )
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-neutral-500">Loading…</td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-neutral-500">No data</td></tr>
            ) : (
              visible.map((row: T, idx: number) => (
                <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-default" onClick={() => onRowClick?.(row)}>
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        aria-label="Select row"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selection.includes(getRowId ? getRowId(row, start + idx) : (start + idx))}
                        onChange={(e) => toggleOne(row, start + idx, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const key = col.key as keyof T;
                    const content = col.render ? col.render(row) : (row as any)[key];
                    return visibility[String(col.key)] ? (
                      <td key={String(col.key)} className={cn('px-4 py-3 text-neutral-800 dark:text-neutral-200', col.align === 'right' && 'text-right', col.align === 'center' && 'text-center')} style={{ width: col.width }}>
                        {content}
                      </td>
                    ) : null;
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
        <div>
          Page {currentPage} of {totalPages} · {total} items {selectable && selection.length > 0 ? `· ${selection.length} selected` : ''}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost h-8 px-3"
            onClick={() => {
              if (isServer) onPageChange?.(Math.max(1, currentPage - 1)); else setPage((p) => Math.max(1, p - 1));
            }}
            disabled={currentPage === 1}
          >Prev</button>
          <button
            className="btn btn-ghost h-8 px-3"
            onClick={() => {
              if (isServer) onPageChange?.(Math.min(totalPages, currentPage + 1)); else setPage((p) => Math.min(totalPages, p + 1));
            }}
            disabled={currentPage === totalPages}
          >Next</button>
        </div>
      </div>
    </div>
  );
}
