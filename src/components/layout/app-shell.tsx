"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, LogOut } from "lucide-react";
import { useAuth } from "@/providers/auth-context";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Builder", href: "/deck-builder" },
  { label: "Browse", href: "/browse-decks" },
  { label: "My Decks", href: "/decks" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
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

        <div className="flex items-center gap-3">
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
          {user && (
            <div className="flex items-center gap-2 border-l border-[var(--color-border)] pl-3">
              <span className="text-xs text-[var(--color-foreground-muted)]">{user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1 rounded-[var(--radius-md)] px-2 py-1 text-xs text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
              >
                <LogOut className="size-3" />
                Logout
              </button>
            </div>
          )}
        </div>
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
