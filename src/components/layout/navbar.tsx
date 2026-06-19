"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ArrowRight, Layers, Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Cards", href: "/app/cards" },
  { label: "Deck Builder", href: "/app/deck-builder" },
  { label: "Decks", href: "/decks" },
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
  return (
    <div className={className}>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground)"
          >
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className="rounded-md bg-(--color-primary) px-3 py-1.5 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
          >
            Get Started
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Link
          href="/app/cards"
          className="flex items-center gap-1.5 rounded-md bg-(--color-primary) px-3 py-1.5 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
        >
          Go to App
          <ArrowRight className="size-3.5" />
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8",
            },
          }}
        />
      </Show>
    </div>
  );
}

function MobileNav({ items, className }: { items: NavItem[]; className?: string }) {
  const [open, setOpen] = useState(false);

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
              <Link
                href="/app/cards"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-md bg-(--color-primary) px-3 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
              >
                Go to App
                <ArrowRight className="size-3.5" />
              </Link>
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

export function Navbar() {
  return (
    <header className="sticky top-0  z-40 border-b border-(--color-border)/60 bg-(--color-bg-base)/70 backdrop-blur-md">
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-(--color-foreground)">
            <Layers className="size-5 text-(--color-primary)" />
            <span className="text-sm">DeckForge</span>
          </Link>

          <DesktopNav items={navItems} className="absolute left-1/2 -translate-x-1/2" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthNavActions className="hidden items-center gap-2 md:flex" />
            <MobileNav items={navItems} />
          </div>
        </div>
      </Container>
    </header>
  );
}
