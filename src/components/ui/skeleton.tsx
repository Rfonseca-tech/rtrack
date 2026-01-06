import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted/60 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

/**
 * SkeletonCard - Skeleton loader for project/task cards
 */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 border rounded-lg space-y-3", className)}>
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

/**
 * SkeletonList - Skeleton for a list of items (e.g., tasks)
 */
function SkeletonList({
  count = 3,
  className
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * SkeletonMetric - Skeleton for dashboard stat cards
 */
function SkeletonMetric({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 border rounded-lg space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

/**
 * SkeletonTable - Skeleton for table content
 */
function SkeletonTable({
  rows = 5,
  cols = 4,
  className
}: {
  rows?: number
  cols?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex gap-4 p-2 border-b">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-2">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * SkeletonDashboard - Full dashboard loading skeleton
 */
function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonMetric />
        <SkeletonMetric />
        <SkeletonMetric />
        <SkeletonMetric />
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4 space-y-4">
          <Skeleton className="h-6 w-32" />
          <SkeletonList count={4} />
        </div>
        <div className="border rounded-lg p-4 space-y-4">
          <Skeleton className="h-6 w-32" />
          <SkeletonList count={4} />
        </div>
      </div>
    </div>
  )
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonMetric,
  SkeletonTable,
  SkeletonDashboard,
}
