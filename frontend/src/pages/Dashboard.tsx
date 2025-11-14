import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  AlertTriangle,
  Brain,
  Target
} from 'lucide-react';
import { analyticsService, salesService } from '../services/api';
import MetricCard from '../components/Dashboard/MetricCard';
import PageHeader from '../components/Layout/PageHeader';
import SalesChart from '../components/Dashboard/SalesChart';
import TopProducts from '../components/Dashboard/TopProducts';
import RecentSales from '../components/Dashboard/RecentSales';
import InventoryAlerts from '../components/Dashboard/InventoryAlerts';
import PredictionInsights from '../components/Dashboard/PredictionInsights';

// Animation variants for staggered card animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const Dashboard: React.FC = () => {
  // Fetch dashboard data
  const { data: salesOverview, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-overview'],
    queryFn: () => analyticsService.getSalesOverview().then(res => res.data),
  })

  const { data: inventoryStatus, isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventory-status'],
    queryFn: () => analyticsService.getInventoryStatus().then(res => res.data),
  })

  const { data: customerInsights, isLoading: customerLoading } = useQuery({
    queryKey: ['customer-insights'],
    queryFn: () => analyticsService.getCustomerInsights().then(res => res.data),
  })

  const { data: recentSales, isLoading: recentSalesLoading } = useQuery({
    queryKey: ['recent-sales'],
    queryFn: () => salesService.getSales({ limit: 10 }).then(res => res.data),
  })

  const isLoading = salesLoading || inventoryLoading || customerLoading

  return (
    <motion.div 
      className="space-y-8 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Dashboard Header */}
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your retail business."
        actions={(
          <>
            <button className="btn btn-outline">
              <TrendingUp className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Export Data</span>
            </button>
            <button className="btn btn-primary">
              <Brain className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Generate AI Report</span>
            </button>
          </>
        )}
      />

      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Total Revenue"
            value={`$${(salesOverview?.total_sales || 0).toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            change="+12.5%"
            description="vs last month"
            className="card"
            iconClassName="text-success-600"
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Total Orders"
            value={salesOverview?.total_orders?.toLocaleString() || '0'}
            icon={ShoppingCart}
            trend="up"
            change="+8.2%"
            description="vs last month"
            className="card"
            iconClassName="text-primary-600"
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Active Customers"
            value={customerInsights?.total_customers?.toLocaleString() || '0'}
            icon={Users}
            trend="up"
            change="+5.7%"
            description="vs last month"
            className="card"
            iconClassName="text-accent-600"
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Inventory Alerts"
            value={inventoryStatus?.low_stock_products || 0}
            icon={AlertTriangle}
            trend="down"
            change={`${inventoryStatus?.out_of_stock_products || 0} OOS`}
            description="Low stock items"
            className="card"
            iconClassName="text-danger-600"
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>

      {/* Charts and Insights Row */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Sales Trend Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="h3">Sales Trend</h3>
            <select className="input h-9 text-sm">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
            </select>
          </div>
          <SalesChart data={(salesOverview?.sales_trend || []).map(d => ({ date: d.date, amount: (d.revenue ?? 0) }))} isLoading={isLoading} />
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="h3">Top Products</h3>
            <button className="btn btn-ghost h-9 text-sm">View all</button>
          </div>
          <TopProducts products={(salesOverview?.top_products || []).map(p => ({ name: p.name, sales: (p.total_quantity ?? 0), revenue: (p.total_revenue ?? 0) }))} isLoading={isLoading} />
        </div>
      </motion.div>

      {/* Additional Insights Row */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {/* Recent Sales */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="h3">Recent Sales</h3>
            <button className="btn btn-ghost h-9 text-sm">View all</button>
          </div>
          <RecentSales sales={recentSales || []} isLoading={recentSalesLoading} />
        </div>

        {/* Inventory Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="h3">Inventory Alerts</h3>
            <div className="flex items-center text-danger-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {inventoryStatus?.low_stock_products || 0} items
              </span>
            </div>
          </div>
          <InventoryAlerts 
            lowStockCount={inventoryStatus?.low_stock_products || 0}
            outOfStockCount={inventoryStatus?.out_of_stock_products || 0}
            isLoading={inventoryLoading}
          />
        </div>

        {/* AI Predictions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="h3">AI Predictions</h3>
            <div className="flex items-center text-accent-600">
              <Brain className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Smart Insights</span>
            </div>
          </div>
          <PredictionInsights />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="card card-muted"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h3 className="h3 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-secondary"><Package className="h-4 w-4" /> Add Product</button>
          <button className="btn btn-secondary"><Users className="h-4 w-4" /> Add Customer</button>
          <button className="btn btn-secondary"><ShoppingCart className="h-4 w-4" /> Record Sale</button>
          <button className="btn btn-secondary"><Target className="h-4 w-4" /> View Analytics</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
