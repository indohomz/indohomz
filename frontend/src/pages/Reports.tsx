
import { motion } from 'framer-motion'
import ReportGenerator from '../components/Reports/ReportGenerator'
import BusinessQnA from '../components/Reports/BusinessQnA'
import ErrorBoundary from '../components/Common/ErrorBoundary'
import PageHeader from '../components/Layout/PageHeader'

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="AI Reports & Insights"
        subtitle="Generate summaries and ask questions about your business data."
      />
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ErrorBoundary>
          <div className="card">
            <ReportGenerator />
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <div className="card">
            <BusinessQnA />
          </div>
        </ErrorBoundary>
      </motion.div>
    </div>
  )
}
