import { and, asc, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { archetypes, type ArchetypeRecord } from "@/db/schema/archetypes";
import type { ArchetypeSearchQuery } from "@/features/archetypes/archetypes.schema";
import { slugify } from "@/lib/slug";

export async function findArchetypeById(id: number): Promise<ArchetypeRecord | null> {
  const rows = await db.select().from(archetypes).where(eq(archetypes.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function findArchetypeBySlug(slug: string): Promise<ArchetypeRecord | null> {
  const rows = await db.select().from(archetypes).where(eq(archetypes.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function findArchetypeByName(name: string): Promise<ArchetypeRecord | null> {
  const rows = await db.select().from(archetypes).where(eq(archetypes.name, name)).limit(1);
  return rows[0] ?? null;
}

async function uniqueArchetypeSlug(name: string): Promise<string> {
  const base = slugify(name) || "archetype";
  let slug = base;
  let suffix = 2;

  while (true) {
    const existing = await findArchetypeBySlug(slug);
    if (!existing || existing.name === name) return slug;
    slug = `${base.slice(0, 58)}-${suffix}`;
    suffix++;
  }
}

export async function upsertArchetype(name: string): Promise<ArchetypeRecord> {
  const slug = await uniqueArchetypeSlug(name);
  const rows = await db
    .insert(archetypes)
    .values({ name, slug })
    .onConflictDoUpdate({
      target: archetypes.name,
      set: { slug, syncedAt: new Date() },
    })
    .returning();
  return rows[0]!;
}

export async function searchArchetypes(params: ArchetypeSearchQuery): Promise<ArchetypeRecord[]> {
  const conditions = [];
  if (params.name) {
    conditions.push(ilike(archetypes.name, `%${params.name}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(archetypes)
    .where(where)
    .orderBy(asc(archetypes.name))
    .limit(params.num)
    .offset(params.offset);
}
