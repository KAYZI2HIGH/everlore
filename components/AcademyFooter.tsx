"use client";

import Link from "next/link";
import { Mail, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const footerLinks = {
  explore: [
    { name: "Courses", href: "/academy/courses" },
    { name: "My Learning", href: "/academy/learning" },
    { name: "Wishlist", href: "/academy/wishlist" },
    { name: "Cart", href: "/academy/cart" },
  ],
  support: [
    { name: "Contact Us", href: "/#contact" },
    { name: "FAQs", href: "/academy/faqs" },
  ],
  company: [
    { name: "About Us", href: "/#about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/everlore", icon: Twitter },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/everlore",
    icon: Linkedin,
  },
  { name: "Facebook", href: "https://facebook.com/everlore", icon: Facebook },
  {
    name: "Instagram",
    href: "https://instagram.com/everlore",
    icon: Instagram,
  },
];

export default function AcademyFooter() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription submitted");
    // TODO: Integrate with email service
  };

  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Explore</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-academy-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-academy-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-academy-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-academy-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand Info */}
            <div>
              <h2 className="mb-2 text-xl font-bold text-academy-accent">
                Everlore
              </h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                Empowering learners worldwide with high-quality courses and
                expert instructors.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-academy-accent hover:text-academy-accent-foreground"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Everlore. All rights reserved. Made
              with ❤️ for learners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
