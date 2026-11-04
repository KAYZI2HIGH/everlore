"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { UserMenu } from "@/components/site/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/academy", label: "Academy" },
  { href: "/blog", label: "Insights" },
  { href: "/#services", label: "Services" },
  { href: "/hiring", label: "Careers" },
  { href: "/#contact", label: "Contact" },
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

  const isActive = (href: string) =>
    !href.includes("#") && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-background/0",
      )}
    >
      <div className="container-page flex h-16 items-center gap-6 lg:h-18">
        <Logo />

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive(item.href) && "bg-secondary text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle className="rounded-full" />
          {session?.user && <CartButton />}
          {status === "loading" ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : session?.user ? (
            <UserMenu />
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Button asChild variant="ghost" className="rounded-full">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild className="rounded-full px-5">
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
            <SheetContent side="right" className="w-[86vw] max-w-sm p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo />
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {!session?.user && (
                <div className="mt-8 grid gap-2">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/sign-up">Start learning</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full">
                    <Link href="/sign-in">Sign in</Link>
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
