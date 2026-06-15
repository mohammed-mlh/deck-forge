"use client";

import { AppHeader } from "@/components/app/app-header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-(--color-bg-base)">
      <AppHeader />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
