/**
 * IndoHomz Sidebar Navigation
 */

import { NavLink } from 'react-router-dom'
import {
  Home,
  Building2,
  LayoutDashboard,
  LineChart,
  Brain,
  Users,
  ChevronFirst,
  ChevronLast,
  MessageSquare,
  Settings,
} from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
  { name: 'AI Reports', href: '/reports', icon: Brain },
]

function getLinkClassName({ isActive }: { isActive: boolean }) {
  const base = "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
  if (isActive) {
    return `${base} bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30`
  }
  return `${base} text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10`
}

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <div
      className={clsx(
        "flex flex-col p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo/Brand Area */}
      <div className={clsx(
        "flex items-center gap-3 px-3 h-14 mb-6",
        isCollapsed && "justify-center"
      )}>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
        <div
          className={clsx(
            "transition-all duration-300 whitespace-nowrap",
            isCollapsed && "opacity-0 w-0 overflow-hidden"
          )}
        >
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            IndoHomz
          </span>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            PropTech Platform
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={getLinkClassName}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span
              className={clsx(
                "text-sm font-medium whitespace-nowrap transition-all duration-300",
                isCollapsed && "opacity-0 w-0 overflow-hidden"
              )}
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-2">
        {/* Collapse Button */}
        <button 
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className={clsx(
            "text-sm whitespace-nowrap transition-all duration-300",
            isCollapsed && "opacity-0 w-0 overflow-hidden"
          )}>
            Collapse
          </span>
          {isCollapsed ? <ChevronLast className="h-5 w-5" /> : <ChevronFirst className="h-5 w-5" />}
        </button>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className={clsx(
            "flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors",
            isCollapsed && "justify-center"
          )}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold flex-shrink-0 shadow-lg shadow-indigo-500/20">
              A
            </div>
            <div
              className={clsx(
                "transition-all duration-300 whitespace-nowrap",
                isCollapsed && "opacity-0 w-0 overflow-hidden"
              )}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">Admin</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Property Manager</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
