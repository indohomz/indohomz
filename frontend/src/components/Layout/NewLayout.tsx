import { useState, ReactNode } from 'react'
import NewSidebar from './NewSidebar'
import NewHeader from './NewHeader'
import MobileSidebar from './MobileSidebar'

export default function Layout({ children }: { children?: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile Sidebar (Dialog) */}
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Desktop Sidebar (Static) */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <NewSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <NewHeader onMobileMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
