import Link from "next/link";
import { Layers } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { label: "Cards", href: "/cards" },
  { label: "Archetypes", href: "/archetypes" },
  { label: "Meta", href: "/meta" },
  { label: "Guides", href: "/guides" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-md">
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-[var(--color-foreground)]">
            <Layers className="size-5 text-[var(--color-primary)]" />
            <span className="text-sm">DeckForge</span>
          </Link>

          <DesktopNav items={navItems} className="absolute left-1/2 -translate-x-1/2" />

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-[var(--radius-md)] px-3 py-1.5 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)] md:block"
            >
              Login
            </Link>
            <Link
              href="/app"
              className="hidden rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)] md:block"
            >
              Get Started
            </Link>
            <MobileNav items={navItems} />
          </div>
        </div>
      </Container>
    </header>
  );
}
