interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

// Component variants for common use cases
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
