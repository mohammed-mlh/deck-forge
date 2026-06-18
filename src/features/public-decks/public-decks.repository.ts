import { and, asc, desc, eq, ilike, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { publicDecks, type PublicDeckRecord } from "@/db/schema/public-decks";
import type { PublicDeckSort } from "@/features/public-decks/public-decks.view";

const viewsExpr = sql<number>`(${publicDecks.metadata} ->> 'views')::numeric`;
const priceExpr = sql<number>`(${publicDecks.metadata} ->> 'price')::numeric`;
const categoryExpr = sql<string>`${publicDecks.metadata} ->> 'category'`;
const coverExpr = sql<number>`(${publicDecks.metadata} ->> 'coverCard')::int`;

export interface PublicDeckQuery {
  query?: string;
  category?: string;
  sort?: PublicDeckSort;
  page?: number;
  pageSize?: number;
}

export interface PublicDeckPage {
  items: PublicDeckRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface PublicDeckCategoryRow {
  category: string;
  count: number;
  coverCard: number;
}

function buildWhere(options: PublicDeckQuery): SQL | undefined {
  const conditions: SQL[] = [eq(publicDecks.status, "published")];
  const query = options.query?.trim();
  if (query) conditions.push(ilike(publicDecks.name, `%${query}%`));
  const category = options.category?.trim();
  if (category) conditions.push(eq(categoryExpr, category));
  return and(...conditions);
}

function buildOrderBy(sort: PublicDeckSort | undefined): SQL[] {
  switch (sort) {
    case "name":
      return [asc(publicDecks.name)];
    case "priceLow":
      return [asc(priceExpr)];
    case "priceHigh":
      return [desc(priceExpr)];
    default:
      return [desc(viewsExpr)];
  }
}

export async function findPublicDecks(): Promise<PublicDeckRecord[]> {
  return db
    .select()
    .from(publicDecks)
    .where(eq(publicDecks.status, "published"))
    .orderBy(desc(publicDecks.updatedAt));
}

export async function findPublicDecksPage(options: PublicDeckQuery = {}): Promise<PublicDeckPage> {
  const page = Math.max(1, Math.trunc(options.page ?? 1));
  const pageSize = Math.min(60, Math.max(1, Math.trunc(options.pageSize ?? 12)));
  const where = buildWhere(options);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(publicDecks)
    .where(where);

  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount);

  const items = await db
    .select()
    .from(publicDecks)
    .where(where)
    .orderBy(...buildOrderBy(options.sort))
    .limit(pageSize)
    .offset((current - 1) * pageSize);

  return { items, total, page: current, pageSize, pageCount };
}

export async function findPublicDeckCategories(): Promise<PublicDeckCategoryRow[]> {
  const rows = await db
    .select({
      category: categoryExpr,
      count: sql<number>`count(*)::int`,
      coverCard: sql<number>`(array_agg(${coverExpr} order by ${viewsExpr} desc))[1]`,
    })
    .from(publicDecks)
    .where(eq(publicDecks.status, "published"))
    .groupBy(categoryExpr)
    .orderBy(desc(sql`count(*)`));

  return rows.map((row) => ({
    category: row.category ?? "Community",
    count: row.count ?? 0,
    coverCard: Number(row.coverCard) || 0,
  }));
}

export async function findPublicDeckById(id: string): Promise<PublicDeckRecord | null> {
  const rows = await db
    .select()
    .from(publicDecks)
    .where(and(eq(publicDecks.id, id), eq(publicDecks.status, "published")))
    .limit(1);
  return rows[0] ?? null;
}

export async function findPublicDeckBySlug(slug: string): Promise<PublicDeckRecord | null> {
  const rows = await db
    .select()
    .from(publicDecks)
    .where(and(eq(publicDecks.slug, slug), eq(publicDecks.status, "published")))
    .limit(1);
  return rows[0] ?? null;
}
