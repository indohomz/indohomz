import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { reportService, ReportResponse } from '../../services/api'
import { Brain, Calendar, Download, FileText, Loader2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAiCall } from '../../hooks/useAiCall'

type ReportTypeKey = 'sales_summary' | 'inventory_status' | 'customer_insights' | 'product_performance'

interface ReportTypeItem {
  type: ReportTypeKey
  name: string
  description: string
}

const toIso = (d?: string) => (d ? new Date(d).toISOString() : undefined)

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={open}
      >
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">{open ? 'Hide' : 'Show'}</span>
        </h4>
        <span className="text-neutral-400 text-xs">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {children}
        </div>
      )}
    </div>
  )
}

const DownloadButton: React.FC<{ content: string; fileName?: string }> = ({ content, fileName = 'report.md' }) => {
  const onDownload = () => {
    try {
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download report')
    }
  }
  return (
    <button className="btn btn-secondary" onClick={onDownload} aria-label="Download report as Markdown">
      <Download className="h-4 w-4 mr-2" /> Download
    </button>
  )
}

const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState<ReportTypeKey>('sales_summary')
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const { data: types, isLoading: loadingTypes, refetch } = useQuery({
    queryKey: ['report-types'],
    queryFn: async () => {
      const res = await reportService.getReportTypes()
      return res.data as ReportTypeItem[]
    },
    staleTime: 60 * 60 * 1000,
  })

  const ai = useAiCall<ReportResponse>({
    action: async () => {
      const res = await reportService.generateReport({
        report_type: reportType,
        start_date: toIso(start),
        end_date: toIso(end),
        filters: notes ? { notes } : undefined,
      })
      return res.data as ReportResponse
    },
    extractText: (r) => [r.summary, r.detailed_analysis, Array.isArray(r.recommendations) ? r.recommendations.join('\n') : ''].filter(Boolean).join('\n\n'),
  })

  const selected = useMemo(() => types?.find(t => t.type === reportType), [types, reportType])

  const onGenerate = () => {
    if (start && end && new Date(start) > new Date(end)) {
      toast.error('Start date must be before end date')
      return
    }
    ai.call()
  }

  const mdExport = useMemo(() => {
    if (!ai.data) return ''
    const report = ai.data
    const recs = Array.isArray(report.recommendations) ? report.recommendations.map(r => `- ${r}`).join('\n') : ''
    return `# ${selected?.name ?? 'AI Report'}\n\n` +
      `Type: ${report.report_type}\n\n` +
      (report.summary ? `## Summary\n\n${report.summary}\n\n` : '') +
      (report.detailed_analysis ? `## Detailed Analysis\n\n${report.detailed_analysis}\n\n` : '') +
      (recs ? `## Recommendations\n\n${recs}\n\n` : '') +
      `Generated at: ${report.generated_at}`
  }, [ai.data, selected])

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="h-5 w-5 text-primary-600 mr-2" /> Generate AI Report
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Choose a report type, optional date range, and generate insights.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost" onClick={() => refetch()} title="Refresh report types">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="label">Report type</label>
          <select
            className="input"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportTypeKey)}
            disabled={loadingTypes}
          >
            {loadingTypes && <option>Loading...</option>}
            {!loadingTypes && types?.map(t => (
              <option key={t.type} value={t.type}>{t.name}</option>
            ))}
          </select>
          {selected && (
            <p className="mt-2 text-xs text-gray-500">{selected.description}</p>
          )}
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Start date</label>
            <div className="input flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <input type="date" className="flex-1 bg-transparent outline-none" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">End date</label>
            <div className="input flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <input type="date" className="flex-1 bg-transparent outline-none" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="label">Additional context (optional)</label>
        <textarea
          className="input min-h-[90px]"
          placeholder="e.g., Focus on electronics category and highlight weekly trends"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="btn btn-primary" onClick={onGenerate} disabled={ai.loading}>
          {ai.loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <><FileText className="h-4 w-4 mr-2" /> Generate Report</>}
        </button>
        {ai.data && (
          <>
            <button
              className="btn btn-ghost"
              onClick={() => {
                navigator.clipboard.writeText(mdExport)
                toast.success('Copied markdown to clipboard')
              }}
            >
              Copy Markdown
            </button>
            <DownloadButton content={mdExport} fileName={`report-${ai.data.report_type}.md`} />
          </>
        )}
      </div>

      {/* AI Streaming Animation - Shows while generating */}
      {ai.loading && ai.partial && (
        <div className="rounded-lg border-2 border-primary-200 dark:border-primary-900 bg-gradient-to-br from-primary-50/50 to-indigo-50/30 dark:from-primary-950/30 dark:to-indigo-950/20 p-6 space-y-4 relative overflow-hidden" aria-live="polite">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-100/20 dark:via-primary-800/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Brain className="h-6 w-6 text-primary-600 dark:text-primary-400 animate-pulse" />
                <div className="absolute -inset-1 bg-primary-400/20 rounded-full animate-ping" />
              </div>
              <div>
                <h4 className="font-semibold text-primary-900 dark:text-primary-100">AI is analyzing your data...</h4>
                <p className="text-xs text-primary-600 dark:text-primary-400">Streaming insights in real-time</p>
              </div>
            </div>
            
            {/* Streaming text with typing cursor */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
                {ai.partial}
                <span className="inline-block w-2 h-4 ml-1 bg-primary-600 dark:bg-primary-400 animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Static loading state (when no partial text yet) */}
      {ai.loading && !ai.partial && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Preparing AI analysis...</p>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
          </div>
        </div>
      )}

      {/* Final Results - Shows after generation complete */}
      {ai.data && !ai.loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Success Header */}
          <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Report Generated Successfully</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Analysis complete • {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          {ai.data.summary && (
            <div className="card border-2 border-primary-100 dark:border-primary-900 shadow-lg hover:shadow-xl transition-shadow">
              <CollapsibleSection title="📊 Executive Summary" defaultOpen={true}>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">{ai.data.summary}</p>
              </CollapsibleSection>
            </div>
          )}

          {/* Detailed Analysis Section */}
          {ai.data.detailed_analysis && (
            <div className="card border-2 border-indigo-100 dark:border-indigo-900 shadow-lg hover:shadow-xl transition-shadow">
              <CollapsibleSection title="🔍 Detailed Analysis" defaultOpen={true}>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">{ai.data.detailed_analysis}</p>
              </CollapsibleSection>
            </div>
          )}

          {/* Recommendations Section */}
          {Array.isArray(ai.data.recommendations) && ai.data.recommendations.length > 0 && (
            <div className="card border-2 border-amber-100 dark:border-amber-900 shadow-lg hover:shadow-xl transition-shadow">
              <CollapsibleSection title="💡 AI Recommendations" defaultOpen={true}>
                <ul className="space-y-3">
                  {ai.data.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="flex-1 text-gray-700 dark:text-gray-300 pt-0.5">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReportGenerator
