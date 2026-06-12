import type { Metadata } from "next";
import { getMostPowerfulMonster, getCardArtUrl } from "@/lib/deck-preview";
import { countZone } from "@/lib/deck-rules";
import type { PublicDeck } from "@/types/public-deck";

export function buildPublicDeckMetadata(deck: PublicDeck): Metadata {
  const featured = getMostPowerfulMonster(deck);
  const imageUrl = featured ? getCardArtUrl(featured) : undefined;
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);
  const author = deck.author?.name ?? "Unknown";
  const description = `${deck.description} · ${deck.archetype} · Main ${main} / Extra ${extra} / Side ${side} · by ${author}`;

  return {
    title: deck.name,
    description,
    openGraph: {
      title: deck.name,
      description,
      type: "website",
      url: `/decks/${deck.slug}`,
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
