import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { site } from "@/lib/config";

const COLUMNS = [
  {
    title: "Academy",
    links: [
      { href: "/academy", label: "All courses" },
      { href: "/academy/learning", label: "My learning" },
      { href: "/academy/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#about", label: "About Everlore" },
      { href: "/#services", label: "Services" },
      { href: "/blog", label: "Insights & resources" },
      { href: "/hiring", label: "Careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/#contact", label: "Contact us" },
      { href: `mailto:${site.email}`, label: site.email },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {site.legalName} builds practical skills, real-world strategies and sustainable income
            for the digital economy.
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
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
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. RC 9000892.
          </p>
          <p>Made in Nigeria for learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
