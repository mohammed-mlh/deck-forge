"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/auth-context";
import { DUMMY_ACCOUNTS, DEFAULT_DUMMY_ACCOUNT } from "@/lib/dummy-users";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState(DEFAULT_DUMMY_ACCOUNT.email);
  const [password, setPassword] = useState(DEFAULT_DUMMY_ACCOUNT.password);

  const selectAccount = (account: (typeof DUMMY_ACCOUNTS)[number]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    router.push("/deck-builder");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-md border border-dashed border-(--color-border) bg-(--color-bg-elevated) p-3">
        <p className="mb-2 text-xs font-medium text-(--color-foreground-subtle)">
          Quick sign in
        </p>
        <div className="flex flex-col gap-1.5">
          {DUMMY_ACCOUNTS.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => selectAccount(account)}
              className={cn(
                "rounded-md border px-3 py-2 text-left text-xs transition-colors",
                email === account.email
                  ? "border-(--color-primary) bg-(--color-primary-muted) text-(--color-foreground)"
                  : "border-(--color-border) bg-(--color-surface-1) text-(--color-foreground-muted) hover:border-(--color-border-strong)"
              )}
            >
              <span className="font-medium text-(--color-foreground)">{account.name}</span>
              <span className="mt-0.5 block text-(--color-foreground-subtle)">
                {account.email}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-(--color-foreground-muted)">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="h-10 rounded-md border border-(--color-border) bg-(--color-surface-1) px-3 text-sm text-(--color-foreground) outline-none transition-colors focus:border-(--color-border-focus)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-(--color-foreground-muted)">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="h-10 rounded-md border border-(--color-border) bg-(--color-surface-1) px-3 text-sm text-(--color-foreground) outline-none transition-colors focus:border-(--color-border-focus)"
        />
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full">
        Sign in
      </Button>

      <p className="text-center text-xs text-(--color-foreground-subtle)">
        Sign in is stored locally in your browser.
      </p>

      <p className="text-center text-sm text-(--color-foreground-muted)">
        No account?{" "}
        <Link
          href="/register"
          className="font-medium text-(--color-primary) transition-colors hover:text-(--color-primary-hover)"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}
