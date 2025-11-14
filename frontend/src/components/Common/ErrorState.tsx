import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'inline';
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = 'Something went wrong.', onRetry, className, variant = 'default' }) => {
  const base = variant === 'inline' ? 'p-3 text-xs flex items-center gap-2' : 'p-6 text-center'
  const iconWrap = variant === 'inline' ? 'w-6 h-6 mb-0' : 'w-10 h-10 mb-3 mx-auto'
  return (
    <div className={cn(`rounded-xl border border-danger-200 bg-danger-50 dark:bg-danger-900/20 dark:border-danger-700 ${base}`, className)}>
      <div className={cn('rounded-full bg-danger-100 dark:bg-danger-800 flex items-center justify-center', iconWrap)}>
        <AlertTriangle className={variant === 'inline' ? 'h-4 w-4 text-danger-600' : 'h-5 w-5 text-danger-600'} />
      </div>
      <div>
        <h3 className={variant === 'inline' ? 'font-medium text-danger-700 dark:text-danger-400' : 'text-sm font-semibold text-danger-700 dark:text-danger-400'}>{message}</h3>
        {onRetry && (
          <button
            onClick={onRetry}
            className={variant === 'inline' ? 'ml-2 btn btn-outline border-danger-400 text-danger-600 hover:bg-danger-100 dark:hover:bg-danger-900/40 h-7 px-2 text-xs' : 'mt-4 btn btn-outline border-danger-400 text-danger-600 hover:bg-danger-100 dark:hover:bg-danger-900/40'}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
