"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/providers/auth-context";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface MobileNavProps {
  items: NavItem[];
  className?: string;
}

export function MobileNav({ items, className }: MobileNavProps) {
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
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
                >
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
