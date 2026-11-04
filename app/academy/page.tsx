import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchCategories, fetchCourses } from "@/lib/content";
import { CourseCatalog } from "@/components/course/course-catalog";
import { CourseListSkeleton } from "@/components/skeletons/CourseCardSkeleton";

export const metadata: Metadata = {
  title: "Academy — Courses",
  description:
    "Browse Everlore Academy courses in YouTube automation, forex trading, publishing, freelancing and online business.",
};

export const revalidate = 300;

export default async function AcademyPage() {
  const [courses, categories] = await Promise.all([fetchCourses(), fetchCategories()]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-ink text-white">
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 left-1/3 size-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="container-page relative py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Everlore Academy</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Skills that move you <span className="text-serif-accent text-[#a5bdff]">from learning to earning.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            {courses.length} {courses.length === 1 ? "course" : "courses"} with lifetime access,
            built around a clear outcome.
          </p>
        </div>
      </section>

      <div className="container-page py-12">
        <Suspense fallback={<CourseListSkeleton />}>
          <CourseCatalog courses={courses} categories={categories} />
        </Suspense>
      </div>
    </>
  );
}
