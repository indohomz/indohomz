import { Fragment } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  LineChart,
  Brain,
  X,
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

function getLinkClassName({ isActive }: { isActive: boolean }) {
  const base = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150"
  if (isActive) {
    return `${base} bg-primary-100 text-primary-700 dark:bg-primary-600/20 dark:text-primary-300 font-medium`
  }
  return `${base} text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800`
}

export default function MobileSidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog className="relative z-50 lg:hidden" onClose={setOpen}>
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 flex">
          {/* Sidebar Panel */}
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="w-64 flex flex-col p-4 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
                {/* Logo/Brand Area */}
                <div className="flex items-center justify-between gap-3 px-3 h-12 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-md">
                      <LineChart className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                      RetailApp
                    </span>
                  </div>
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-neutral-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={getLinkClassName}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
