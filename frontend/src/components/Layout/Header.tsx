import { Fragment, ReactNode } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu as MenuIcon,
  Search,
  Settings,
  User,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

interface HeaderProps {
  onToggleSidebar?: () => void
  onOpenMobileSidebar?: () => void
  sidebarCollapsed?: boolean
  onOpenCommandPalette?: () => void
  breadcrumbs?: ReactNode
}

export default function Header({ 
  onToggleSidebar, 
  onOpenMobileSidebar, 
  sidebarCollapsed, 
  onOpenCommandPalette,
  breadcrumbs 
}: HeaderProps) {
  const { dark, toggle: toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="text-neutral-500 lg:hidden"
        onClick={onOpenMobileSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center lg:justify-start">
        <button 
          onClick={onOpenCommandPalette}
          className="w-full max-w-sm flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search or press Ctrl+K</span>
          </div>
          <span className="hidden sm:block text-xs border border-neutral-300 dark:border-neutral-500 rounded-md px-1.5 py-0.5">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* Right-side Icons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => toggleTheme()}
          className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <span className="sr-only">Toggle theme</span>
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Profile Dropdown */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 rounded-full p-1.5 pr-2.5 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-300 flex items-center justify-center font-medium">
              A
            </div>
            <span className="hidden sm:inline">Admin</span>
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-neutral-200 dark:border-neutral-700">
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      focus
                        ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                        : 'text-neutral-700 dark:text-neutral-200'
                    }`}
                  >
                    <User className="h-4 w-4" /> Profile
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      focus
                        ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                        : 'text-neutral-700 dark:text-neutral-200'
                    }`}
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      focus
                        ? 'bg-danger-50 dark:bg-neutral-700 text-danger-700 dark:text-danger-400'
                        : 'text-danger-600 dark:text-danger-400'
                    }`}
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </a>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </header>
  )
}
