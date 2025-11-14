import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, breadcrumb }) => {
  return (
    <div className="mb-6 sm:mb-8">
      {breadcrumb && (
        <div className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
          {breadcrumb}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="h1 text-neutral-900 dark:text-neutral-100">{title}</h2>
          {subtitle && <p className="mt-1 muted">{subtitle}</p>}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
