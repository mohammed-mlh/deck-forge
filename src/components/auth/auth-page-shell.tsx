import Link from "next/link";
import { Layers } from "lucide-react";
import { Container } from "@/components/layout/container";

interface AuthPageShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return (
    <Container size="sm" className="flex min-h-[calc(100dvh-3.5rem)] items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-(--color-foreground)"
          >
            <Layers className="size-5 text-(--color-primary)" />
            <span className="text-sm">DeckForge</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-(--color-foreground)">
            {title}
          </h1>
          <p className="text-sm text-(--color-foreground-muted)">{description}</p>
        </div>

        <div className="rounded-lg border border-(--color-border) bg-(--color-surface-1) p-6">
          {children}
        </div>
      </div>
    </Container>
  );
}
