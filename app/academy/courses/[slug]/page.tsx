import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Clock,
  Infinity as InfinityIcon,
  ListVideo,
  Lock,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { fetchCourseBySlug, fetchCourseVideoUrl } from "@/lib/content";
import { currentUser } from "@/lib/session";
import { isEnrolled } from "@/lib/db/users";
import { categoryLabel } from "@/lib/config";
import { toEmbedUrl } from "@/lib/video";
import { PurchasePanel } from "@/components/course/purchase-panel";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await fetchCourseBySlug((await params).slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.description?.slice(0, 160),
    openGraph: { images: [{ url: course.image }] },
  };
}

export default async function CoursePage({ params }: Props) {
  const course = await fetchCourseBySlug((await params).slug);
  if (!course) notFound();

  const user = await currentUser();
  const owned = user ? await isEnrolled(user.id, course._id) : false;
  const videoUrl = owned ? await fetchCourseVideoUrl(course._id) : null;

  const modules = course.modules?.filter((m) => m.title) ?? [];
  const lessonCount = modules.reduce((n, m) => n + (m.lessons ?? 0), 0);
  const faqs = course.faqs?.filter((f) => f.question) ?? [];
  const reviews = course.reviews?.filter((r) => r.author && r.text) ?? [];
  const learning = course.learningPoints?.filter(Boolean) ?? [];
  const highlights = course.highlights?.map((h) => h.title).filter(Boolean) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="absolute -right-32 -top-32 size-[520px] rounded-full bg-brand/35 blur-3xl" />
        <div className="container-page relative grid gap-10 py-12 lg:grid-cols-[1fr_380px] lg:py-16">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-white/60">
              <Link href="/academy" className="hover:text-white">
                Academy
              </Link>
              {course.category && (
                <>
                  <span className="mx-2">/</span>
                  <Link href={`/academy?category=${course.category}`} className="hover:text-white">
                    {categoryLabel(course.category)}
                  </Link>
                </>
              )}
            </nav>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">{course.title}</h1>
            {course.description && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{course.description}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              {course.rating ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-gold">
                  <Star className="size-4 fill-current" /> {course.rating.toFixed(1)}
                  {reviews.length > 0 && (
                    <span className="font-normal text-white/60">({reviews.length} reviews)</span>
                  )}
                </span>
              ) : null}
              {course.students ? (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" /> {course.students.toLocaleString()} students
                </span>
              ) : null}
              {course.level && (
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <BarChart3 className="size-4" /> {course.level}
                </span>
              )}
              {course.duration ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" /> {course.duration} hours
                </span>
              ) : null}
            </div>
            {course.instructor && (
              <p className="mt-6 text-sm text-white/60">
                Created by <span className="font-semibold text-white">{course.instructor}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-14 lg:order-1">
          {/* Player / preview */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-black">
            {owned && videoUrl ? (
              <iframe
                src={toEmbedUrl(videoUrl)}
                title={course.title}
                className="absolute inset-0 size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <Image src={course.image} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover opacity-70" />
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <div className="text-center text-white">
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-white/15 backdrop-blur">
                      {owned ? <PlayCircle className="size-8" /> : <Lock className="size-7" />}
                    </span>
                    <p className="mt-4 font-semibold">
                      {owned ? "Lessons are being prepared — check back soon" : "Enroll to unlock every lesson"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {learning.length > 0 && (
            <section className="rounded-3xl border border-border bg-card p-8">
              <h2 className="text-2xl font-bold">What you&apos;ll learn</h2>
              <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {learning.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {modules.length > 0 && (
            <section>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold">Course curriculum</h2>
                <p className="text-sm text-muted-foreground">
                  {modules.length} modules{lessonCount ? ` · ${lessonCount} lessons` : ""}
                </p>
              </div>
              <div className="mt-6 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
                {modules.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-bold text-primary dark:text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{m.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {[m.lessons && `${m.lessons} lessons`, m.duration].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {owned ? (
                      <PlayCircle className="size-5 text-brand" />
                    ) : (
                      <Lock className="size-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {highlights.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Course highlights</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                    <Award className="size-5 shrink-0 text-gold" />
                    <span className="font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {reviews.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Student reviews</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {reviews.map((r, i) => (
                  <figure key={i} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className={`size-4 ${s < (r.rating ?? 0) ? "fill-current" : "opacity-30"}`} />
                      ))}
                    </div>
                    <blockquote className="mt-3 text-sm leading-relaxed">“{r.text}”</blockquote>
                    <figcaption className="mt-4 text-sm font-semibold">{r.author}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {faqs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Frequently asked questions</h2>
              <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card">
                {faqs.map((f, i) => (
                  <details key={i} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                      {f.question}
                      <ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Purchase sidebar */}
        <aside className="lg:order-2">
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_60px_-30px_rgb(11_42_111/0.45)]">
              <div className="relative hidden aspect-video lg:block">
                <Image src={course.image} alt="" fill sizes="380px" className="object-cover" />
              </div>
              <div className="p-6">
                <PurchasePanel course={course} owned={owned} />
                <ul className="mt-6 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
                  {lessonCount > 0 && (
                    <li className="flex items-center gap-3">
                      <ListVideo className="size-4" /> {lessonCount} on-demand lessons
                    </li>
                  )}
                  <li className="flex items-center gap-3">
                    <InfinityIcon className="size-4" /> Lifetime access
                  </li>
                  <li className="flex items-center gap-3">
                    <Smartphone className="size-4" /> Learn on phone, tablet or laptop
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="size-4" /> Secure checkout with Paystack
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
