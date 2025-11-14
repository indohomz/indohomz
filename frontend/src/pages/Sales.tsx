import PageHeader from '../components/Layout/PageHeader'
import EmptyState from '../components/Common/EmptyState'
import { ShoppingCart, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Sales() {
  return (
    <div className="p-6">
      <PageHeader
        title="Sales Management"
        subtitle="Track all completed orders, returns, and transactions."
        actions={
          <button className="btn btn-primary">
            <Plus className="h-4 w-4" /> Record Sale
          </button>
        }
      />
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <EmptyState
          icon={ShoppingCart}
          title="Sales Module Coming Soon"
          description="We're building this page to track all your transactions. Check back soon!"
          action={<button className="btn btn-outline">Request Feature</button>}
        />
      </motion.div>
    </div>
  )
}
