"use client";

import Image from "next/image";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CourseGrid } from "@/components/course/course-grid";
import { categoryLabel } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];
const LEVELS = ["beginner", "intermediate", "advanced"];

export function CourseCatalog({ courses, categories }: { courses: Course[]; categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const level = params.get("level") ?? "";
  const sort = params.get("sort") ?? "newest";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = courses.filter(
      (c) =>
        (!category || c.category === category) &&
        (!level || c.level === level) &&
        (!term ||
          [c.title, c.description, c.instructor, categoryLabel(c.category)]
            .filter(Boolean)
            .some((s) => s!.toLowerCase().includes(term))),
    );
    const by: Record<string, (a: Course, b: Course) => number> = {
      newest: (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
      popular: (a, b) => (b.students ?? 0) - (a.students ?? 0),
      rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
    };
    return [...list].sort(by[sort] ?? by.newest);
  }, [courses, q, category, level, sort]);

  const hasFilters = !!(q || category || level);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            defaultValue={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search courses, topics or instructors"
            aria-label="Search courses"
            className="h-12 rounded-full bg-card pl-12 text-base"
          />
        </div>
        <div className="flex gap-3">
          <label className="relative">
            <span className="sr-only">Level</span>
            <select
              value={level}
              onChange={(e) => setParam("level", e.target.value)}
              className="h-12 appearance-none rounded-full border border-input bg-card px-5 pr-10 text-sm font-medium capitalize"
            >
              <option value="">All levels</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </label>
          <label>
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)}
              className="h-12 rounded-full border border-input bg-card px-5 text-sm font-medium"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap" role="group" aria-label="Categories">
            {["", ...categories].map((c) => (
              <button
                key={c || "all"}
                type="button"
                aria-pressed={category === c}
                onClick={() => setParam("category", c)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-foreground/30",
                )}
              >
                {c ? categoryLabel(c) : "All courses"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
          {courses.length} courses
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => router.replace(pathname, { scroll: false })}>
            <X /> Clear filters
          </Button>
        )}
      </div>

      {filtered.length > 0 ? (
        <CourseGrid courses={filtered} priorityCount={3} />
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border py-16 text-center">
          <Image src="/empty-courses.svg" alt="" width={220} height={150} />
          <h2 className="mt-6 text-xl font-bold">No courses match your filters</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try a different search or clear the filters to see every course.
          </p>
          <Button className="mt-6 rounded-full" onClick={() => router.replace(pathname, { scroll: false })}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
