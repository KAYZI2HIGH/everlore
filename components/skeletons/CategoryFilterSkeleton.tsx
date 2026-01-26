import { Skeleton } from "@/components/ui/skeleton";

export const CategoryFilterSkeleton = () => {
  return (
    <div className="space-y-4 w-full">
      <h2 className="text-sm font-semibold text-foreground">
        Filter by Category
      </h2>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-10 w-32 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};
