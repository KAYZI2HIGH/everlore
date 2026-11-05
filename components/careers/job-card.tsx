import Link from "next/link";
import { ArrowUpRight, Briefcase, MapPin, Signal, Wallet } from "lucide-react";
import { formatDate, type JobPosting } from "@/lib/blog";

export function JobFacts({ job, className }: { job: JobPosting; className?: string }) {
  const facts = [
    { icon: MapPin, label: job.location },
    { icon: Briefcase, label: job.type },
    { icon: Signal, label: job.level ? `${job.level} level` : null },
    { icon: Wallet, label: job.salary },
  ].filter((f): f is { icon: typeof MapPin; label: string } => Boolean(f.label));

  return (
    <ul className={className ?? "flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"}>
      {facts.map(({ icon: Icon, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <Icon className="size-4 shrink-0" /> {label}
        </li>
      ))}
    </ul>
  );
}

export function JobCard({ job }: { job: JobPosting }) {
  return (
    <article className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">{job.department}</p>
        <h3 className="mt-2 text-xl font-bold leading-snug group-hover:text-brand">
          <Link href={`/careers/${job.slug}`} className="after:absolute after:inset-0">
            {job.title}
          </Link>
        </h3>
        <JobFacts job={job} className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground" />
        {job.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
        <span className="text-xs text-muted-foreground">Posted {formatDate(job.postedAt)}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          View role <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
