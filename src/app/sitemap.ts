import type { MetadataRoute } from "next";
import { getPublicDecks } from "@/lib/decks/public-decks";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  const publicDeckEntries = getPublicDecks().map((deck) => ({
    url: `${base}/decks/${deck.slug}`,
    lastModified: new Date(deck.updatedAt),
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
    {
      url: `${base}/my-decks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
