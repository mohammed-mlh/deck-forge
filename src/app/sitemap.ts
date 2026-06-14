import type { MetadataRoute } from "next";
import { getPublicDecks } from "@/features/decks/decks.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  const publicDecks = await getPublicDecks();

  const publicDeckEntries = publicDecks.map((deck) => ({
    url: `${base}/decks/${deck.id}`,
    lastModified: deck.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/cards`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/decks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...publicDeckEntries,
  ];
}
