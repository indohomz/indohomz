import { render, screen, fireEvent } from '@testing-library/react'
import ReportGenerator from '../components/Reports/ReportGenerator'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('../services/api', async () => {
  const actual = await vi.importActual<any>('../services/api')
  return {
    ...actual,
    reportService: {
      getReportTypes: () => Promise.resolve({ data: [
        { type: 'sales_summary', name: 'Sales Summary', description: 'Summary' }
      ] }),
      generateReport: () => Promise.resolve({ data: {
        report_type: 'sales_summary',
        summary: 'Hello Summary',
        detailed_analysis: 'Details',
        recommendations: ['Do X'],
        generated_at: new Date().toISOString()
      } })
    }
  }
})

describe('ReportGenerator', () => {
  it('shows loading and then summary after generation', async () => {
    const qc = new QueryClient()
    render(
      <QueryClientProvider client={qc}>
        <ReportGenerator />
      </QueryClientProvider>
    )
    const btn = screen.getByRole('button', { name: /generate report/i })
    fireEvent.click(btn)
    // Loading indicator appears in button label
    expect(await screen.findByText(/generating/i)).toBeInTheDocument()

  // Wait for the Summary heading (h4) to appear (avoid conflict with description "Summary")
  await screen.findByRole('heading', { level: 4, name: /summary/i })
    expect(screen.getByText('Hello Summary')).toBeInTheDocument()
  })
})
