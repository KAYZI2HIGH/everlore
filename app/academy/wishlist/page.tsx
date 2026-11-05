"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { CourseGrid } from "@/components/course/course-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { wishlistItems, isLoading } = useWishlist();
  // Optimistic placeholders (only an _id) are filtered out until the refetch fills them in.
  const courses = wishlistItems.filter((c) => c?.slug?.current);
  const count = courses.length;

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">Wishlist</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
            Saved for <span className="text-brand">later.</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Courses you&apos;ve bookmarked. Add them to your cart when you&apos;re ready to start.
          </p>
        </div>
        {!isLoading && count > 0 && (
          <div className="flex items-center gap-3 self-start rounded-full border border-border bg-card py-2 pl-2 pr-5 sm:self-auto">
            <span className="grid size-9 place-items-center rounded-full bg-rose-500/15 text-rose-500">
              <Heart className="size-4 fill-current" />
            </span>
            <span className="text-sm">
              <span className="font-bold">{count}</span>{" "}
              <span className="text-muted-foreground">saved {count === 1 ? "course" : "courses"}</span>
            </span>
          </div>
        )}
      </header>

      <div className="mt-10">
        {isLoading ? (
          <WishlistSkeleton />
        ) : count === 0 ? (
          <EmptyWishlist />
        ) : (
          <CourseGrid courses={courses} priorityCount={3} />
        )}
      </div>
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy aria-label="Loading wishlist">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <Skeleton className="aspect-[16/10] w-full rounded-none bg-muted" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-4/5 bg-muted" />
            <Skeleton className="h-4 w-1/3 bg-muted" />
            <Skeleton className="h-3 w-1/2 bg-muted" />
            <div className="flex items-center justify-between pt-4">
              <Skeleton className="h-6 w-20 bg-muted" />
              <Skeleton className="h-8 w-28 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:py-20">
      <div aria-hidden className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-md">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-primary dark:text-brand">
          <Heart className="size-7" />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold sm:text-3xl">Your wishlist is empty</h2>
        <p className="mt-3 text-muted-foreground">
          Tap the heart on any course to save it here, so you can compare and come back to it
          anytime.
        </p>
        <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7 text-base">
          <Link href="/academy">
            Browse courses <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
