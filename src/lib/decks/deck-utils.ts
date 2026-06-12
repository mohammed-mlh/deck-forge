import { saveDeck } from "@/lib/decks/deck-storage";
import type { DeckCardEntry, SavedDeck } from "@/types/deck";
import type { PublicDeck } from "@/types/public-deck";
import type { YugiohCard } from "@/types/yugioh";

export type CardDef = [id: number, name: string, type: string, qty: number, atk?: number];

export function card(
  id: number,
  name: string,
  type: string,
  opts: {
    atk?: number;
    def?: number;
    level?: number;
    attribute?: string;
    race?: string;
    frameType?: string;
    archetype?: string;
  } = {}
): YugiohCard {
  const base = `https://images.ygoprodeck.com/images`;
  return {
    id,
    name,
    type,
    desc: "",
    atk: opts.atk,
    def: opts.def,
    level: opts.level,
    attribute: opts.attribute,
    race: opts.race,
    archetype: opts.archetype,
    frameType: opts.frameType ?? "effect",
    card_images: [
      {
        id,
        image_url: `${base}/cards/${id}.jpg`,
        image_url_small: `${base}/cards_small/${id}.jpg`,
        image_url_cropped: `${base}/cards_cropped/${id}.jpg`,
      },
    ],
  };
}

export function entries(defs: CardDef[]): DeckCardEntry[] {
  return defs.map(([id, name, type, qty, atk]) => ({
    card: card(id, name, type, { atk }),
    quantity: qty,
  }));
}

export const staples = {
  ash: [14558127, "Ash Blossom & Joyous Spring", "Tuner Monster", 3, 0] as CardDef,
  veiler: [97268402, "Effect Veiler", "Tuner Monster", 2, 0] as CardDef,
  called: [24224830, "Called by the Grave", "Spell Card", 2] as CardDef,
  imperm: [10045474, "Infinite Impermanence", "Trap Card", 2] as CardDef,
  raigeki: [12538374, "Raigeki", "Spell Card", 1] as CardDef,
  duster: [38505587, "Harpie's Feather Duster", "Spell Card", 1] as CardDef,
  prosperity: [84211599, "Pot of Prosperity", "Spell Card", 1] as CardDef,
  superPoly: [48130397, "Super Polymerization", "Spell Card", 1] as CardDef,
};

function cloneEntries(zone: DeckCardEntry[]): DeckCardEntry[] {
  return zone.map((entry) => ({
    card: structuredClone(entry.card),
    quantity: entry.quantity,
  }));
}

export function clonePublicDeckToSaved(publicDeck: PublicDeck): SavedDeck {
  return saveDeck({
    id: crypto.randomUUID(),
    name: publicDeck.name,
    main: cloneEntries(publicDeck.main),
    extra: cloneEntries(publicDeck.extra),
    side: cloneEntries(publicDeck.side),
  });
}
