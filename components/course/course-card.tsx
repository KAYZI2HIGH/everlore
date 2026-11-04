"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Clock, Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabel, formatPrice } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

export interface CourseCardProps {
  course: Course;
  owned?: boolean;
  inCart?: boolean;
  wishlisted?: boolean;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  priority?: boolean;
}

export function CourseCard({
  course,
  owned,
  inCart,
  wishlisted,
  onAddToCart,
  onToggleWishlist,
  priority,
}: CourseCardProps) {
  const href = `/academy/courses/${course.slug.current}`;
  const lessons = course.modules?.reduce((n, m) => n + (m.lessons ?? 0), 0) ?? 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(11_42_111/0.35)]">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={course.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
        {course.category && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur dark:bg-black/60 dark:text-white">
            {categoryLabel(course.category)}
          </span>
        )}
      </Link>

      {onToggleWishlist && (
        <button
          type="button"
          onClick={onToggleWishlist}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur transition hover:scale-105 dark:bg-black/60 dark:text-white"
        >
          <Heart className={cn("size-4", wishlisted && "fill-rose-500 text-rose-500")} />
        </button>
      )}

      <div className="flex flex-1 flex-col p-5">
        <Link href={href} className="outline-none">
          <h3 className="line-clamp-2 text-[17px] font-bold leading-snug group-hover:text-brand">
            {course.title}
          </h3>
        </Link>
        {course.instructor && (
          <p className="mt-1.5 text-sm text-muted-foreground">by {course.instructor}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {course.rating ? (
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Star className="size-3.5 fill-gold text-gold" />
              {course.rating.toFixed(1)}
            </span>
          ) : null}
          {course.level && <span className="capitalize">{course.level}</span>}
          {course.duration ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {course.duration}h
            </span>
          ) : null}
          {lessons > 0 && <span>{lessons} lessons</span>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-lg font-extrabold tracking-tight">{formatPrice(course.price)}</p>
          {owned ? (
            <Button asChild size="sm" variant="secondary" className="rounded-full">
              <Link href={href}>
                <Check /> Enrolled
              </Link>
            </Button>
          ) : inCart ? (
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link href="/academy/cart">In cart</Link>
            </Button>
          ) : onAddToCart && course.price > 0 ? (
            <Button size="sm" className="rounded-full" onClick={onAddToCart}>
              <ShoppingBag /> Add to cart
            </Button>
          ) : (
            <Button asChild size="sm" className="rounded-full">
              <Link href={href}>View course</Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
