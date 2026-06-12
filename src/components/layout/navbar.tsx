"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, LogOut, Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { useAuth } from "@/providers/auth-context";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { label: "Cards", href: "/cards" },
  { label: "Deck Builder", href: "/deck-builder" },
  { label: "Decks", href: "/decks" },
  { label: "My Decks", href: "/my-decks" },
];

const navLinkClass =
  "rounded-md px-3 py-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)";

function DesktopNav({ items, className }: { items: NavItem[]; className?: string }) {
  return (
    <nav className={cn("hidden items-center gap-0.5 md:flex", className)}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={navLinkClass}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function AuthNavActions({ className }: { className?: string }) {
  const { user, ready, logout } = useAuth();

  if (!ready) return null;

  if (user) {
    return (
      <div className={className}>
        <span className="hidden text-sm text-(--color-foreground-muted) sm:inline">
          {user.name}
        </span>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Link
        href="/login"
        className="rounded-md px-3 py-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground)"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-md bg-(--color-primary) px-3 py-1.5 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
      >
        Get Started
      </Link>
    </div>
  );
}

function MobileNav({ items, className }: { items: NavItem[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className={cn("relative md:hidden", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-md p-2 text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
        aria-label="Toggle menu"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-(--color-border) bg-(--color-bg-surface) shadow-md">
          <nav className="flex flex-col gap-0.5 p-1.5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-1 border-t border-(--color-border)" />
            {user ? (
              <>
                <p className="px-3 py-1 text-xs text-(--color-foreground-subtle)">
                  Signed in as {user.name}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
                >
                  <LogOut className="size-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className={navLinkClass}>
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-(--color-primary) px-3 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-(--color-bg-base)/90 backdrop-blur-md">
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-(--color-foreground)">
            <Layers className="size-5 text-(--color-primary)" />
            <span className="text-sm">DeckForge</span>
          </Link>

          <DesktopNav items={navItems} className="absolute left-1/2 -translate-x-1/2" />

          <div className="flex items-center gap-2">
            <AuthNavActions className="hidden items-center gap-2 md:flex" />
            <MobileNav items={navItems} />
          </div>
        </div>
      </Container>
    </header>
  );
}
