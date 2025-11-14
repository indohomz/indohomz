import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  LineChart,
  Brain,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Warehouse },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
  { name: 'AI Reports', href: '/reports', icon: Brain },
]

// NavLink active state ke liye helper function
function getLinkClassName({ isActive }: { isActive: boolean }) {
  const base = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150"
  if (isActive) {
    return `${base} bg-primary-100 text-primary-700 dark:bg-primary-600/20 dark:text-primary-300 font-medium`
  }
  return `${base} text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800`
}

export default function NewSidebar() {
  return (
    <div className="w-64 flex flex-col p-4 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
      {/* Logo/Brand Area */}
      <div className="flex items-center gap-3 px-3 h-12 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-md">
          <LineChart className="h-5 w-5" />
        </div>
        <span className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
          RetailApp
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={getLinkClassName}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer (e.g., User) */}
      <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-300 flex items-center justify-center font-medium">
            A
          </div>
          <div>
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Admin User</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">admin@example.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
