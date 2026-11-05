import Link from "next/link";
import { ArrowUpRight, BookOpenText, Clapperboard, GraduationCap, Laptop } from "lucide-react";

const SERVICES = [
  {
    icon: GraduationCap,
    title: "Everlore Academy",
    body: "Practical digital education for modern income creation and career growth.",
    href: "/academy",
  },
  {
    icon: BookOpenText,
    title: "Insights & Resources",
    body: "Guides, breakdowns and research on what is working in the digital economy right now.",
    href: "/blog",
  },
  {
    icon: Laptop,
    title: "Digital Services",
    body: "Done-for-you builds: websites, automations, channel setup and growth systems.",
    href: "/contact",
  },
  {
    icon: Clapperboard,
    title: "Multimedia & Publishing",
    body: "Book publishing through aggregator platforms and KDP, video production and content.",
    href: "/contact",
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 py-24 lg:py-32">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">What we do</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            One company. <span className="text-gold-ink">Four ways to grow.</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, ...s }) => (
            <Link
              key={s.title}
              href={s.href}
              className="group flex flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary dark:text-brand">
                  <Icon className="size-6" />
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>
              <h3 className="mt-8 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
