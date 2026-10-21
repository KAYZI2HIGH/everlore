import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <div className="col-span-1 min-w-0">
      {/* Image skeleton */}
      <Skeleton className="aspect-[16/10] w-full rounded-lg" />

      {/* Content */}
      <div className="mt-2 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-2/5" />
      </div>
      <div className="flex items-center gap-2 py-1">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-[10px] w-px" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-[10px] w-px" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-10 w-16" />
      </div>
    </div>
  );
}

export function CourseListSkeleton({ length = 8 }: { length?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
