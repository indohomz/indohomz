import PageHeader from '../components/Layout/PageHeader'
import EmptyState from '../components/Common/EmptyState'
import { LineChart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Analytics() {
  return (
    <div className="p-6">
      <PageHeader
        title="Deep Dive Analytics"
        subtitle="Custom reports and advanced insights."
      />
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <EmptyState
          icon={LineChart}
          title="Analytics Hub Coming Soon"
          description="We're building advanced reporting tools. Check back soon for deep-dive analytics, cohort analysis, and more."
          action={<button className="btn btn-outline">Request Feature</button>}
        />
      </motion.div>
    </div>
  )
}
