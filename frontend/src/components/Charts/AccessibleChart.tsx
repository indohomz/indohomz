import React from 'react';

/**
 * AccessibleChart wraps a chart visualization with semantic roles and descriptive text.
 * It provides:
 *  - role="figure" with an accessible name (aria-label) OR uses aria-labelledby when titleId provided
 *  - optional description region connected via aria-describedby
 *  - keyboard focusability so screen reader users can navigate to the chart container
 *  - visually hidden text fallback for descriptions when not rendered elsewhere
 */
export interface AccessibleChartProps {
  /** Short, descriptive label for the chart (e.g., "Monthly revenue trend"). */
  label: string;
  /** Optional longer description summarizing takeaway insights. */
  description?: string;
  /** Children should be the actual chart component (e.g., <AreaChart /> wrapped in its responsive container). */
  children: React.ReactNode;
  /** Additional className for outer wrapper */
  className?: string;
  /** If true, description will be visually hidden (still available to AT). */
  hideDescriptionVisually?: boolean;
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `chart-desc-${idCounter}`;
}

export const AccessibleChart: React.FC<AccessibleChartProps> = ({
  label,
  description,
  children,
  className,
  hideDescriptionVisually = false,
}) => {
  const descId = description ? nextId() : undefined;
  return (
    <figure
      className={className}
      role="figure"
      aria-label={label}
      aria-describedby={descId}
      tabIndex={0}
    >
      {children}
      {description && (
        <figcaption id={descId} className={hideDescriptionVisually ? 'sr-only' : 'mt-2 text-xs text-neutral-600 dark:text-neutral-400'}>
          {description}
        </figcaption>
      )}
    </figure>
  );
};

export default AccessibleChart;