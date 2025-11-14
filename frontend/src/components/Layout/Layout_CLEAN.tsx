import { useState, ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import CommandPalette from './CommandPalette'
import MobileSidebar from './MobileSidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  return (
    <>
      <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-900">
        {/* Mobile Sidebar */}
        <MobileSidebar open={mobileSidebarOpen} setOpen={setMobileSidebarOpen} />

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar 
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(p => !p)}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header 
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)} 
            onOpenCommandPalette={() => setPaletteOpen(true)}
          />
          
          {/* Page Content with Smooth Transitions */}
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </>
  )
}
