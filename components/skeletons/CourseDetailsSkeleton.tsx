import { Skeleton } from "@/components/ui/skeleton";

export function CourseDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb skeleton */}
      <div className="px-6 md:px-20 py-4 border-b border-border">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-20 py-12">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero image */}
          <Skeleton className="w-full h-96 rounded-lg" />

          {/* Title and meta */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* What you'll learn */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-4 w-full"
                />
              ))}
            </div>
          </div>

          {/* Course highlights */}
          <div className="bg-muted/40 rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-12 w-full"
                />
              ))}
            </div>
          </div>

          {/* Course curriculum */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-20 w-full"
                />
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full"
                />
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-24 w-full"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Price */}
            <div className="space-y-3 p-6 bg-card border border-border rounded-lg">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />

              {/* Buttons */}
              <div className="space-y-2 pt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Course info */}
            <div className="p-6 bg-card border border-border rounded-lg space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
