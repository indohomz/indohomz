export type ChartTheme = {
  grid: string
  axisTick: string
  axisLabel?: string
  tooltipBg: string
  tooltipBorder: string
  tooltipLabel: string
  areaStroke: string
  gradientFrom: string
}

export const lightTheme: ChartTheme = {
  grid: '#E5E7EB',
  axisTick: '#6B7280',
  axisLabel: '#374151',
  tooltipBg: '#ffffff',
  tooltipBorder: '#E5E7EB',
  tooltipLabel: '#6366F1',
  areaStroke: '#6366F1',
  gradientFrom: '#6366F1',
}

export const darkTheme: ChartTheme = {
  grid: '#334155',
  axisTick: '#94A3B8',
  axisLabel: '#E2E8F0',
  tooltipBg: '#0F172A',
  tooltipBorder: '#334155',
  tooltipLabel: '#818CF8',
  areaStroke: '#818CF8',
  gradientFrom: '#818CF8',
}

export function useChartTheme(): ChartTheme {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  return isDark ? darkTheme : lightTheme
}
