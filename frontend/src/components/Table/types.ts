export type CellRenderer<T> = (row: T) => React.ReactNode;

export interface Column<T> {
  key: keyof T | string; // allow custom keys when using render
  header: string;
  width?: string | number;
  align?: 'left' | 'right' | 'center';
  render?: CellRenderer<T>;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  searchableKeys?: (keyof T)[];
  onRowClick?: (row: T) => void;
  dense?: boolean;
  // Selection
  selectable?: boolean;
  getRowId?: (row: T, index: number) => string | number;
  onSelectionChange?: (ids: Array<string | number>) => void;
  // Column visibility
  initialVisibility?: Record<string, boolean>;
  // Optional server-side controlled mode
  serverSide?: boolean;
  // Controlled pagination
  page?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  // Controlled sorting
  sort?: { key: string; dir: 'asc' | 'desc' };
  onSortChange?: (sort: { key: string; dir: 'asc' | 'desc' }) => void;
  // Controlled query/search
  query?: string;
  onQueryChange?: (q: string) => void;
}
