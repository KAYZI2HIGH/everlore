import Image from "next/image";
import { StatCounter } from "@/components/home/stat-counter";
import type { HomeStat } from "@/lib/site-settings";

export function About({ stats }: { stats: HomeStat[] }) {
  return (
    <section id="about" className="scroll-mt-20 py-24 lg:py-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-muted">
            <Image
              src="/images/community.jpg"
              alt="Everlore learners studying together outdoors"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 right-6 rounded-2xl bg-primary px-6 py-5 text-primary-foreground shadow-xl">
            <p className="text-3xl font-extrabold">RC 9000892</p>
            <p className="text-xs opacity-80">Registered in Nigeria</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">About Everlore</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            Built on knowledge. <span className="text-gold-ink">Designed for growth.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Everlore Digital Services Limited is a modern digital services company focused on
            education, innovation and execution. We bridge the gap between learning and real-world
            application — helping individuals and businesses grow through practical skills and
            intelligent digital solutions.
          </p>
          <dl
            className="mt-10 grid gap-6 border-t border-border pt-8"
            style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </dd>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
