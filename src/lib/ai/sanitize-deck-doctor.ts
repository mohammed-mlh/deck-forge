import type { DeckDoctorCardChange, DeckDoctorResult } from "@/lib/ai/types";
import type { Deck, DeckZone } from "@/types/deck";

const ZONES: DeckZone[] = ["main", "extra", "side"];

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

interface CardInventory {
  name: string;
  byZone: Record<DeckZone, number>;
  total: number;
}

function buildInventory(deck: Deck): Map<string, CardInventory> {
  const map = new Map<string, CardInventory>();

  for (const zone of ZONES) {
    for (const entry of deck[zone]) {
      const key = normalizeName(entry.card.name);
      let inv = map.get(key);
      if (!inv) {
        inv = { name: entry.card.name, byZone: { main: 0, extra: 0, side: 0 }, total: 0 };
        map.set(key, inv);
      }
      inv.byZone[zone] += entry.quantity;
      inv.total += entry.quantity;
    }
  }

  return map;
}

function resolveRemove(
  change: DeckDoctorCardChange,
  inventory: Map<string, CardInventory>
): DeckDoctorCardChange | null {
  const inv = inventory.get(normalizeName(change.name));
  if (!inv) return null;

  const available = change.zone ? inv.byZone[change.zone] : inv.total;
  if (available <= 0) return null;

  return {
    name: inv.name,
    quantity: Math.min(change.quantity, available),
    ...(change.zone ? { zone: change.zone } : {}),
  };
}

export function sanitizeDeckDoctorResult(
  result: DeckDoctorResult,
  deck: Deck
): DeckDoctorResult {
  const inventory = buildInventory(deck);

  return {
    ...result,
    remove: result.remove
      .map((change) => resolveRemove(change, inventory))
      .filter((change): change is DeckDoctorCardChange => change !== null),
  };
}
