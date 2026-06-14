import type { Metadata } from "next";
import { getMostPowerfulMonster, getCardArtUrl } from "@/lib/deck-preview";
import { countZone } from "@/lib/deck-rules";
import type { SavedDeck } from "@/types/deck";

export function buildDeckMetadata(deck: SavedDeck): Metadata {
  const featured = getMostPowerfulMonster(deck);
  const imageUrl = featured ? getCardArtUrl(featured) : undefined;
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);
  const description = `${deck.name} · Main ${main} / Extra ${extra} / Side ${side}`;

  return {
    title: deck.name,
    description,
    openGraph: {
      title: deck.name,
      description,
      type: "website",
      url: `/decks/${deck.id}`,
      siteName: "DeckForge",
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 421,
            height: 614,
            alt: `${deck.name} — ${featured!.name}`,
          },
        ],
      }),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: deck.name,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}
