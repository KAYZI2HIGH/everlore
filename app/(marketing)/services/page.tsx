import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Clapperboard,
  GraduationCap,
  Laptop,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/home/cta-band";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Everlore Academy, insights and resources, done-for-you digital services and multimedia & publishing — including book publishing via Amazon KDP and video production.",
};

type Service = {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  points: string[];
  image: string;
  imageAlt: string;
  cta: { label: string; href: string };
};

const SERVICES: Service[] = [
  {
    id: "academy",
    icon: GraduationCap,
    eyebrow: "Everlore Academy",
    title: "Practical courses for",
    accent: "modern income.",
    body: "Structured, outcome-backed courses in the skills that pay online — taught by people who do the work, with live classes and mentorship to keep you moving.",
    points: [
      "YouTube and YouTube automation",
      "Amazon KDP and book publishing",
      "Affiliate marketing and dropshipping",
      "Content creation and freelancing",
      "Lifetime access to the courses you enrol in",
    ],
    image: "/images/live-class.jpg",
    imageAlt: "An Everlore live class in session",
    cta: { label: "Explore the academy", href: "/academy" },
  },
  {
    id: "insights",
    icon: BookOpenText,
    eyebrow: "Insights & Resources",
    title: "Know what is working",
    accent: "right now.",
    body: "Guides, breakdowns and research on the digital economy, so you can make decisions on evidence instead of hype.",
    points: [
      "Step-by-step guides and tutorials",
      "Platform and strategy breakdowns",
      "Market research and trend notes",
      "Free to read on the Everlore blog",
    ],
    image: "/images/podcast.jpg",
    imageAlt: "Recording an Everlore podcast episode",
    cta: { label: "Read the blog", href: "/blog" },
  },
  {
    id: "digital",
    icon: Laptop,
    eyebrow: "Digital Services",
    title: "Done-for-you",
    accent: "digital builds.",
    body: "Prefer to have it built for you? Our team sets up the systems behind an online business so you can focus on running it.",
    points: [
      "YouTube channel setup and branding",
      "Websites and landing pages",
      "Workflow and business automation",
      "Growth systems for creators and small businesses",
    ],
    image: "/images/mentor.jpg",
    imageAlt: "An Everlore team member working with a client",
    cta: { label: "Start a project", href: "/contact" },
  },
  {
    id: "multimedia",
    icon: Clapperboard,
    eyebrow: "Multimedia & Publishing",
    title: "Publish your book.",
    accent: "Produce your content.",
    body: "From manuscript to marketplace and from idea to finished video — we handle the production and publishing work end to end.",
    points: [
      "Book publishing through aggregator platforms",
      "Amazon KDP setup and listing",
      "Video production and editing",
      "Content for channels, brands and courses",
    ],
    image: "/images/hero-group.jpg",
    imageAlt: "A creative team reviewing a project together",
    cta: { label: "Talk to us", href: "/contact" },
  },
];

const STEPS = [
  {
    title: "Tell us your goal",
    body: "Send a message or pick a course. We start from the outcome you want, not a fixed package.",
  },
  {
    title: "Get a clear plan",
    body: "We recommend the right course or scope the work, with timelines and pricing in NGN up front.",
  },
  {
    title: "Learn or launch",
    body: "Start learning with live support, or let our team deliver — with updates at every step.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-ink text-white">
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 left-1/3 size-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="container-page relative py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Our services</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            One company. <span className="text-gold">Four ways to grow.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Learn the skills yourself, stay ahead with our research, or have our team build and
            publish for you.
          </p>
          <nav aria-label="Services" className="mt-8 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 transition hover:border-gold hover:text-white"
              >
                {s.eyebrow}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="py-12 lg:py-16">
        {SERVICES.map(({ icon: Icon, ...s }, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-20 py-12 lg:py-16">
            <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-[28px] bg-muted ${i % 2 ? "lg:order-2" : ""}`}>
                <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div>
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary dark:text-brand">
                  <Icon className="size-6" />
                </span>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">{s.eyebrow}</p>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                  {s.title} <span className="text-gold-ink">{s.accent}</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{s.body}</p>
                <ul className="mt-6 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-ink" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7 text-base">
                  <Link href={s.cta.href}>
                    {s.cta.label} <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="bg-muted/50 py-24 lg:py-32">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">How we work</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Simple process. <span className="text-gold-ink">Clear outcomes.</span>
            </h2>
          </div>
          <ol className="mt-14 grid gap-4 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="rounded-3xl border border-border bg-card p-8 sm:p-10">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-8 text-2xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
