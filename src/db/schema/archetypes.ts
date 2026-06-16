import { integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const archetypes = pgTable(
  "archetypes",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("archetypes_name_idx").on(table.name),
    uniqueIndex("archetypes_slug_idx").on(table.slug),
  ]
);

export type ArchetypeRecord = typeof archetypes.$inferSelect;
export type NewArchetypeRecord = typeof archetypes.$inferInsert;
