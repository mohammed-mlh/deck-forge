import type { MetadataRoute } from "next";
import { getFeaturedArchetypeSlugs } from "@/content/seo-archetypes";
import { getPublicDecks } from "@/features/public-decks/public-decks.service";
import { categorySlug } from "@/features/public-decks/public-decks.view";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  const publicDecks = await getPublicDecks();
  const archetypeSlugs = getFeaturedArchetypeSlugs();

  const publicDeckEntries = publicDecks.map((deck) => ({
    url: `${base}/app/decks/${categorySlug(deck.metadata?.category ?? "community")}/${deck.slug}`,
    lastModified: deck.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const archetypeEntries = archetypeSlugs.map((slug) => ({
    url: `${base}/archetypes/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/app/cards`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/app/decks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/archetypes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/import`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...archetypeEntries,
    ...publicDeckEntries,
  ];
}
