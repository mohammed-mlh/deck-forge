import type { Deck, DeckCardEntry } from "@/types/deck";
import type { DeckZone } from "@/types/deck";
import type { ImportResult, ParsedCardRef, ParsedDeckList } from "@/types/deck-io";
import { fetchCards, fetchCardsByIds } from "@/lib/ygoprodeck";
import type { YugiohCard } from "@/types/yugioh";

function readZoneEntries(raw: unknown): DeckCardEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const card = (entry as { card?: YugiohCard }).card;
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

async function resolveCardsByName(names: string[]): Promise<Map<string, YugiohCard>> {
  const byName = new Map<string, YugiohCard>();
  const unique = [...new Set(names.map((name) => name.trim()).filter(Boolean))];

  await Promise.all(
    unique.map(async (name) => {
      const cards = await fetchCards({ name });
      const match =
        cards.find((card) => card.name.toLowerCase() === name.toLowerCase()) ?? cards[0];
      if (match) byName.set(name.toLowerCase(), match);
    })
  );

  return byName;
}

function refsToEntries(
  refs: ParsedCardRef[],
  byId: Map<number, YugiohCard>,
  byName: Map<string, YugiohCard>,
  errors: string[],
  zone: DeckZone
): DeckCardEntry[] {
  const entries: DeckCardEntry[] = [];

  for (const ref of refs) {
    let card: YugiohCard | undefined;

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

  const byId = new Map<number, YugiohCard>();
  const fetchedById = await fetchCardsByIds([...idSet]);
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
