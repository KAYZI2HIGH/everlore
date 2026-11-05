import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** The "e" brand mark on its own (navy). */
export function LogoMark({ className }: { className?: string }) {
  return <Image src="/brand/mark.png" alt="" width={170} height={182} className={cn("h-8 w-auto", className)} />;
}

/**
 * Full "everlore academy" lockup. `variant="auto"` swaps to the white version in
 * dark mode; use "light" on navy/dark sections regardless of theme.
 */
export function Logo({
  className,
  href = "/",
  variant = "auto",
  priority,
}: {
  className?: string;
  href?: string;
  variant?: "auto" | "light";
  priority?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)} aria-label="Everlore Academy — home">
      {variant === "auto" && (
        <Image
          src="/brand/logo-academy.png"
          alt="Everlore Academy"
          width={705}
          height={210}
          priority={priority}
          className="h-9 w-auto dark:hidden sm:h-10"
        />
      )}
      <Image
        src="/brand/logo-academy-white.png"
        alt="Everlore Academy"
        width={705}
        height={210}
        priority={priority}
        className={cn("h-9 w-auto sm:h-10", variant === "auto" && "hidden dark:block")}
      />
    </Link>
  );
}
