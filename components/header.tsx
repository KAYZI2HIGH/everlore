"use client";
import React from "react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/menu-toggle-icon";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CircleUserRound, ShoppingCart } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";

export function Header({maxwidth}: {maxwidth?: boolean}) {
  const [open, setOpen] = React.useState(false);
  const { cartCount } = useCart();
  const { data: session } = useSession();

  const links = [
    {
      label: "Explore Courses",
      href: "/academy/courses",
    },
    {
      label: "Read Our Blogs",
      href: "/blogs",
    },
    {
      label: "Career Opportunities",
      href: "/hiring",
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

  return (
    <header
      className={
        "fixed top-0 z-1000 w-full border-b border-border bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/50"
      }
    >
      <nav
        className={cn(
          "mx-auto flex h-14 w-full items-center justify-between p-8 max-md:px-5",
          maxwidth ? "max-w-6xl" : "max-w-full",)}
      >
        <Link
          href="/"
          className="w-full"
          aria-label="Everlore home"
        >
          <Logo className="-ml-16" />
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({ variant: "ghost" })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          {!session?.user ?
            <>
              <Button
                variant="outline"
                asChild
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          : <div className="hidden md:flex items-center gap-2">
              {/* User Profile Dropdown */}
              <ProfileDropdown>
                <img
                  src={
                    session?.user?.image ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                  }
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="shrink-0 rounded-full border-2 border-emerald-400"
                />
              </ProfileDropdown>
            </div>
          }
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
              onClick={(e) => handleSmoothScroll(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
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
