import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your DeckForge account.",
};

export default function RegisterPage() {
  return (
    <Container size="sm" className="flex min-h-[calc(100dvh-3.5rem)] items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-[var(--color-foreground)]">
            <Layers className="size-5 text-[var(--color-primary)]" />
            <span className="text-sm">DeckForge</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            Create your account
          </h1>
          <p className="text-sm text-[var(--color-foreground-muted)]">
            Start building and saving decks for free.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6">
          <RegisterForm />
        </div>
      </div>
    </Container>
  );
}
