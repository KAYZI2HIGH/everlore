import Image from "next/image";
import { Quote } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { site } from "@/lib/config";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[1fr_1.05fr]">
      <div className="flex min-h-dvh flex-col px-4 py-6 sm:px-10 lg:px-14 xl:px-20">
        <header>
          <Logo />
        </header>
        <main className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-md animate-fade-in-up">
            {children}
          </div>
        </main>
        <footer className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.legalName}
        </footer>
      </div>

      <aside className="hidden p-4 lg:block">
        <div className="sticky top-4 h-[calc(100dvh-2rem)] overflow-hidden rounded-[28px] bg-muted animate-fade-in [animation-delay:150ms]">
          <div className="absolute inset-0">
            <Image
              src="/images/auth-side.jpg"
              alt="Learners working together on their laptops"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent"
          />

          <div className="absolute inset-x-6 top-6 flex justify-end">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              Live classes · 1:1 mentorship
            </span>
          </div>

          <div className="absolute inset-x-8 bottom-8 text-white xl:inset-x-12 xl:bottom-12">
            <Quote className="size-8 text-gold" />
            <p className="mt-4 max-w-lg text-3xl font-extrabold leading-tight xl:text-4xl">
              Skills that{" "}
              <span className="text-serif-accent text-gold">pay</span>, taught
              by people who do the work.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
              Join 200+ learners building real income with practical,
              outcome-driven courses in the digital economy.
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/20 pt-6">
              {[
                ["200+", "Learners"],
                ["1:1", "Mentorship"],
                ["Weekly", "Live classes"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-xl font-extrabold">{value}</dd>
                  <dd className="mt-0.5 text-xs text-white/70">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </aside>
    </div>
  );
}
