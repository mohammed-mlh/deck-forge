import { and, ilike, or, sql, type SQL } from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";
import { cards } from "@/db/schema/cards";

export function normalizeCardSearchText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function cardNameSearchTokens(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 0);
}

function normalizedColumn(column: AnyColumn) {
  return sql<string>`regexp_replace(lower(${column}), '[^a-z0-9]', '', 'g')`;
}

export function buildFlexibleTextSearchCondition(
  column: AnyColumn,
  value: string
): SQL | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const normalized = normalizeCardSearchText(trimmed);
  const tokens = cardNameSearchTokens(trimmed);
  const normalizedExpr = normalizedColumn(column);

  const flexible: SQL[] = [];

  if (normalized.length > 0) {
    flexible.push(sql`${normalizedExpr} LIKE ${`%${normalized}%`}`);
  }

  if (tokens.length > 1) {
    flexible.push(
      and(...tokens.map((token) => sql`${normalizedExpr} LIKE ${`%${token}%`}`))!
    );
  }

  return or(ilike(column, `%${trimmed}%`), ...flexible);
}

export function buildCardNameSearchCondition(name: string): SQL | undefined {
  return buildFlexibleTextSearchCondition(cards.name, name);
}
