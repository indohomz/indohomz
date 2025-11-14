import { Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout/Layout'
import WelcomeScreen from './components/WelcomeScreen'
import Landing from './pages/Landing'

// Code-split pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Products = lazy(() => import('./pages/Products'))
const Sales = lazy(() => import('./pages/Sales'))
const Customers = lazy(() => import('./pages/Customers'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Reports = lazy(() => import('./pages/Reports'))
const Inventory = lazy(() => import('./pages/Inventory'))

function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  // Show welcome screen only when entering the app shell for the first time
  const isFirstVisit = !localStorage.getItem('ra_visited');
  if (!isLanding && isFirstVisit) {
    localStorage.setItem('ra_visited', 'true');
    return <WelcomeScreen />;
  }

  return (
    <Routes>
      {/* Landing page route */}
      <Route path="/" element={<Landing />} />
      
      {/* App routes with Layout */}
      <Route path="/dashboard" element={<Layout><Suspense fallback={<div className="py-24 text-center text-neutral-500">Loading...</div>}><Dashboard /></Suspense></Layout>} />
      <Route path="/products" element={<Layout><Suspense fallback={<div className="py-24 text-center text-neutral-500">Loading...</div>}><Products /></Suspense></Layout>} />
      <Route path="/sales" element={<Layout><Suspense fallback={<div className="py-24 text-center text-neutral-500">Loading...</div>}><Sales /></Suspense></Layout>} />
      <Route path="/customers" element={<Layout><Suspense fallback={<div className="py-24 text-center text-neutral-500">Loading...</div>}><Customers /></Suspense></Layout>} />
      <Route path="/inventory" element={<Layout><Suspense fallback={<div className="py-24 text-center text-neutral-500">Loading...</div>}><Inventory /></Suspense></Layout>} />
      <Route path="/analytics" element={<Layout><Suspense fallback={<div className="py-24 text-center text-neutral-500">Loading...</div>}><Analytics /></Suspense></Layout>} />
      <Route path="/reports" element={<Layout><Suspense fallback={<div className="py-24 text-center text-neutral-500">Loading...</div>}><Reports /></Suspense></Layout>} />
    </Routes>
  )
}

export default App
