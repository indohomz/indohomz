import React from 'react'
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'

interface KpiPillsProps {
  loading?: boolean
  revenue: number
  orders: number
  customers: number
  products: number
}

const formatter = (n: number, prefix = '') => prefix + n.toLocaleString()

const Pill: React.FC<{ icon: React.ReactNode; label: string; value: string; loading?: boolean }> = ({ icon, label, value, loading }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-neutral-800/70 backdrop-blur border border-neutral-200 dark:border-neutral-700 shadow-sm min-w-[180px]">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow ring-2 ring-primary-600/20">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</span>
      {loading ? (
        <span className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      ) : (
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{value}</span>
      )}
    </div>
  </div>
)

const KpiPills: React.FC<KpiPillsProps> = ({ loading, revenue, orders, customers, products }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Pill icon={<DollarSign className="h-4 w-4" />} label="Revenue" value={formatter(revenue, '$')} loading={loading} />
      <Pill icon={<ShoppingCart className="h-4 w-4" />} label="Orders" value={formatter(orders)} loading={loading} />
      <Pill icon={<Users className="h-4 w-4" />} label="Customers" value={formatter(customers)} loading={loading} />
      <Pill icon={<Package className="h-4 w-4" />} label="Products" value={formatter(products)} loading={loading} />
    </div>
  )
}

export default KpiPills
