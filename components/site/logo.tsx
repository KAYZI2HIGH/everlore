import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-8", className)}>
      <circle cx="20" cy="20" r="20" className="fill-primary" />
      <path
        d="M12 11h11v3.4h-7.2v3.7h6.4v3.3h-6.4v4.2H23V29H12z"
        className="fill-primary-foreground"
      />
      <path d="M25 11h3.8v14.6H33V29h-8z" className="fill-gold" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)} aria-label="Everlore home">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-extrabold tracking-tight">EVERLORE</span>
        <span className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Insight for the future
        </span>
      </span>
    </Link>
  );
}
