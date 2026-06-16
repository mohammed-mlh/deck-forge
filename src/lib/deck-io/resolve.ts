import type { Deck, DeckCardEntry } from "@/features/decks/decks.schema";
import type { DeckZone } from "@/features/decks/decks.schema";
import type { ImportResult, ParsedCardRef, ParsedDeckList } from "@/lib/deck-io/deck-io.schema";
import type { Card } from "@/features/cards/cards.schema";

function readZoneEntries(raw: unknown): DeckCardEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const card = (entry as { card?: Card }).card;
      const quantity = Number((entry as { quantity?: number }).quantity ?? 0);
      if (!card?.id || !card.name || quantity < 1) return null;
      return { card, quantity };
    })
    .filter((e): e is DeckCardEntry => e !== null);
}

export function tryImportJsonFullDeck(content: string): ImportResult | null {
  try {
    const data = JSON.parse(content) as Partial<Deck>;
    if (!Array.isArray(data.main)) return null;

    const main = readZoneEntries(data.main);
    const extra = readZoneEntries(data.extra);
    const side = readZoneEntries(data.side);

    if (main.length + extra.length + side.length === 0) return null;

    return {
      name: typeof data.name === "string" ? data.name : undefined,
      main,
      extra,
      side,
      errors: [],
      warnings: [],
    };
  } catch {
    return null;
  }
}

async function resolveCardsByName(names: string[]): Promise<Map<string, Card>> {
  const byName = new Map<string, Card>();
  const unique = [...new Set(names.map((name) => name.trim()).filter(Boolean))];

  await Promise.all(
    unique.map(async (name) => {
      const res = await fetch(`/api/cards?${new URLSearchParams({ name }).toString()}`);
      if (!res.ok) {
        if (res.status === 400) return;
        throw new Error(`Failed to fetch cards: ${res.status}`);
      }
      const json = (await res.json()) as { data: Card[] };
      const cards = json.data ?? [];
      const match =
        cards.find((card) => card.name.toLowerCase() === name.toLowerCase()) ?? cards[0];
      if (match) byName.set(name.toLowerCase(), match);
    })
  );

  return byName;
}

function refsToEntries(
  refs: ParsedCardRef[],
  byId: Map<number, Card>,
  byName: Map<string, Card>,
  errors: string[],
  zone: DeckZone
): DeckCardEntry[] {
  const entries: DeckCardEntry[] = [];

  for (const ref of refs) {
    let card: Card | undefined;

    if (ref.id) card = byId.get(ref.id);
    else if (ref.name) card = byName.get(ref.name.toLowerCase());

    if (!card) {
      const label = ref.id ? `ID ${ref.id}` : `"${ref.name}"`;
      errors.push(`Could not resolve ${label} in ${zone} deck`);
      continue;
    }

    const existing = entries.find((e) => e.card.id === card!.id);
    if (existing) existing.quantity += ref.quantity;
    else entries.push({ card, quantity: ref.quantity });
  }

  return entries;
}

export async function resolveParsedDeck(parsed: ParsedDeckList): Promise<ImportResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const idSet = new Set<number>();
  const namesToResolve: string[] = [];

  for (const zone of [parsed.main, parsed.extra, parsed.side]) {
    for (const ref of zone) {
      if (ref.id) idSet.add(ref.id);
      else if (ref.name) namesToResolve.push(ref.name);
    }
  }

  const byId = new Map<number, Card>();
  const res = await fetch("/api/cards/by-ids", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [...idSet] }),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch cards by id: HTTP ${res.status}`);
  }
  const json = (await res.json()) as { data: Card[] };
  const fetchedById = json.data ?? [];
  for (const card of fetchedById) {
    byId.set(card.id, card);
  }

  const byName = await resolveCardsByName(namesToResolve);
  for (const card of fetchedById) {
    const key = card.name.toLowerCase();
    if (!byName.has(key)) byName.set(key, card);
  }

  const main = refsToEntries(parsed.main, byId, byName, errors, "main");
  const extra = refsToEntries(parsed.extra, byId, byName, errors, "extra");
  const side = refsToEntries(parsed.side, byId, byName, errors, "side");

  if (main.length + extra.length + side.length === 0) {
    errors.push("No cards could be imported from this file.");
  }

  if (errors.length > 0 && main.length + extra.length + side.length > 0) {
    warnings.push(`${errors.length} card(s) could not be resolved and were skipped.`);
  }

  return { name: parsed.name, main, extra, side, errors, warnings };
}
