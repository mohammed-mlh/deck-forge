import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { analyzeDeck } from "../src/lib/ai/analyze-deck";
import { buildDeckContext } from "../src/lib/ai/deck-context";
import { getPublicDecks, toSavedDeck } from "../src/features/decks/decks.service";
import type { Deck } from "../src/features/decks/decks.schema";

const MODEL = "deepseek-v4-flash";
const OUT_PATH = resolve(__dirname, "../src/lib/ai/fixtures/deck-analysis.results.json");

async function main() {
  const records = await getPublicDecks();
  if (records.length === 0) {
    throw new Error("No decks in DB.");
  }

  const startedAt = Date.now();
  const results = [];

  for (const record of records.slice(0, 3)) {
    const browse = await toSavedDeck(record);
    const deck: Deck = {
      id: browse.id,
      name: browse.name,
      main: browse.main,
      extra: browse.extra,
      side: browse.side,
    };
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
