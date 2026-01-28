"use client";

import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </SessionProvider>
  );
}
