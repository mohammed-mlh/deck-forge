import Link from "next/link";
import { Layers } from "lucide-react";
import { Container } from "@/components/layout/container";

const footerLinks = {
  Product: [
    { label: "Cards", href: "/app/cards" },
    { label: "Archetypes", href: "/archetypes" },
    { label: "Decks", href: "/app/decks" },
  ],
  Tools: [
    { label: "Deck Builder", href: "/app/deck-builder" },
    { label: "Import Formats", href: "/import" },
    { label: "My Decks", href: "/app/my-decks" },
  ],
};

const legalLinks = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-(--color-border)/60 bg-(--color-bg-surface)/50 backdrop-blur-sm">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 font-semibold text-(--color-foreground)">
                <Layers className="size-5 text-(--color-primary)" />
                <span className="text-sm">DeckForge</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-(--color-foreground-muted)">
                The modern platform for competitive Yu-Gi-Oh deck building and analysis.
              </p>
            </div>

            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-(--color-foreground-subtle)">
                  {group}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground)"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-(--color-border) pt-6 sm:flex-row">
            <p className="text-xs text-(--color-foreground-subtle)">
              © {new Date().getFullYear()} DeckForge. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-(--color-foreground-subtle) transition-colors hover:text-(--color-foreground-muted)"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-xs text-(--color-foreground-subtle)">
              Not affiliated with Konami.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
