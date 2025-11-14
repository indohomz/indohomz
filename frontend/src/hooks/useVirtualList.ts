import { useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react'

/**
 * useVirtualList: a minimal, dependency-free virtualization hook for large lists.
 *
 * Contract
 * - inputs: total item count, estimated rowHeight, overscan, and a scroll container ref
 * - output: start/end indices to render and a translateY offset for the inner spacer
 * - success: keeps DOM nodes ~visible window only; smooth scroll with overscan buffer
 * - errors: if container not measured yet, falls back to initial window
 */
export function useVirtualList(options: {
  count: number
  rowHeight: number
  overscan?: number
}) {
  const { count, rowHeight, overscan = 6 } = options
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [height, setHeight] = useState(0)

  const onScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement
    setScrollTop(target.scrollTop)
  }, [])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const resize = () => setHeight(el.clientHeight)
    resize()
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [onScroll])

  const { start, end, offset, totalHeight } = useMemo(() => {
    const visibleCount = Math.ceil(height / rowHeight)
    const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    const endIdx = Math.min(count - 1, startIdx + visibleCount + overscan * 2)
    const translateY = startIdx * rowHeight
    return {
      start: startIdx,
      end: endIdx,
      offset: translateY,
      totalHeight: count * rowHeight,
    }
  }, [height, rowHeight, scrollTop, overscan, count])

  return { containerRef, start, end, offset, totalHeight }
}

export default useVirtualList
