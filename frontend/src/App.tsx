/**
 * IndoHomz - Premium Co-Living Platform
 * Main Application Router
 */

import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Landing from './pages/Landing'

// Code-split pages
const Properties = lazy(() => import('./pages/Properties'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))

// Loading Spinner - Light theme
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />
      
      {/* Properties Listing */}
      <Route 
        path="/properties" 
        element={
          <Suspense fallback={<PageLoader />}>
            <Properties />
          </Suspense>
        } 
      />
      
      {/* Property Detail */}
      <Route 
        path="/property/:slug" 
        element={
          <Suspense fallback={<PageLoader />}>
            <PropertyDetail />
          </Suspense>
        } 
      />
      
      {/* Redirects for old routes */}
      <Route path="/home" element={<Landing />} />
      <Route path="/dashboard" element={<Landing />} />
      <Route path="/products" element={<Suspense fallback={<PageLoader />}><Properties /></Suspense>} />
    </Routes>
  )
}

export default App
