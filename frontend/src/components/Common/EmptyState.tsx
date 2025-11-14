import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact';
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon: Icon, action, className, variant = 'default' }) => {
  const pad = variant === 'compact' ? 'p-5' : 'p-8'
  const iconBox = variant === 'compact' ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'
  const iconSize = variant === 'compact' ? 'h-5 w-5' : 'h-6 w-6'
  return (
    <div className={cn(`text-center ${pad} rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800`, className)}>
      <div className={cn('mx-auto rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center', iconBox)}>
        <Icon className={cn(iconSize, 'text-neutral-500')} />
      </div>
      <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
      {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
