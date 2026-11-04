import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseGrid } from "@/components/course/course-grid";
import type { Course } from "@/types/course";

export function FeaturedCourses({ courses }: { courses: Course[] }) {
  if (courses.length === 0) return null;
  return (
    <section className="py-24 lg:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">The Academy</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Start with a course <span className="text-serif-accent">built for results.</span>
            </h2>
          </div>
          <Button asChild variant="outline" className="rounded-full self-start sm:self-auto">
            <Link href="/academy">
              Browse all courses <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-12">
          <CourseGrid courses={courses.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}
