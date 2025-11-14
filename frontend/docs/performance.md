# Frontend Performance Guide

This project renders analytics dashboards with charts and tables. Here are practical steps to keep it fast as data grows.

## What’s heavy today
- Charts: Recharts components (AreaChart/BarChart) are the heaviest. We already memoized `SalesChart` and `TopProducts`.
- Tables: Rendering hundreds of rows/dom nodes can be expensive.
- CSS: Animations are lightweight; route fade and micro-interactions are hardware-accelerated.

## Virtualization for large tables
Use the simple `useVirtualList` hook (no deps) to render only visible rows.

Example usage outline:

```tsx
const { containerRef, start, end, offset, totalHeight } = useVirtualList({ count: rows.length, rowHeight: 44, overscan: 8 })

return (
  <div ref={containerRef} style={{ overflowY: 'auto', height: 480 }}>
    <div style={{ height: totalHeight, position: 'relative' }}>
      <div style={{ transform: `translateY(${offset}px)` }}>
        {rows.slice(start, end + 1).map((row, i) => (
          <Row key={row.id} data={row} index={start + i} />
        ))}
      </div>
    </div>
  </div>
)
```

Integrate gradually: wrap DataTable body when datasets exceed ~500 rows. Keep header and controls outside the scroller.

## Network and React tips
- Cache with TanStack Query (already in use). Prefer higher `staleTime` for stable datasets.
- Split routes/components by suspense or lazy when adding new heavy pages.
- Avoid inline functions in hot lists; memoize `rowRenderer` and derive data with `useMemo`.

## Charts
- Prefer simple shapes (Area/Bar) and avoid re-creating `data` arrays on each render.
- Share theme via `useChartTheme` (already done) to prevent churn.

## Bundle hygiene
- Keep dependencies lean. If adding a grid, prefer headless + our virtualization hook over large UI libs.
- Analyze with `vite build --mode analyze` (optional) to find large imports.

## Animations
- All motion respects `prefers-reduced-motion`. Keep durations ≤ 400ms.
- Shimmer skeleton is CPU-light; disable on reduced-motion (implemented).

## Future ideas
- Consider react-window/react-virtualized if we need sticky headers + row virtualization features.
- Add memoized selectors for derived state if we build local stores.
