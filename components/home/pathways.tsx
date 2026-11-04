import { FlaskConical, LineChart, Route, Target } from "lucide-react";

const ITEMS = [
  {
    icon: Route,
    title: "Skill-to-Income Pathways™",
    body: "Structured learning paths that move you from skill acquisition to monetisation — step by step.",
    className: "lg:col-span-2 bg-primary text-primary-foreground",
    iconClass: "bg-white/10 text-gold",
    bodyClass: "text-primary-foreground/75",
  },
  {
    icon: FlaskConical,
    title: "Everlore Digital Lab™",
    body: "A members-only environment where strategies are tested, updated and refined before they're taught.",
    className: "bg-card",
    iconClass: "bg-brand/10 text-brand",
    bodyClass: "text-muted-foreground",
  },
  {
    icon: Target,
    title: "Outcome-Backed Learning™",
    body: "Every course is built around a defined, measurable outcome — not just a list of lessons.",
    className: "bg-card",
    iconClass: "bg-gold/15 text-gold",
    bodyClass: "text-muted-foreground",
  },
  {
    icon: LineChart,
    title: "Everlore Growth Ledger™",
    body: "Your personal progress vault that tracks skills learned, paths completed and growth milestones.",
    className: "lg:col-span-2 bg-secondary",
    iconClass: "bg-primary text-primary-foreground",
    bodyClass: "text-muted-foreground",
  },
];

export function Pathways() {
  return (
    <section className="bg-muted/50 py-24 lg:py-32">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Why Everlore</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            We don&apos;t teach courses. <span className="text-serif-accent">We build outcomes.</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, ...item }) => (
            <div
              key={item.title}
              className={`rounded-3xl border border-border p-8 sm:p-10 ${item.className}`}
            >
              <span className={`grid size-12 place-items-center rounded-2xl ${item.iconClass}`}>
                <Icon className="size-6" />
              </span>
              <h3 className="mt-8 text-2xl font-bold">{item.title}</h3>
              <p className={`mt-3 max-w-md leading-relaxed ${item.bodyClass}`}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
