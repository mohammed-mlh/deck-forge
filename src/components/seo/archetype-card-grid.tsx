import Image from "next/image";
import Link from "next/link";
import { fetchCards } from "@/lib/ygoprodeck-sdk";
import { getCardImageUrl } from "@/lib/ygoprodeck";
import type { YugiohCard } from "@/types/yugioh";

function cardsHref(archetype: string) {
  return `/cards?archetype=${encodeURIComponent(archetype)}`;
}

export async function ArchetypeCardGrid({
  archetypeName,
  keyCardNames = [],
  limit = 12,
}: {
  archetypeName: string;
  keyCardNames?: string[];
  limit?: number;
}) {
  let cards: YugiohCard[] = [];

  if (keyCardNames.length > 0) {
    const byName = await Promise.all(
      keyCardNames.map((name) => fetchCards({ name, num: 1 }))
    );
    cards = byName.flat();
  }

  if (cards.length < limit) {
    const archetypeCards = await fetchCards({ archetype: archetypeName, num: limit });
    const seen = new Set(cards.map((card) => card.id));
    for (const card of archetypeCards) {
      if (!seen.has(card.id)) {
        cards.push(card);
        seen.add(card.id);
      }
      if (cards.length >= limit) break;
    }
  }

  if (cards.length === 0) {
    return (
      <p className="text-sm text-(--color-foreground-muted)">
        No cards found for this archetype.{" "}
        <Link href={cardsHref(archetypeName)} className="text-(--color-primary) hover:underline">
          Search the database
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {cards.slice(0, limit).map((card) => (
        <Link
          key={card.id}
          href={cardsHref(archetypeName)}
          className="overflow-hidden rounded-sm border border-(--color-border) transition-transform hover:scale-[1.02]"
          title={card.name}
        >
          <Image
            src={getCardImageUrl(card, "small")}
            alt={card.name}
            width={120}
            height={175}
            className="h-auto w-full"
            unoptimized
          />
        </Link>
      ))}
    </div>
  );
}
