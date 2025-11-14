import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileSidebar from './MobileSidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile Sidebar (Dialog) */}
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Desktop Sidebar (Static) */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header onMobileMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
