import type { Metadata } from "next";
import Link from "next/link";
import { Globe2, Mail, Rocket, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/config";
import { getJobs, type JobPosting } from "@/lib/blog";
import { PageHero } from "@/components/blog/page-hero";
import { JobCard } from "@/components/careers/job-card";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Everlore and help people build skills and income in the digital economy. See our open roles.",
  alternates: { canonical: "/careers" },
};

export const revalidate = 300;

const PERKS = [
  {
    icon: Rocket,
    title: "Real impact",
    body: "Your work reaches learners and clients building income in the digital economy.",
  },
  {
    icon: Globe2,
    title: "Remote-friendly",
    body: "We care about outcomes, not office hours. Work from where you do your best work.",
  },
  {
    icon: Sparkles,
    title: "Always learning",
    body: "Free access to every Everlore Academy course and time to sharpen your craft.",
  },
  {
    icon: Users,
    title: "Small, senior team",
    body: "Ship quickly with people who trust you, give clear feedback and share the wins.",
  },
];

type SearchParams = Promise<{ department?: string | string[] }>;

export default async function CareersPage({ searchParams }: { searchParams: SearchParams }) {
  const { department: rawDept } = await searchParams;
  const department = Array.isArray(rawDept) ? rawDept[0] : rawDept;

  const jobs = await getJobs();
  const departments = [...new Set(jobs.map((j) => j.department))].sort((a, b) => a.localeCompare(b));
  const active = department && departments.includes(department) ? department : undefined;

  const groups = new Map<string, JobPosting[]>();
  for (const job of jobs) {
    if (active && job.department !== active) continue;
    groups.set(job.department, [...(groups.get(job.department) ?? []), job]);
  }
  const grouped = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <PageHero
        eyebrow="Careers at Everlore"
        title={
          <>
            Help people move <span className="text-gold">from learning to earning.</span>
          </>
        }
        description={
          jobs.length > 0
            ? `${jobs.length} open ${jobs.length === 1 ? "role" : "roles"}. Join a team building practical digital education and services.`
            : "We're a small team building practical digital education and services."
        }
      >
        {jobs.length > 0 && (
          <a
            href="#open-roles"
            className="mt-8 inline-flex items-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground transition hover:opacity-90"
          >
            See open roles
          </a>
        )}
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">Why work with us</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Do the best work <span className="text-gold-ink">of your career.</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-3xl border border-border bg-card p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary dark:text-brand">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="open-roles" className="scroll-mt-20 border-t border-border bg-muted/40 py-16 sm:py-20">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">Open roles</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Find your <span className="text-gold-ink">place on the team.</span>
          </h2>

          {jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {departments.length > 1 && (
                <nav aria-label="Filter by department" className="mt-8 flex flex-wrap gap-2">
                  <Chip href="/careers#open-roles" active={!active}>
                    All departments
                  </Chip>
                  {departments.map((d) => (
                    <Chip key={d} href={`/careers?department=${encodeURIComponent(d)}#open-roles`} active={active === d}>
                      {d}
                    </Chip>
                  ))}
                </nav>
              )}

              <div className="mt-10 space-y-12">
                {grouped.map(([dept, list]) => (
                  <div key={dept}>
                    <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
                      <h3 className="text-xl font-bold">{dept}</h3>
                      <span className="text-sm text-muted-foreground">
                        {list.length} {list.length === 1 ? "role" : "roles"}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {list.map((job) => (
                        <JobCard key={job._id} job={job} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-12 text-center text-sm text-muted-foreground">
                Don&apos;t see a fit? Send your CV to{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-brand hover:underline">
                  {site.email}
                </a>
                .
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary dark:text-brand">
        <Mail className="size-6" />
      </span>
      <h3 className="mt-5 text-xl font-bold">No open roles right now</h3>
      <p className="mt-2 max-w-md text-muted-foreground">
        No open roles right now — send your CV to{" "}
        <a href={`mailto:${site.email}`} className="font-semibold text-brand hover:underline">
          {site.email}
        </a>{" "}
        and we&apos;ll reach out when something fits.
      </p>
    </div>
  );
}
