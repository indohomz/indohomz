import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  iconClassName?: string;
  isLoading?: boolean;
  variant?: 'stat' | 'mini' | 'list';
  items?: { label: string; value: string | number }[]; // for list variant
  href?: string; // optional link
  onClick?: () => void; // interactive handling
  ariaLabel?: string; // accessibility label for the card
}

export default function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  trend = 'neutral',
  className,
  iconClassName,
  isLoading = false,
  variant = 'stat',
  items,
  href,
  onClick,
  ariaLabel
}: MetricCardProps) {
  const trendConfig = {
    up: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: TrendingUp
    },
    down: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: TrendingDown
    },
    neutral: {
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: Minus
    }
  };

  const TrendIcon = trendConfig[trend].icon;

  if (isLoading) {
    return (
      <div className={cn(
        "rounded-xl shadow-sm p-6 bg-white border border-gray-100",
        className
      )} aria-busy="true" aria-live="polite">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  const WrapperTag = href ? 'a' : 'div';
  const wrapperProps: any = {};
  if (href) wrapperProps.href = href;
  if (onClick) wrapperProps.onClick = onClick;
  if (onClick) { wrapperProps.role = 'button'; wrapperProps.tabIndex = 0; }
  if (ariaLabel) wrapperProps['aria-label'] = ariaLabel;

  return (
    <WrapperTag
      {...wrapperProps}
      className={cn(
        "rounded-xl shadow-sm p-6 bg-white border transition-all duration-300",
        href || onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500' : '',
        "hover:shadow-lg hover:-translate-y-1 group relative",
        variant === 'mini' && 'p-4',
        variant === 'list' && 'p-5',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg transition-colors duration-200",
            trendConfig[trend].bg,
            trendConfig[trend].border,
            "group-hover:scale-110 transform transition-transform"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              iconClassName || trendConfig[trend].color
            )} />
          </div>
          <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
            {title}
          </h3>
        </div>
      </div>

  <div className="space-y-2" aria-live="polite">
        {variant === 'stat' && (
          <>
            <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {value}
            </p>
            <div className="flex items-center justify-between">
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
              {change && (
                <div className={cn(
                  "flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-sm font-medium",
                  trendConfig[trend].bg,
                  trendConfig[trend].color,
                  "transition-transform transform group-hover:scale-105"
                )}>
                  <TrendIcon className="h-4 w-4" />
                  <span>{change}</span>
                </div>
              )}
            </div>
          </>
        )}

        {variant === 'mini' && (
          <p className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{value}</p>
        )}

        {variant === 'list' && items && (
          <ul className="space-y-1">
            {items.map(it => (
              <li key={String(it.label)} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 group-hover:text-gray-700">{it.label}</span>
                <span className="font-medium text-gray-900">{it.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </WrapperTag>
  );
}
