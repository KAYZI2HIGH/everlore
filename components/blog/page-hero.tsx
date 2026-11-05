import type { ReactNode } from "react";

/** Dark ink hero band used by the blog and careers index pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-ink text-white">
      <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/40 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 left-1/3 size-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="container-page relative py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg text-white/70">{description}</p>}
        {children}
      </div>
    </section>
  );
}
