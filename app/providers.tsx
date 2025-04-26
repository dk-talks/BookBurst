// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { CookiesProvider } from "react-cookie";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CookiesProvider>
      <SessionProvider>{children}</SessionProvider>
    </CookiesProvider>
  );
}