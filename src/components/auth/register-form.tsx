"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/auth-context";
import { DEFAULT_DUMMY_ACCOUNT } from "@/lib/dummy-users";
import { PrimaryButton } from "@/components/ui/primary-button";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email || DEFAULT_DUMMY_ACCOUNT.email);
    router.push("/deck-builder");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-email" className="text-sm font-medium text-[var(--color-foreground-muted)]">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          className="h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 text-sm text-[var(--color-foreground)] outline-none transition-colors placeholder:text-[var(--color-foreground-disabled)] focus:border-[var(--color-border-focus)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-password" className="text-sm font-medium text-[var(--color-foreground-muted)]">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 text-sm text-[var(--color-foreground)] outline-none transition-colors focus:border-[var(--color-border-focus)]"
        />
      </div>

      <PrimaryButton type="submit" size="lg" className="mt-1 w-full">
        Create account
      </PrimaryButton>

      <p className="text-center text-xs text-[var(--color-foreground-subtle)]">
        Demo register — creates a local session instantly.
      </p>

      <p className="text-center text-sm text-[var(--color-foreground-muted)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
