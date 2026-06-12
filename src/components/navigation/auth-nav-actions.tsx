"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/providers/auth-context";

export function AuthNavActions({ className }: { className?: string }) {
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
