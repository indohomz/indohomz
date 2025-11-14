import { useState } from 'react'
import { Package, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import EmptyState from '../components/Common/EmptyState'
import ProductsManager from '../components/Products/ProductsManager'
import PageHeader from '../components/Layout/PageHeader'

export default function Products() {
  const [empty, setEmpty] = useState(false)

  return (
    <div className="p-6">
      <PageHeader
        title="Product Catalog"
        subtitle="Manage all products, categories, and variants."
        actions={
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <input type="checkbox" checked={empty} onChange={() => setEmpty(e => !e)} className="rounded" /> Test Empty State
            </label>
            <button 
              className="btn btn-primary" 
              onClick={() => !empty && alert('Open Add Product modal (not implemented)')}
              disabled={empty}
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>
        }
      />

      <motion.div 
        className="card mt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Toggle to simulate empty state for testing */}
        {empty ? (
          <EmptyState
            variant="compact"
            title="No products yet"
            description="You don't have any products in your catalog. Add products to start tracking sales and inventory."
            icon={Package}
            action={<button className="btn btn-primary" onClick={() => alert('Open Add Product modal (not implemented)')}>Add Product</button>}
          />
        ) : (
          <ProductsManager />
        )}
      </motion.div>
    </div>
  )
}
