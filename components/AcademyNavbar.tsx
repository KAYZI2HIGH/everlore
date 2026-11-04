"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Bell,
  CircleUserRound,
  ShoppingCart,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Logo } from "./header";
import ProfileDropdown from "./ProfileDropdown";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/hooks/useCart";

const AcademyNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks = [
    { label: "Courses", href: "/academy/courses" },
    { label: "My Learning", href: "/academy/learning" },
    { label: "Wishlist", href: "/academy/wishlist" },
    { label: "Join Everlore", href: "/hiring" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 overflow-hidden flex items-center -ml-8">
              <Logo />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-xs mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-10 py-2 text-sm bg-secondary border-border"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Button
              size="icon"
              variant="ghost"
              className="relative"
              aria-label="Shopping cart"
              asChild
            >
              <Link href="/academy/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-xs font-semibold text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* User Profile Dropdown */}
            <ProfileDropdown>
              <Button
                size="icon"
                variant="outline"
                aria-label="Open account menu"
              >
                <CircleUserRound
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </ProfileDropdown>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {mobileMenuOpen ?
              <X className="w-5 h-5" />
            : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pr-0 py-2 flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 py-2 text-sm bg-secondary border-border"
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="relative"
                aria-label="Shopping cart"
                asChild
              >
                <Link href="/academy/cart">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-xs font-semibold text-white flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AcademyNavbar;
