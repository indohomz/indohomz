import React, { useMemo, useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import DataTable from '../Table/DataTable'
import type { Column } from '../Table/types'

export interface ProductItem {
  id: number
  name: string
  sku: string
  stock: number
  price: number
}

interface Props {
  products: ProductItem[]
  onEdit?: (p: ProductItem) => void
  onDelete?: (id: number) => void
}

const ProductsList: React.FC<Props> = ({ products, onEdit, onDelete }) => {
  const [filter, setFilter] = useState<'all' | 'low' | 'out' | 'in'>('all')

  const filtered = useMemo(() => {
    const list = products
    if (filter === 'all') return list
    if (filter === 'out') return list.filter(p => p.stock === 0)
    if (filter === 'low') return list.filter(p => p.stock > 0 && p.stock <= 10)
    return list.filter(p => p.stock > 10)
  }, [products, filter])
  const columns: Column<ProductItem>[] = useMemo(() => ([
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (p) => (
        <div>
          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">{p.name}
            {p.stock === 0 && <span className="inline-flex px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-medium">OUT</span>}
            {p.stock > 0 && p.stock <= 10 && <span className="inline-flex px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-medium">LOW</span>}
          </div>
          <div className="text-xs text-gray-500">SKU: {p.sku}</div>
        </div>
      )
    },
    { key: 'sku', header: 'SKU', sortable: true },
    { key: 'stock', header: 'Stock', sortable: true, render: (p) => (
      <span className={p.stock === 0 ? 'text-red-500' : ''}>{p.stock}</span>
    ) },
    { key: 'price', header: 'Price', sortable: true, align: 'right', render: (p) => `$${p.price.toFixed(2)}` },
    { key: 'actions', header: '', render: (p) => (
      <div className="text-right">
        <button title="Edit" onClick={() => onEdit && onEdit(p)} className="p-2 mr-2 text-gray-500 hover:text-primary-600"><Edit2 className="h-4 w-4"/></button>
        <button title="Delete" onClick={() => onDelete && onDelete(p.id)} className="p-2 text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
      </div>
    ) }
  ]), [onEdit, onDelete]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="flex items-center space-x-2">
          <button className="btn btn-outline" title="Import CSV">Import</button>
          <button className="btn btn-primary" title="Add product">Add Product</button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden" role="group" aria-label="Stock filter">
          <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-sm ${filter==='all' ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}>All</button>
          <button onClick={() => setFilter('in')} className={`px-3 py-1.5 text-sm ${filter==='in' ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}>In Stock</button>
          <button onClick={() => setFilter('low')} className={`px-3 py-1.5 text-sm ${filter==='low' ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}>Low</button>
          <button onClick={() => setFilter('out')} className={`px-3 py-1.5 text-sm ${filter==='out' ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}>Out</button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        searchableKeys={["name", "sku"] as (keyof ProductItem)[]}
        initialPageSize={10}
      />
    </div>
  );
}

export default ProductsList
