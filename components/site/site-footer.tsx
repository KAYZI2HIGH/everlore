import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { categories, site } from "@/lib/config";

const COLUMNS = [
  {
    title: "Courses",
    links: [
      { href: "/academy", label: "All courses" },
      ...categories.slice(0, 5).map((c) => ({ href: `/academy?category=${c.value}`, label: c.label })),
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Everlore" },
      { href: "/services", label: "Services" },
      { href: "/blog", label: "Insights & resources" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Your account",
    links: [
      { href: "/academy/learning", label: "My learning" },
      { href: "/academy/wishlist", label: "Wishlist" },
      { href: "/academy/cart", label: "Cart" },
      { href: "/sign-in", label: "Sign in" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="max-w-sm space-y-5">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Practical online courses that teach you to build income on YouTube, Amazon KDP, book
            publishing and more — by {site.legalName}.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand"
          >
            <Mail className="size-4" /> {site.email}
          </a>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-foreground/80 transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName} · RC 9000892
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">Privacy policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
