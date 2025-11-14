import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import type { Column } from '../components/Table/types'
import DataTable from '../components/Table/DataTable'
import { productService, type Product } from '../services/api'
import EmptyState from '../components/Common/EmptyState'
import ErrorState from '../components/Common/ErrorState'
import { Package, MoreVertical, Edit2, Trash2, Plus } from 'lucide-react'
import PageHeader from '../components/Layout/PageHeader'

export default function Inventory() {
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [category, setCategory] = useState<string>('All')
  const [dense, setDense] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inventory-products'],
    queryFn: () => productService.getProducts({ limit: 500 }).then(res => res.data),
    staleTime: 60_000,
  })

  const categories = useMemo(() => {
    const set = new Set<string>()
    ;(data ?? []).forEach(p => { if (p.category) set.add(p.category) })
    return Array.from(set.values()).sort()
  }, [data])

  const rows = useMemo(() => {
    const list = (data ?? []).filter(p => category === 'All' || p.category === category)
    if (filter === 'all') return list
    if (filter === 'low') return list.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.reorder_level)
    return list.filter(p => p.stock_quantity === 0)
  }, [data, filter, category])

  const columns: Column<Product>[] = useMemo(() => ([
    { key: 'name', header: 'Product', sortable: true, render: (p) => (
      <div className="space-y-0.5">
        <div className="font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          {p.name}
          {p.stock_quantity === 0 && <span className="inline-flex px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-medium">OUT</span>}
          {p.stock_quantity > 0 && p.stock_quantity <= p.reorder_level && <span className="inline-flex px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-medium">LOW</span>}
        </div>
        <div className="text-xs text-neutral-500">SKU: {p.sku}</div>
      </div>
    )},
    { key: 'category', header: 'Category', sortable: true },
    { key: 'stock_quantity', header: 'In Stock', sortable: true, align: 'right' },
    { key: 'reorder_level', header: 'Reorder Level', sortable: true, align: 'right' },
    { key: 'status', header: 'Status', render: (p) => {
      const out = p.stock_quantity === 0
      const low = !out && p.stock_quantity <= p.reorder_level
      return (
        <span className={`badge ${out ? 'badge-danger' : low ? 'badge-warning' : 'bg-green-100 text-green-700'}`}>
          {out ? 'Out of stock' : low ? 'Low' : 'In stock'}
        </span>
      )
    } },
    { key: 'actions', header: '', render: (p) => (
      <div className="relative text-right" onMouseLeave={() => setMenuOpenId(id => id === p.id ? null : id)}>
        <button
          aria-label="Row actions"
          onClick={(e) => { e.stopPropagation(); setMenuOpenId(id => id === p.id ? null : p.id) }}
          className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpenId === p.id && (
          <div className="absolute right-0 mt-1 w-36 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg z-10">
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => alert(`View ${p.name}`)}>
              <Package className="h-4 w-4" /> View
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => alert(`Edit ${p.name}`)}>
              <Edit2 className="h-4 w-4" /> Edit
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-neutral-700" onClick={() => confirm('Delete product?') && alert(`Delete ${p.name}`)}>
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>
    ) }
  ]), [menuOpenId])

  return (
    <div className="p-6">
      <PageHeader
        title="Inventory Management"
        subtitle={`Tracking ${data?.length ?? 0} products across ${categories.length} categories.`}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden" role="group">
              <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-sm ${filter==='all' ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'} hover:bg-neutral-50 dark:hover:bg-neutral-700`}>All</button>
              <button onClick={() => setFilter('low')} className={`px-3 py-1.5 text-sm ${filter==='low' ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'} hover:bg-neutral-50 dark:hover:bg-neutral-700`}>Low</button>
              <button onClick={() => setFilter('out')} className={`px-3 py-1.5 text-sm ${filter==='out' ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'} hover:bg-neutral-50 dark:hover:bg-neutral-700`}>Out</button>
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input h-9 w-40">
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <input type="checkbox" checked={dense} onChange={() => setDense(d => !d)} className="rounded" /> Dense
            </label>
            <button className="btn btn-primary">
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>
        }
      />

      <motion.div 
        className="card p-0 mt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !isLoading && (data?.length ?? 0) === 0 ? (
          <EmptyState variant="compact" title="No inventory items" description="Add products to start tracking stock levels." icon={Package} action={<button className="btn btn-primary">Add Product</button>} />
        ) : (
          <DataTable 
            columns={columns} 
            data={rows} 
            loading={isLoading} 
            searchableKeys={["name", "sku", "category"] as (keyof Product)[]} 
            dense={dense}
            selectable
            getRowId={(p) => p.id}
            onSelectionChange={(ids) => console.log('Selected inventory IDs', ids)}
            initialVisibility={{ reorder_level: false }}
          />
        )}
      </motion.div>
    </div>
  )
}
