import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle, Radio, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[640px] rounded-full bg-brand/15 blur-3xl"
      />
      <div className="container-page relative grid items-center gap-14 pb-20 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-16">
        <div className="animate-fade-in-up">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-sm transition hover:border-brand/40"
          >
            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
              New
            </span>
            Everlore Academy is now enrolling
            <ArrowRight className="size-3.5" />
          </Link>

          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-[4.1rem]">
            Learn the skills that{" "}
            <span className="text-brand">actually pay</span> in the digital
            economy.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Outcome-driven courses in YouTube automation, forex, publishing, freelancing and online
            business — taught by people who do it, with live classes and 1:1 mentorship to keep you
            moving.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
              <Link href="/academy">
                Explore courses <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7 text-base">
              <Link href="/#learn">
                <PlayCircle /> How it works
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["avatar-1", "avatar-2", "avatar-3"].map((a) => (
                <Image
                  key={a}
                  src={`/images/${a}.jpg`}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-0.5 text-muted-foreground">
                <span className="font-semibold text-foreground">200+ learners</span> building income
                with Everlore
              </p>
            </div>
          </div>
        </div>

        <HeroCollage />
      </div>
    </section>
  );
}

function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] animate-fade-in [animation-delay:150ms]">
      <div className="grid grid-cols-5 grid-rows-6 gap-3 sm:gap-4 aspect-[5/5.4]">
        <div className="relative col-span-3 row-span-6 overflow-hidden rounded-[28px] bg-muted">
          <Image
            src="/images/hero-learner.jpg"
            alt="A learner studying on her laptop"
            fill
            priority
            sizes="(min-width: 1024px) 340px, 60vw"
            className="object-cover"
          />
        </div>
        <div className="relative col-span-2 row-span-3 overflow-hidden rounded-[28px] bg-muted">
          <Image
            src="/images/hero-creator.jpg"
            alt="A creator working on his laptop"
            fill
            sizes="(min-width: 1024px) 220px, 40vw"
            className="object-cover"
          />
        </div>
        <div className="relative col-span-2 row-span-3 overflow-hidden rounded-[28px] bg-muted">
          <Image
            src="/images/hero-group.jpg"
            alt="A study group discussing a project"
            fill
            sizes="(min-width: 1024px) 220px, 40vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Floating UI cards */}
      <div className="absolute -left-4 bottom-10 w-60 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:-left-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Continue learning
        </p>
        <p className="mt-1 text-sm font-bold leading-snug">YouTube Automation: Lesson 4</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[62%] rounded-full bg-brand" />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">62% complete</p>
      </div>
      <div className="absolute -right-2 top-8 flex items-center gap-2.5 rounded-full border border-border bg-card/95 py-2 pl-2 pr-4 shadow-xl backdrop-blur sm:-right-6">
        <span className="grid size-8 place-items-center rounded-full bg-rose-500/15 text-rose-500">
          <Radio className="size-4" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-bold">Live class</p>
          <p className="text-[11px] text-muted-foreground">Thursdays · 7pm WAT</p>
        </div>
      </div>
    </div>
  );
}
