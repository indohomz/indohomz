import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { customerService, type Customer } from '../services/api'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { motion } from 'framer-motion'
import AccessibleChart from '../components/Charts/AccessibleChart'
import { useChartTheme } from '../components/Charts/theme'
import type { Column } from '../components/Table/types'
import DataTable from '../components/Table/DataTable'
import EmptyState from '../components/Common/EmptyState'
import ErrorState from '../components/Common/ErrorState'
import PageHeader from '../components/Layout/PageHeader'
import { Users, Star, AlertTriangle, TrendingUp, Activity, Plus } from 'lucide-react'

const SEGMENT_COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']

export default function Customers() {
  const chartTheme = useChartTheme()
  const [segmentFilter, setSegmentFilter] = useState<string>('All')
  const [countryFilter, setCountryFilter] = useState<string>('All')
  const [dense, setDense] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getCustomers({ limit: 1000 }).then(res => res.data),
    staleTime: 60_000,
  })

  const segments = useMemo(() => {
    const counts = new Map<string, number>()
    ;(data ?? []).forEach(c => {
      const key = c.customer_segment || 'Unsegmented'
      counts.set(key, (counts.get(key) || 0) + 1)
    })
    const total = (data?.length || 0) || 1
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value, percent: (value / total) * 100 }))
  }, [data])

  const countries = useMemo(() => {
    const set = new Set<string>()
    ;(data ?? []).forEach(c => { if (c.country) set.add(c.country) })
    return Array.from(set.values()).sort()
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return [] as Customer[]
    return (data.filter(c => {
      const segOk = segmentFilter === 'All' || (c.customer_segment || 'Unsegmented') === segmentFilter
      const countryOk = countryFilter === 'All' || c.country === countryFilter
      return segOk && countryOk
    }))
  }, [data, segmentFilter, countryFilter])

  const retention = useMemo(() => {
    const stats = { new: 0, returning: 0 }
    ;(data ?? []).forEach(c => {
      // heuristic: <=1 orders considered new
      if (c.total_orders <= 1) {
        stats.new += 1
      } else {
        stats.returning += 1
      }
    })
    const total = (data?.length ?? 0) || 1
    return {
      ...stats,
      newPct: (stats.new / total) * 100,
      returningPct: (stats.returning / total) * 100,
    }
  }, [data])

  const topSpenders = useMemo(() => {
    return [...(data ?? [])]
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 5)
      .map(c => ({ name: `${c.first_name} ${c.last_name}`, total_spent: c.total_spent }))
  }, [data])

  const getPersona = (c: Customer) => {
    if (c.total_spent > 5000) return { label: 'VIP', icon: Star, className: 'bg-amber-500/15 text-amber-600 dark:text-amber-300' }
    if (c.total_orders > 10) return { label: 'Loyal', icon: Activity, className: 'bg-green-500/15 text-green-600 dark:text-green-300' }
    if (c.total_orders > 3 && c.total_spent > 500) return { label: 'High Potential', icon: TrendingUp, className: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300' }
    if (c.total_orders <= 1 && c.total_spent < 100) return { label: 'New', icon: Star, className: 'bg-blue-500/15 text-blue-600 dark:text-blue-300' }
    if (c.total_orders >= 2 && c.total_spent < 150) return { label: 'At Risk', icon: AlertTriangle, className: 'bg-red-500/15 text-red-600 dark:text-red-300' }
    return { label: 'Standard', icon: Users, className: 'bg-neutral-500/15 text-neutral-600 dark:text-neutral-300' }
  }

  const columns: Column<Customer>[] = useMemo(() => ([
    { key: 'name', header: 'Customer', sortable: true, render: (c) => {
      const persona = getPersona(c)
      return (
        <div className="space-y-1">
          <div className="font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
            {c.first_name} {c.last_name}
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${persona.className}`}> {React.createElement(persona.icon, { className: 'h-3 w-3' })} {persona.label}</span>
          </div>
          <div className="text-xs text-neutral-500">{c.email}</div>
        </div>
      )
    }},
    { key: 'customer_segment', header: 'Segment', sortable: true, render: (c) => (
      <span className="badge">{c.customer_segment || 'Unsegmented'}</span>
    ) },
    { key: 'total_orders', header: 'Orders', align: 'right', sortable: true },
    { key: 'total_spent', header: 'Spent', align: 'right', sortable: true, render: (c) => `$${c.total_spent.toFixed(2)}` },
    { key: 'country', header: 'Country', sortable: true }
  ]), [])

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Customer Hub"
        subtitle={`${data?.length ?? 0} customers across ${segments.length} segments`}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <select value={segmentFilter} onChange={(e) => setSegmentFilter(e.target.value)} className="input h-9 w-44" aria-label="Filter by segment">
              <option>All</option>
              {segments.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="input h-9 w-40" aria-label="Filter by country">
              <option>All</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <input type="checkbox" checked={dense} onChange={() => setDense(d => !d)} /> Dense
            </label>
            <button className="btn btn-primary h-9 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Customer
            </button>
          </div>
        }
      />

      {/* Retention summary */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="card p-3 flex flex-col gap-1">
          <span className="text-xs text-neutral-500">New Customers</span>
          <div className="text-lg font-semibold flex items-baseline gap-2">{retention.new}<span className="text-xs font-medium text-neutral-500">{retention.newPct.toFixed(1)}%</span></div>
        </div>
        <div className="card p-3 flex flex-col gap-1">
          <span className="text-xs text-neutral-500">Returning Customers</span>
          <div className="text-lg font-semibold flex items-baseline gap-2">{retention.returning}<span className="text-xs font-medium text-neutral-500">{retention.returningPct.toFixed(1)}%</span></div>
        </div>
        <div className="card p-3 flex flex-col gap-1">
          <span className="text-xs text-neutral-500">Segments</span>
          <div className="text-lg font-semibold">{segments.length}</div>
        </div>
        <div className="card p-3 flex flex-col gap-1">
          <span className="text-xs text-neutral-500">Countries</span>
          <div className="text-lg font-semibold">{countries.length}</div>
        </div>
      </motion.div>

      {/* Segmentation + Top spenders */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Customer Segments</h3>
            <span className="text-sm text-neutral-500">{data?.length ?? 0} total</span>
          </div>
          <AccessibleChart
            className="h-64"
            label="Customer segments pie chart"
            description="Pie chart showing distribution of customers across segments. Slice size corresponds to number of customers; legend lists counts and percentages."
            hideDescriptionVisually
          >
            {segments.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-500">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const item: any = payload[0]
                      return (
                        <div className="p-2 rounded-md shadow bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
                          <div className="font-medium">{item.name}</div>
                          <div>{item.value} customers</div>
                          <div>{((item.value / (data?.length || 1)) * 100).toFixed(1)}%</div>
                        </div>
                      )
                    }}
                  />
                  <Pie data={segments} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {segments.map((_, idx) => (
                      <Cell key={idx} fill={SEGMENT_COLORS[idx % SEGMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend formatter={(value: string, _entry: any) => {
                    const seg = segments.find(s => s.name === value)
                    if (!seg) return value
                    return `${value} (${seg.value}, ${seg.percent.toFixed(1)}%)`
                  }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </AccessibleChart>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Spenders</h3>
          </div>
          <AccessibleChart
            className="h-64"
            label="Top spenders bar chart"
            description="Vertical bar chart of the five highest spending customers. Height of each bar indicates total amount spent."
            hideDescriptionVisually
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSpenders} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis dataKey="name" tick={{ fill: chartTheme.axisTick, fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fill: chartTheme.axisTick, fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 10 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Spent']} />
                <Bar dataKey="total_spent" fill={chartTheme.areaStroke} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AccessibleChart>
        </div>
      </motion.div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !isLoading && (data?.length ?? 0) === 0 ? (
          <EmptyState title="No customers found" description="Start by importing or adding customers to analyze segments and retention." icon={Users} action={<button className="btn btn-primary">Add Customer</button>} />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            loading={isLoading}
            searchableKeys={["first_name", "last_name", "email", "customer_segment", "country"] as (keyof Customer)[]}
            dense={dense}
            selectable
            getRowId={(row) => (row as Customer).email}
          />
        )}
      </motion.div>
    </div>
  )
}
