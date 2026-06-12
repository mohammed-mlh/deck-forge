import {
  canAddCardToZone,
  getDefaultZoneForCard,
} from "@/lib/deck-rules";
import { sanitizeDeckDoctorResult } from "@/lib/ai/sanitize-deck-doctor";
import { fetchCards } from "@/lib/ygoprodeck";
import type { DeckDoctorResult, DeckZoneHint } from "@/lib/ai/types";
import type { Deck, DeckCardEntry, DeckZone } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

const ZONES: DeckZone[] = ["main", "extra", "side"];

export interface ApplyDeckDoctorResult {
  deck: Deck;
  warnings: string[];
  errors: string[];
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function upsertEntry(entries: DeckCardEntry[], card: YugiohCard): DeckCardEntry[] {
  const existing = entries.find((e) => e.card.id === card.id);
  if (existing) {
    return entries.map((e) =>
      e.card.id === card.id ? { ...e, quantity: e.quantity + 1 } : e
    );
  }
  return [...entries, { card, quantity: 1 }];
}

function removeOneEntry(entries: DeckCardEntry[], cardId: number): DeckCardEntry[] {
  return entries
    .map((e) => (e.card.id === cardId ? { ...e, quantity: e.quantity - 1 } : e))
    .filter((e) => e.quantity > 0);
}

function findEntry(
  deck: Deck,
  name: string,
  zoneHint?: DeckZoneHint
): { zone: DeckZone; entry: DeckCardEntry } | null {
  const zones = zoneHint ? [zoneHint] : ZONES;
  const key = normalizeName(name);

  for (const zone of zones) {
    const entry = deck[zone].find((e) => normalizeName(e.card.name) === key);
    if (entry) return { zone, entry };
  }

  return null;
}

function removeCopies(
  deck: Deck,
  name: string,
  quantity: number,
  zoneHint?: DeckZoneHint
): { deck: Deck; removed: number } {
  let current = deck;
  let removed = 0;

  for (let i = 0; i < quantity; i++) {
    const match = findEntry(current, name, zoneHint);
    if (!match) break;

    current = {
      ...current,
      [match.zone]: removeOneEntry(current[match.zone], match.entry.card.id),
    };
    removed++;
  }

  return { deck: current, removed };
}

function addCopies(
  deck: Deck,
  card: YugiohCard,
  quantity: number,
  zoneHint?: DeckZoneHint
): { deck: Deck; added: number; errors: string[] } {
  let current = deck;
  let added = 0;
  const errors: string[] = [];

  for (let i = 0; i < quantity; i++) {
    const zone = zoneHint ?? getDefaultZoneForCard(card);
    const check = canAddCardToZone(current, card, zone);

    if (!check.ok) {
      errors.push(`${card.name}: ${check.reason ?? "Cannot add to deck"}`);
      break;
    }

    current = {
      ...current,
      [zone]: upsertEntry(current[zone], card),
    };
    added++;
  }

  return { deck: current, added, errors };
}

async function resolveCardByName(name: string): Promise<YugiohCard | null> {
  const results = await fetchCards({ name });
  const key = normalizeName(name);
  return results.find((card) => normalizeName(card.name) === key) ?? results[0] ?? null;
}

export async function applyDeckDoctor(
  deck: Deck,
  suggestion: DeckDoctorResult
): Promise<ApplyDeckDoctorResult> {
  const warnings: string[] = [];
  const errors: string[] = [];
  let current = deck;

  if (suggestion.remove.length === 0 && suggestion.add.length === 0) {
    return { deck: current, warnings, errors: ["No changes to apply"] };
  }

  const { remove, add } = sanitizeDeckDoctorResult(suggestion, deck);

  for (const change of remove) {
    const { deck: next, removed } = removeCopies(
      current,
      change.name,
      change.quantity,
      change.zone
    );

    if (removed === 0) {
      errors.push(`Could not remove ${change.name} — not found in deck`);
    } else if (removed < change.quantity) {
      warnings.push(`Removed ${removed}/${change.quantity} copies of ${change.name}`);
    } else {
      warnings.push(`Removed ${removed}x ${change.name}`);
    }

    current = next;
  }

  const uniqueAddNames = [...new Set(add.map((change) => change.name))];
  const resolved = new Map<string, YugiohCard | null>();

  await Promise.all(
    uniqueAddNames.map(async (name) => {
      resolved.set(name, await resolveCardByName(name));
    })
  );

  for (const change of add) {
    const card = resolved.get(change.name);

    if (!card) {
      errors.push(`Could not find card to add: ${change.name}`);
      continue;
    }

    const { deck: next, added, errors: addErrors } = addCopies(
      current,
      card,
      change.quantity,
      change.zone
    );

    current = next;
    errors.push(...addErrors);

    if (added === 0 && addErrors.length === 0) {
      errors.push(`Could not add ${change.name}`);
    } else if (added < change.quantity) {
      warnings.push(`Added ${added}/${change.quantity} copies of ${change.name}`);
    } else if (added > 0) {
      warnings.push(`Added ${added}x ${change.name}`);
    }
  }

  return { deck: current, warnings, errors };
}
