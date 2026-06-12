import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { analyzeDeck } from "../src/lib/ai/analyze-deck";
import { buildDeckContext } from "../src/lib/ai/deck-context";
import { getPublicDeckById } from "../src/lib/decks/public-decks";
import type { Deck } from "../src/types/deck";

const DECK_IDS = [
  "prebuilt-blue-eyes",
  "prebuilt-sky-striker",
  "prebuilt-eldlich",
] as const;

const MODEL = "deepseek-v4-flash";
const OUT_PATH = resolve(__dirname, "../src/lib/ai/fixtures/deck-analysis.results.json");

function toDeck(id: string): Deck {
  const deck = getPublicDeckById(id);
  if (!deck) throw new Error(`Deck not found: ${id}`);

  return {
    id: deck.id,
    name: deck.name,
    main: deck.main,
    extra: deck.extra,
    side: deck.side,
    archetype: deck.archetype,
  };
}

async function main() {
  const startedAt = Date.now();
  const results = [];

  for (const deckId of DECK_IDS) {
    const deck = toDeck(deckId);
    const context = buildDeckContext(deck);
    const deckStartedAt = Date.now();

    const analysis = await analyzeDeck(context);

    results.push({
      deckId: deck.id,
      deckName: deck.name,
      model: MODEL,
      durationMs: Date.now() - deckStartedAt,
      context,
      analysis,
    });
  }

  const output = {
    model: MODEL,
    deckCount: results.length,
    totalDurationMs: Date.now() - startedAt,
    analyzedAt: new Date().toISOString(),
    results,
  };

  writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Saved ${results.length} results to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
