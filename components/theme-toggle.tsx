"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons are always rendered so the server and client produce identical
  // markup; the `dark` variant decides which one is visible.
  return (
    <Button
      size="icon"
      variant="ghost"
      className={className}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="w-5 h-5 dark:hidden" />
      <Moon className="w-5 h-5 hidden dark:block" />
    </Button>
  );
}
