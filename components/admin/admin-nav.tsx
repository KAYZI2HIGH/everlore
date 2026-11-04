"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  CalendarClock,
  CreditCard,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  Mail,
  Menu,
  PenSquare,
  Radio,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const MAIN = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
];

const NEXT = [
  { label: "Video uploads", icon: Upload },
  { label: "Live classes", icon: Radio },
  { label: "Bookings", icon: CalendarClock },
  { label: "Email list", icon: Mail },
];

export function AdminNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Logo href="/admin" />
        <button onClick={() => setOpen(!open)} aria-label="Toggle navigation" className="p-2">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-sidebar transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center px-5">
          <Logo href="/admin" />
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Admin">
          <ul className="space-y-1">
            {MAIN.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground",
                    active(href) && "bg-sidebar-accent text-foreground",
                  )}
                >
                  <Icon className="size-4.5" /> {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="/studio"
                target="_blank"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
              >
                <PenSquare className="size-4.5" /> Content studio
                <ExternalLink className="ml-auto size-3.5" />
              </a>
            </li>
          </ul>
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Coming next
            </p>
            <ul className="mt-2 space-y-1">
              {NEXT.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground/60"
                >
                  <Icon className="size-4.5" /> {label}
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="flex items-center gap-3 border-t border-border p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <ThemeToggle className="rounded-full" />
        </div>
        <Link href="/" className="border-t border-border px-5 py-3 text-xs text-muted-foreground hover:text-foreground">
          ← Back to website
        </Link>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
