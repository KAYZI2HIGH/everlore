import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-16 text-primary-foreground sm:px-16 sm:py-20 dark:bg-[#0f2259] dark:text-white">
          <div aria-hidden className="absolute -right-20 -top-24 size-80 rounded-full bg-gold/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 left-10 size-80 rounded-full bg-brand/40 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                Ready to transform your <span className="text-serif-accent text-gold">digital future?</span>
              </h2>
              <p className="mt-4 text-lg opacity-75">
                Create a free account, browse the academy and start your first lesson today.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full bg-gold px-7 text-base text-gold-foreground hover:bg-gold/90">
                <Link href="/sign-up">
                  Create free account <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/30 bg-transparent px-7 text-base text-current hover:bg-white/10 hover:text-current"
              >
                <Link href="/academy">See courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
