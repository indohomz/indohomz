import React, { ReactNode, useState, useCallback, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import CommandPalette from './CommandPalette'

// Layout now manages responsive sidebar (collapsed + mobile) and passes handlers to Header.

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const toggleCollapse = useCallback(() => setSidebarCollapsed(c => !c), [])
  const openMobile = useCallback(() => setMobileSidebarOpen(true), [])
  const closeMobile = useCallback(() => setMobileSidebarOpen(false), [])
  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  // Close mobile sidebar on route change via hash/location mutation
  useEffect(() => {
    const handler = () => setMobileSidebarOpen(false)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  // Global shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Breadcrumbs (simple mapping by path segment)
  const breadcrumbs = (() => {
    const path = location.pathname || '/'
    const segments = path.split('/').filter(Boolean)
    const map: Record<string, string> = {
      dashboard: 'Dashboard',
      products: 'Products',
      sales: 'Sales',
      customers: 'Customers',
      inventory: 'Inventory',
      analytics: 'Analytics',
      reports: 'AI Reports',
    }

    if (segments.length === 0) return null
    const items: Array<{ href: string; label: string }> = []
    let acc = ''
    for (const seg of segments) {
      acc += `/${seg}`
      items.push({ href: acc, label: map[seg] || seg })
    }
    const last = items[items.length - 1]?.href
    return (
      <ol className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <li>
          <Link to="/dashboard" className="hover:text-neutral-700 dark:hover:text-neutral-200">Home</Link>
        </li>
        {items.map(it => (
          <li key={it.href} className="flex items-center gap-2">
            <span className="opacity-60">/</span>
            {it.href === last ? (
              <span aria-current="page" className="text-neutral-700 dark:text-neutral-200 font-medium">{it.label}</span>
            ) : (
              <Link to={it.href} className="hover:text-neutral-700 dark:hover:text-neutral-200">{it.label}</Link>
            )}
          </li>
        ))}
      </ol>
    )
  })()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:dark:bg-neutral-900 focus:text-primary-600 dark:focus:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 px-4 py-2 rounded-md shadow">Skip to content</a>
      {/* Sidebar (desktop) */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        mobileOpen={mobileSidebarOpen} 
        onCloseMobile={closeMobile}
      />

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <button 
          aria-label="Close navigation" 
          onClick={closeMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header 
          onToggleSidebar={toggleCollapse}
          sidebarCollapsed={sidebarCollapsed}
          onOpenMobileSidebar={openMobile}
          onOpenCommandPalette={openPalette}
          breadcrumbs={breadcrumbs}
        />
        <main id="main-content" className="flex-1 overflow-auto fade-in">
          <div className="container-shell py-8">
            {children}
          </div>
        </main>
        <CommandPalette open={paletteOpen} onClose={closePalette} />
      </div>
    </div>
  )
}

export default Layout
