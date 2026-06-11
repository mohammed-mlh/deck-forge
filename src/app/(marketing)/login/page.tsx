import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to DeckForge.",
};

export default function LoginPage() {
  return (
    <Container size="sm" className="flex min-h-[calc(100dvh-3.5rem)] items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-[var(--color-foreground)]">
            <Layers className="size-5 text-[var(--color-primary)]" />
            <span className="text-sm">DeckForge</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--color-foreground-muted)]">
            Sign in to access your saved decks.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6">
          <LoginForm />
        </div>
      </div>
    </Container>
  );
}
