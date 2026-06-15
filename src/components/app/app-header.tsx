"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Home, Layers, Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/nav";

const navItems: NavItem[] = [
  { label: "Cards", href: "/app/cards" },
  { label: "Deck Builder", href: "/app/deck-builder" },
  { label: "Decks", href: "/app/decks" },
  { label: "My Decks", href: "/app/my-decks" },
];

const navLinkClass =
  "rounded-md px-3 py-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)";

function DesktopNav({ items, className }: { items: NavItem[]; className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("hidden items-center gap-0.5 md:flex", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            navLinkClass,
            pathname.startsWith(item.href) &&
              "bg-(--color-surface-2) font-medium text-(--color-foreground)"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav({ items, className }: { items: NavItem[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)",
                  pathname.startsWith(item.href) &&
                    "bg-(--color-surface-2) font-medium text-(--color-foreground)"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-1 border-t border-(--color-border)" />
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
            >
              <Home className="size-3.5" />
              Home
            </Link>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button type="button" onClick={() => setOpen(false)} className={navLinkClass}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-(--color-primary) px-3 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
                >
                  Get Started
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center justify-between px-3 py-2">
                <UserButton appearance={{ elements: { avatarBox: "size-7" } }} />
              </div>
            </Show>
          </nav>
        </div>
      )}
    </div>
  );
}

export function AppHeader() {
  return (
    <header className="z-40 shrink-0 border-b border-(--color-border)/60 bg-(--color-bg-base)/70 backdrop-blur-md">
      <Container>
        <div className="relative flex h-14 items-center justify-between gap-4">
          <Link
            href="/app/cards"
            className="flex items-center gap-2.5 font-semibold text-(--color-foreground)"
          >
            <Layers className="size-5 text-(--color-primary)" />
            <span className="text-sm">DeckForge</span>
          </Link>

          <DesktopNav items={navItems} className="absolute left-1/2 -translate-x-1/2" />

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={cn(navLinkClass, "hidden items-center gap-1.5 md:inline-flex")}
            >
              <Home className="size-3.5" />
              Home
            </Link>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button type="button" className={cn(navLinkClass, "hidden md:inline-flex")}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="hidden rounded-md bg-(--color-primary) px-3 py-1.5 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover) md:inline-flex"
                >
                  Get Started
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-8",
                  },
                }}
              />
            </Show>
            <MobileNav items={navItems} />
          </div>
        </div>
      </Container>
    </header>
  );
}
