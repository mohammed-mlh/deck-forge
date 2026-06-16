import type { ArchetypeRecord } from "@/db/schema/archetypes";
import type { ArchetypeSearchQuery } from "@/features/archetypes/archetypes.schema";
import {
  findArchetypeById,
  findArchetypeByName,
  findArchetypeBySlug,
  searchArchetypes,
  upsertArchetype,
} from "@/features/archetypes/archetypes.repository";
import { slugify } from "@/lib/slug";

export function archetypeSlugFromName(name: string): string {
  return slugify(name);
}

export async function getArchetypes(
  query: Partial<ArchetypeSearchQuery> = {}
): Promise<ArchetypeRecord[]> {
  return searchArchetypes({
    num: query.num ?? 500,
    offset: query.offset ?? 0,
    name: query.name,
  });
}

export async function getArchetypeById(id: number): Promise<ArchetypeRecord | null> {
  return findArchetypeById(id);
}

export async function getArchetypeBySlug(slug: string): Promise<ArchetypeRecord | null> {
  return findArchetypeBySlug(slug);
}

export async function getArchetypeByName(name: string): Promise<ArchetypeRecord | null> {
  return findArchetypeByName(name);
}

export async function syncArchetype(name: string): Promise<ArchetypeRecord> {
  return upsertArchetype(name);
}
