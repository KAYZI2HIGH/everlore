"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ArrowRight, BookOpen, CalendarDays, Clock, GraduationCap, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyLearning } from "@/lib/actions/account.actions";
import { categoryLabel, courseFallbackImage } from "@/lib/config";
import type { Course } from "@/types/course";

type EnrolledCourse = Course & { enrolledAt: string };

const dateFmt = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : dateFmt.format(d);
};
const lessonCount = (c: Course) => c.modules?.reduce((n, m) => n + (m.lessons ?? 0), 0) ?? 0;

export default function LearningPage() {
  const { data: session, status } = useSession();
  const { data, isPending } = useQuery({
    queryKey: ["learning"],
    queryFn: () => getMyLearning(),
    enabled: status === "authenticated",
  });

  const loading = status === "loading" || (status === "authenticated" && isPending);
  const courses: EnrolledCourse[] = [...(data ?? [])].sort(
    (a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime(),
  );
  const firstName = session?.user?.name?.trim().split(/\s+/)[0];

  const totalHours = courses.reduce((n, c) => n + (c.duration ?? 0), 0);
  const totalLessons = courses.reduce((n, c) => n + lessonCount(c), 0);
  const firstEnrolled = courses.length ? courses[courses.length - 1].enrolledAt : null;

  const stats = [
    { icon: GraduationCap, label: "Courses enrolled", value: String(courses.length) },
    { icon: Clock, label: "Hours of content", value: totalHours ? `${totalHours}h` : "—" },
    { icon: BookOpen, label: "Lessons available", value: totalLessons ? String(totalLessons) : "—" },
    { icon: CalendarDays, label: "Learning since", value: firstEnrolled ? formatDate(firstEnrolled) : "—" },
  ];

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">My learning</p>
          {loading ? (
            <Skeleton className="mt-3 h-12 w-72 bg-muted" />
          ) : (
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
              Welcome back
              {firstName ? (
                <>
                  , <span className="text-brand">{firstName}.</span>
                </>
              ) : (
                "."
              )}
            </h1>
          )}
          <p className="mt-3 max-w-xl text-muted-foreground">
            Everything you&apos;re enrolled in, in one place. Jump back in whenever you&apos;re ready.
          </p>
        </div>
        <Button asChild variant="outline" className="self-start rounded-full sm:self-auto">
          <Link href="/academy">
            Browse more courses <ArrowRight />
          </Link>
        </Button>
      </header>

      <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary dark:text-brand">
              <Icon className="size-4" />
            </span>
            <dt className="mt-4 text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-2xl font-extrabold tracking-tight">
              {loading ? <Skeleton className="h-8 w-16 bg-muted" /> : value}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold">Your courses</h2>
        <div className="mt-6">
          {loading ? (
            <LearningSkeleton />
          ) : courses.length === 0 ? (
            <EmptyLearning />
          ) : (
            <ul className="grid gap-4">
              {courses.map((course, i) => (
                <EnrolledCourseRow key={course._id} course={course} priority={i < 2} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function EnrolledCourseRow({ course, priority }: { course: EnrolledCourse; priority?: boolean }) {
  const href = `/academy/courses/${course.slug.current}`;
  const lessons = lessonCount(course);
  const enrolled = formatDate(course.enrolledAt);

  return (
    <li className="group flex flex-col gap-5 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-[0_18px_40px_-22px_rgb(11_42_111/0.35)] sm:flex-row sm:items-center sm:p-5">
      <Link
        href={href}
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-56"
      >
        <Image
          src={course.image || courseFallbackImage(course.category)}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 640px) 224px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </Link>

      <div className="min-w-0 flex-1">
        {course.category && (
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            {categoryLabel(course.category)}
          </p>
        )}
        <Link href={href}>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-snug group-hover:text-brand">
            {course.title}
          </h3>
        </Link>
        {course.instructor && (
          <p className="mt-1 text-sm text-muted-foreground">by {course.instructor}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {enrolled && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" /> Enrolled {enrolled}
            </span>
          )}
          {course.duration ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" /> {course.duration}h
            </span>
          ) : null}
          {lessons > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" /> {lessons} lessons
            </span>
          )}
        </div>
      </div>

      <Button asChild className="w-full rounded-full sm:w-auto">
        <Link href={href}>
          <PlayCircle /> Continue
        </Link>
      </Button>
    </li>
  );
}

function LearningSkeleton() {
  return (
    <div className="grid gap-4" aria-busy aria-label="Loading your courses">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:p-5"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-xl bg-muted sm:w-56" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-24 bg-muted" />
            <Skeleton className="h-5 w-3/4 bg-muted" />
            <Skeleton className="h-4 w-1/3 bg-muted" />
            <Skeleton className="h-3 w-1/2 bg-muted" />
          </div>
          <Skeleton className="h-9 w-full rounded-full bg-muted sm:w-28" />
        </div>
      ))}
    </div>
  );
}

function EmptyLearning() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:py-20">
      <div aria-hidden className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-md">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-primary dark:text-brand">
          <GraduationCap className="size-7" />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold sm:text-3xl">No courses yet</h2>
        <p className="mt-3 text-muted-foreground">
          Once you enrol in a course it will show up here, ready for you to start learning.
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
