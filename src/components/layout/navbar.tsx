import Link from "next/link";
import { Layers } from "lucide-react";
import { Container } from "@/components/layout/container";
import { AuthNavActions } from "@/components/navigation/auth-nav-actions";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { label: "Cards", href: "/cards" },
  { label: "Deck Builder", href: "/deck-builder" },
  { label: "Browse Decks", href: "/browse-decks" },
  { label: "My Decks", href: "/decks" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-(--color-bg-base)/90 backdrop-blur-md">
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-(--color-foreground)">
            <Layers className="size-5 text-(--color-primary)" />
            <span className="text-sm">DeckForge</span>
          </Link>

          <DesktopNav items={navItems} className="absolute left-1/2 -translate-x-1/2" />

          <div className="flex items-center gap-2">
            <AuthNavActions className="hidden items-center gap-2 md:flex" />
            <MobileNav items={navItems} />
          </div>
        </div>
      </Container>
    </header>
  );
}
