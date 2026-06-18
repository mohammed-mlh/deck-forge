import type { MetadataRoute } from "next";
import { getFeaturedArchetypeSlugs } from "@/content/seo-archetypes";
import { getGuideSlugs } from "@/content/seo-guides";
import { getArchetypes } from "@/features/archetypes/archetypes.service";
import { getPublicDecks } from "@/features/public-decks/public-decks.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  const publicDecks = await getPublicDecks();
  const dbArchetypeSlugs = (await getArchetypes()).map((archetype) => archetype.slug);
  const archetypeSlugs = [...new Set([...getFeaturedArchetypeSlugs(), ...dbArchetypeSlugs])];

  const publicDeckEntries = publicDecks.map((deck) => ({
    url: `${base}/decks/${deck.id}`,
    lastModified: deck.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const guideEntries = getGuideSlugs().map((slug) => ({
    url: `${base}/guides/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
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
    {
      url: `${base}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
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
    ...guideEntries,
    ...archetypeEntries,
    ...publicDeckEntries,
  ];
}
