import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass, Layers, User } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getMostPowerfulMonster, getCardArtUrl } from "@/lib/deck-preview";
import { countZone } from "@/lib/deck-rules";
import { getPublicDecks } from "@/lib/decks/public-decks";
import { createPageMetadata } from "@/lib/site-metadata";
import type { PublicDeck } from "@/types/public-deck";

export const metadata: Metadata = createPageMetadata({
  title: "Decks",
  description: "Discover official Yu-Gi-Oh starter decks and copy them into your builder.",
  path: "/decks",
});

const SOURCE_LABELS = {
  official: "Official",
  community: "Community",
  user: "User",
} as const;

function DeckListCard({ deck }: { deck: PublicDeck }) {
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);
  const featured = getMostPowerfulMonster(deck);

  return (
    <Link
      href={`/decks/${deck.slug}`}
      className="group relative flex h-[168px] overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface-1) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-2)"
    >
      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between p-4 pr-2">
        <div className="min-w-0">
          <span className="mb-1 inline-block rounded bg-(--color-primary-muted) px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-(--color-primary)">
            {deck.archetype}
          </span>
          <h3 className="truncate text-lg font-semibold text-(--color-foreground)">{deck.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-(--color-foreground-subtle)">
            <User className="size-3" />
            {deck.author?.name ?? "Unknown"}
          </p>
          <p className="mt-2 text-sm tabular-nums text-(--color-foreground-muted)">
            Main: {main} Extra: {extra} Side: {side}
          </p>
        </div>
      </div>

      <div className="relative h-full w-[44%] shrink-0 sm:w-[40%]">
        {featured ? (
          <>
            <Image
              src={getCardArtUrl(featured)}
              alt={featured.name}
              fill
              sizes="(max-width: 640px) 44vw, 280px"
              className="object-cover object-[center_20%]"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-(--color-surface-1) via-(--color-surface-1)/70 to-transparent transition-colors group-hover:from-(--color-surface-2) group-hover:via-(--color-surface-2)/70" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-(--color-bg-elevated)">
            <Layers className="size-8 text-(--color-foreground-disabled)" />
          </div>
        )}

        <span className="absolute right-3 top-3 rounded bg-(--color-success)/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-(--color-success)">
          {SOURCE_LABELS[deck.source]}
        </span>
      </div>
    </Link>
  );
}

export default function DecksPage() {
  const decks = getPublicDecks();

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Decks"
          description="Discover official and community decks for inspiration before you craft your own."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {decks.map((deck) => (
            <DeckListCard key={deck.id} deck={deck} />
          ))}
        </div>

        <p className="flex items-center justify-center gap-2 text-xs text-(--color-foreground-subtle)">
          <Compass className="size-3.5" />
          {decks.length} public decks available
        </p>
      </div>
    </Container>
  );
}
