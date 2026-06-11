"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Builder", href: "/deck-builder" },
  { label: "My Decks", href: "/decks" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isBuilder = pathname.startsWith("/deck-builder");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-bg-base)]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4">
        <Link
          href="/deck-builder"
          className="flex items-center gap-2.5 font-semibold text-[var(--color-foreground)]"
        >
          <Layers className="size-5 text-[var(--color-primary)]" />
          <span className="text-sm">DeckForge</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[var(--radius-md)] px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-[var(--color-surface-2)] font-medium text-[var(--color-foreground)]"
                    : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main
        className={cn(
          "flex-1 overflow-hidden",
          isBuilder ? "p-0" : "overflow-y-auto p-6"
        )}
      >
        {children}
      </main>
    </div>
  );
}
