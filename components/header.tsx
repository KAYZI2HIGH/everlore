"use client";
import React from "react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/menu-toggle-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { createPortal } from "react-dom";
import Link from "next/link";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const lastScrollYRef = React.useRef(0);

  const links = [
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "Testimonials",
      href: "#testimonials",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ];

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setOpen(false); // Close mobile menu if open
    }
  };

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY < 50) {
        // Always show at top
        setIsHidden(false);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setIsHidden(true);
      } else {
        // Scrolling up - show
        setIsHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 w-full border-b z-1000 bg-background/95 supports-backdrop-filter:bg-background/50 border-border backdrop-blur-lg transition-transform duration-300",
        isHidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <nav className="mx-auto flex h-14 w-full items-center justify-between p-10 px-5 md:px-10">
        <Link href={"/"} className="w-full">
          <Logo className="-ml-16" />
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({ variant: "ghost" })}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          <Button
            variant="outline"
            asChild
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon
            open={open}
            className="size-5"
            duration={300}
          />
        </Button>
      </nav>
      <MobileMenu
        open={open}
        className="flex flex-col justify-between gap-2 relative z-1000 pt-10"
      >
        <div className="grid gap-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start",
              })}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e as any, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <ThemeToggle className="self-start" />
          <Button
            variant="outline"
            className="w-full bg-transparent"
            asChild
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            className="w-full"
            asChild
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg",
        "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden",
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn(
          "data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
          "size-full p-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export const Logo = ({ className }: { className?: string }) => (
  <Image
    src="/logo.png"
    alt="Everlore"
    width={100}
    height={100}
    className={cn("h-44 w-auto", className)}
  />
);
