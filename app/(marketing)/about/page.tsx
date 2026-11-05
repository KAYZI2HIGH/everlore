import type { Metadata } from "next";
import { Compass, Hammer, ShieldCheck, Target, Users } from "lucide-react";
import { About } from "@/components/home/about";
import { Pathways } from "@/components/home/pathways";
import { CtaBand } from "@/components/home/cta-band";
import { getHomeStats } from "@/lib/site-settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description:
    "Everlore Digital Services Limited (RC 9000892) is a Nigerian digital services company focused on education, innovation and execution — helping people learn practical skills that pay online.",
};

const VALUES = [
  {
    icon: Hammer,
    title: "Practical",
    body: "We teach what we do. Every lesson is built around real tasks you can apply the same day — not theory for its own sake.",
  },
  {
    icon: Target,
    title: "Outcome-driven",
    body: "Each course starts from a defined, measurable outcome and works backwards, so you always know what you are working towards.",
  },
  {
    icon: ShieldCheck,
    title: "Honest",
    body: "No hype and no get-rich-quick promises. We are clear about the effort involved, what works and what doesn't.",
  },
  {
    icon: Users,
    title: "Community",
    body: "Live classes, mentorship and fellow learners keep you accountable and moving — you don't have to figure it out alone.",
  },
];

export default async function AboutPage() {
  const stats = await getHomeStats();
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-ink text-white">
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 left-1/3 size-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="container-page relative py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">About Everlore</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Bridging the gap between <span className="text-gold">learning and earning.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Everlore Digital Services Limited is a registered Nigerian company (RC 9000892) focused on
            education, innovation and execution in the digital economy.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">Our story</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Skills are only valuable <span className="text-gold-ink">when they pay.</span>
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Plenty of people learn about making money online. Far fewer turn that knowledge into
              real income. Everlore exists to close that gap — helping individuals and businesses grow
              through practical skills and intelligent digital solutions.
            </p>
            <p>
              Through Everlore Academy we teach the skills that drive the digital economy: YouTube and
              YouTube automation, Amazon KDP and book publishing, affiliate marketing, dropshipping,
              content creation and freelancing. Alongside the academy, our team delivers digital,
              multimedia and publishing services for clients who want the work done for them.
            </p>
            <p className="rounded-3xl border border-border bg-card p-6 text-base text-foreground">
              <Compass className="mb-3 size-6 text-gold-ink" />
              <span className="font-semibold">Our mission:</span> to move people from skill
              acquisition to monetisation with structured, outcome-backed learning — and to keep
              every strategy we teach tested, current and honest.
            </p>
          </div>
        </div>
      </section>

      <About stats={stats} />
      <Pathways />

      <section className="py-24 lg:py-32">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">Our values</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              What we <span className="text-gold-ink">stand for.</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, ...v }) => (
              <div key={v.title} className="rounded-3xl border border-border bg-card p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary dark:text-brand">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-8 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
