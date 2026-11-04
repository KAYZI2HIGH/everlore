"use client";

import { CourseCard } from "@/components/course/course-card";
import { useCourseActions } from "@/hooks/useAccount";
import type { Course } from "@/types/course";

export function CourseGrid({ courses, priorityCount = 0 }: { courses: Course[]; priorityCount?: number }) {
  const actions = useCourseActions();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, i) => (
        <CourseCard
          key={course._id}
          course={course}
          priority={i < priorityCount}
          owned={actions.isOwned(course._id)}
          inCart={actions.isInCart(course._id)}
          wishlisted={actions.isWishlisted(course._id)}
          onAddToCart={() => actions.addToCart(course._id)}
          onToggleWishlist={() => actions.toggleWishlist(course._id)}
        />
      ))}
    </div>
  );
}
