import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Building2, CalendarDays, Mail, MapPin, Signal, Wallet } from "lucide-react";
import { site } from "@/lib/config";
import { formatDate, getJobBySlug, getJobs } from "@/lib/blog";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Role not found" };
  const description = `${job.type} ${job.title} role in ${job.department}, ${job.location}. ${job.description}`.slice(0, 160);
  return {
    title: `${job.title} — Careers`,
    description,
    alternates: { canonical: `/careers/${job.slug}` },
    openGraph: { title: `${job.title} at ${site.name}`, description },
  };
}

export default async function JobPage({ params }: { params: Params }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const applyHref = `mailto:${site.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`;
  const paragraphs = job.description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const facts = [
    { icon: Building2, label: "Department", value: job.department },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Briefcase, label: "Type", value: job.type },
    { icon: Signal, label: "Level", value: job.level },
    { icon: Wallet, label: "Salary", value: job.salary },
    { icon: CalendarDays, label: "Posted", value: formatDate(job.postedAt) },
  ].filter((f) => Boolean(f.value));

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-ink text-white">
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 left-1/3 size-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="container-page relative py-14 sm:py-16">
          <Link
            href="/careers#open-roles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="size-4" /> All open roles
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-gold">{job.department}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{job.title}</h1>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            {[job.location, job.type, job.level && `${job.level} level`].filter(Boolean).map((v) => (
              <li key={v as string} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/80">
                {v}
              </li>
            ))}
          </ul>
          <a
            href={applyHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground transition hover:opacity-90"
          >
            <Mail className="size-4" /> Apply for this role
          </a>
        </div>
      </section>

      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <div className="max-w-[68ch]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">About the role</p>
          <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.8] text-foreground/85">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">Details for this role are coming soon.</p>
            )}
          </div>

          {job.tags.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold">
                Skills <span className="text-gold-ink">we&apos;re looking for</span>
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Role details</h2>
            <dl className="mt-5 space-y-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary dark:text-brand">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <a
              href={applyHref}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Mail className="size-4" /> Apply
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Send your CV and a short note to {site.email}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
