import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48" />

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Category and rating */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Instructor and students */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Price and button */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

export function CourseListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
