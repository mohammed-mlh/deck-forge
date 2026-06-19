import { FEATURED_ARCHETYPES } from "@/content/seo-archetypes";
import { getArchetypes } from "@/features/archetypes/archetypes.service";
import { getCards, getCoverCardIdsByArchetypes } from "@/features/cards/cards.service";
import { getCardArtUrl } from "@/lib/deck-preview";

export interface ArchetypeListItem {
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | undefined;
  featured: boolean;
}

function croppedArtUrl(cardId: number): string {
  return `https://images.ygoprodeck.com/images/cards_cropped/${cardId}.jpg`;
}

export async function buildArchetypeListItems(): Promise<ArchetypeListItem[]> {
  const records = await getArchetypes({ num: 5000 });
  const featuredBySlug = new Map(FEATURED_ARCHETYPES.map((item) => [item.slug, item]));
  const coverByName = await getCoverCardIdsByArchetypes(records.map((record) => record.name));

  const featuredArt = await Promise.all(
    FEATURED_ARCHETYPES.map(async (item) => {
      const byName = await getCards({ name: item.featuredCardName, num: 1 });
      const card = byName[0] ?? (await getCards({ archetype: item.name, num: 1 }))[0];
      const url = card ? getCardArtUrl(card) : undefined;
      return [item.slug, url] as const;
    })
  );
  const featuredArtMap = new Map(featuredArt);

  return records.map((record) => {
    const featured = featuredBySlug.get(record.slug);
    const cardId = coverByName.get(record.name);
    const imageUrl =
      featuredArtMap.get(record.slug) ??
      (cardId ? croppedArtUrl(cardId) : undefined);

    return {
      slug: record.slug,
      name: record.name,
      description: featured?.description ?? null,
      imageUrl,
      featured: Boolean(featured),
    };
  });
}
