"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HandWrittenTitle } from "./ui/hand-writing-text";

interface CTAProps {
  badge?: {
    text: string;
  };
  title?: string;
  description?: string;
  action?: {
    text: string;
    href: string;
    variant?:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "ghost"
      | "link";
  };
  withGlow?: boolean;
  className?: string;
}

export function CTASection({
  badge = { text: "GET STARTED TODAY" },
  title = "Transform Your Skills Into Income",
  description = "Join thousands learning practical digital skills and building sustainable income streams with Everlore.",
  action = { text: "Start Your Journey", href: "#" },
  withGlow = true,
  className,
}: CTAProps) {
  return (
    <section
      className={cn("overflow-hidden pt-0 md:py-20 z-1000 relative", className)}
    >
      <div className="relative mx-auto flex max-w-container flex-col items-center px-4 md:px-8 py-8 md:py-24 text-center">
        {/* Glow Effect - Behind content */}
        {withGlow && (
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl md:max-w-4xl h-60 md:h-100 shadow-glow rounded-xl "
            style={{ opacity: 1 }}
          />
        )}

        {/* Badge */}
        {badge && (
          <Badge
            variant="outline"
            className="opacity-0 animate-fade-in-up delay-100 mb-2 md:mb-4 text-xs md:text-sm"
          >
            <span className="text-muted-foreground">{badge.text}</span>
          </Badge>
        )}

        {/* Title with Animation */}
        <h2 className="text-2xl md:text-3xl font-semibold sm:text-4xl md:text-5xl opacity-0 animate-fade-in-up delay-200 mb-2 md:mb-4">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-sm md:text-base text-muted-foreground opacity-0 animate-fade-in-up delay-300 max-w-xl md:max-w-2xl mb-6 md:mb-8">
            {description}
          </p>
        )}

        {/* Action Button */}
        <div className="flex gap-4 items-center justify-center">
          <Button
            variant={action?.variant || "default"}
            size="lg"
            className="opacity-0 animate-fade-in-up delay-500"
            asChild
          >
            <a href={action?.href}>{action?.text}</a>
          </Button>
          <Button
            variant={"outline"}
            size="lg"
            className="opacity-0 animate-fade-in-up delay-500"
            asChild
          >
            <a href={"#features"}>Read the blogs</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
