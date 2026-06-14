import { fetchArchetypes } from "@/lib/ygoprodeck-sdk";
import { slugify } from "@/lib/slug";
import {
  buildGenericArchetype,
  getFeaturedArchetype,
  type SeoArchetype,
} from "@/content/seo-archetypes";

export async function resolveArchetype(slug: string): Promise<SeoArchetype | null> {
  const featured = getFeaturedArchetype(slug);
  if (featured) return featured;

  const all = await fetchArchetypes();
  const name = all.find((archetype) => slugify(archetype) === slug);
  if (!name) return null;

  return buildGenericArchetype(name);
}

export async function resolveArchetypeSlugs(): Promise<string[]> {
  const all = await fetchArchetypes();
  return all.map((name) => slugify(name));
}
