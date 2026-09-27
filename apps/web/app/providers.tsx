"use client";

import type { ReactNode } from "react";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/context/theme-context";
import { ShopProvider } from "@/context/shop-context";
import { AuthProvider } from "@/hooks/useAuth"

export function AppProviders({
                               children,
                             }: {
  children: ReactNode;
}) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ShopProvider>{children}</ShopProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}