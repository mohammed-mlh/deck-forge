import Link from "next/link";
import { Layers } from "lucide-react";
import { Container } from "@/components/layout/container";

const footerLinks = {
  Product: [{ label: "Cards", href: "/cards" }],
  Tools: [
    { label: "Deck Builder", href: "/deck-builder" },
    { label: "Browse Decks", href: "/browse-decks" },
    { label: "My Decks", href: "/decks" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 font-semibold text-[var(--color-foreground)]">
                <Layers className="size-5 text-[var(--color-primary)]" />
                <span className="text-sm">DeckForge</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-muted)]">
                The modern platform for competitive Yu-Gi-Oh deck building and analysis.
              </p>
            </div>

            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-foreground-subtle)]">
                  {group}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6 sm:flex-row">
            <p className="text-xs text-[var(--color-foreground-subtle)]">
              © {new Date().getFullYear()} DeckForge. All rights reserved.
            </p>
            <p className="text-xs text-[var(--color-foreground-subtle)]">
              Not affiliated with Konami.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
