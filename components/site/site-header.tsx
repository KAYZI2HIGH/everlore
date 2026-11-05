"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  ChevronDown,
  Clapperboard,
  LineChart,
  Link2,
  Menu,
  PenTool,
  Package,
  Briefcase,
  ShoppingBag,
  Youtube,
  Bot,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { UserMenu } from "@/components/site/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { categories } from "@/lib/config";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  youtube: Youtube,
  "youtube-automation": Bot,
  "amazon-kdp": BookOpenCheck,
  "book-publishing": BookOpen,
  "affiliate-marketing": Link2,
  dropshipping: Package,
  "content-creation": Clapperboard,
  freelancing: Briefcase,
  "forex-trading": LineChart,
};

const NAV = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Insights" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[background-color,border-color] duration-300",
        scrolled ? "border-border/70 bg-background/85 backdrop-blur-xl" : "border-transparent bg-background",
      )}
    >
      <div className="container-page flex h-16 items-center gap-4 lg:h-[72px]">
        <Logo priority />

        <nav className="ml-8 hidden items-center gap-0.5 lg:flex" aria-label="Main">
          <AcademyMenu active={isActive("/academy")} />
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 font-display text-[14.5px] font-medium text-foreground/70 transition-colors hover:text-foreground",
                isActive(item.href) && "bg-secondary text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle className="rounded-full" />
          {session?.user && <CartButton />}
          {status === "loading" ? (
            <div className="ml-1 size-9 animate-pulse rounded-full bg-muted" />
          ) : session?.user ? (
            <div className="ml-1">
              <UserMenu />
            </div>
          ) : (
            <div className="ml-1 hidden items-center gap-1.5 sm:flex">
              <Button asChild variant="ghost" className="rounded-full font-display">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild className="rounded-full px-5 font-display">
                <Link href="/sign-up">Start learning</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[88vw] max-w-sm flex-col gap-0 overflow-y-auto p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="border-b border-border p-5">
                <Logo />
              </div>
              <nav className="flex-1 p-3" aria-label="Mobile">
                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Academy
                </p>
                <Link
                  href="/academy"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 font-display font-semibold hover:bg-secondary"
                >
                  All courses <ArrowRight className="size-4" />
                </Link>
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((c) => (
                    <Link
                      key={c.value}
                      href={`/academy?category=${c.value}`}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-secondary"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
                <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Company
                </p>
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 font-display font-medium hover:bg-secondary",
                      isActive(item.href) && "bg-secondary",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {!session?.user && (
                <div className="grid gap-2 border-t border-border p-5">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/sign-up" onClick={() => setOpen(false)}>Start learning</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full">
                    <Link href="/sign-in" onClick={() => setOpen(false)}>Sign in</Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function AcademyMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3.5 py-2 font-display text-[14.5px] font-medium text-foreground/70 transition-colors hover:text-foreground",
          (active || open) && "bg-secondary text-foreground",
        )}
      >
        Academy <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      <div
        className={cn(
          "absolute left-0 top-full z-50 pt-3 transition-all duration-150",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="grid w-[720px] grid-cols-[1fr_240px] overflow-hidden rounded-3xl border border-border bg-popover shadow-[0_30px_60px_-30px_rgb(10_42_110/0.45)]">
          <div className="grid grid-cols-2 gap-1 p-4">
            {categories.map((c) => {
              const Icon = ICONS[c.value] ?? BookOpen;
              return (
                <Link
                  key={c.value}
                  href={`/academy?category=${c.value}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-secondary"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground dark:text-brand">
                    <Icon className="size-4.5" />
                  </span>
                  <span>
                    <span className="block font-display text-sm font-semibold">{c.label}</span>
                    <span className="block text-xs text-muted-foreground">{c.blurb}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col justify-between bg-primary p-6 text-primary-foreground dark:bg-[#0f2259] dark:text-white">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Everlore Academy</p>
              <p className="mt-3 font-display text-xl font-bold leading-snug">Learn skills that pay — at your own pace.</p>
              <p className="mt-2 text-sm opacity-75">Video lessons, live classes and 1:1 mentorship.</p>
            </div>
            <div className="mt-6 grid gap-2">
              <Link
                href="/academy"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-between rounded-full bg-gold px-4 py-2.5 font-display text-sm font-semibold text-gold-foreground hover:bg-gold/90"
              >
                Browse all courses <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/academy/learning"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-between rounded-full border border-white/25 px-4 py-2.5 font-display text-sm font-semibold hover:bg-white/10"
              >
                My learning <PenTool className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartButton() {
  const { cartCount } = useCart();
  return (
    <Button asChild variant="ghost" size="icon" className="relative rounded-full">
      <Link href="/academy/cart" aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}>
        <ShoppingBag className="size-5" />
        {cartCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid size-4.5 place-items-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground">
            {cartCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
