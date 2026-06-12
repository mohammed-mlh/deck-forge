# AI Provider Pattern

DeckForge's AI layer uses a **Strategy + Factory + Adapter** pattern — one of the most common ways to integrate LLMs (or any swappable backend) into application code.

## Why this pattern is popular

| Problem | How the pattern solves it |
|---|---|
| Multiple backends (OpenAI, DeepSeek, mock, local) | One interface, many implementations |
| Dev without API keys | Swap to mock via factory, no call-site changes |
| Testing | Inject a fake provider into `analyzeDeck()` |
| LLM output is unreliable | Validate at the boundary with Zod before the app uses it |
| Prompt logic mixed with HTTP | Separate prompt builder from transport |

Same idea appears in Vercel AI SDK (`createOpenAI`, `createAnthropic`), LangChain providers, Stripe payment adapters, and database drivers — **program to an interface, pick an implementation at runtime**.

## Architecture

```
Deck / DeckContext
       │
       ▼
 analyze-deck.ts          ← entry point (orchestrator)
       │
       ├── buildDeckContext()   (if input is Deck)
       │
       └── provider.analyzeDeck(context)
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
 MockAiProvider    DeepSeekProvider
 (local rules)     (HTTP + prompt + Zod)
```

**Flow:** normalize input → delegate to strategy → return typed `DeckAnalysis`.

---

## 1. Contract — `types.ts`

Define **what** every provider must do and **what** they exchange. Callers depend on this interface, not on DeepSeek or mock internals.

```ts
export interface DeckContext {
  name: string;
  archetype: DeckArchetype;
  identity: DeckIdentity;
  stats: DeckContextStats;
  typeDistribution: TypeDistribution;
  monsterBreakdown: MonsterBreakdown;
  averageMonsterStats: AverageMonsterStats;
  keyCards: KeyCard[];
  consistencySignals: ConsistencySignals;
  rawCards: RawDeckCard[];
}

export interface DeckAnalysis {
  summary: string;
  strengths: DeckStrength[];
  weaknesses: DeckWeakness[];
  suggestions: DeckSuggestion[];
}

export interface AiProvider {
  analyzeDeck(context: DeckContext): Promise<DeckAnalysis>;
}
```

`DeckContext` is the **input contract** (structured deck facts, no raw API payloads).  
`DeckAnalysis` is the **output contract** (same shape for mock and real AI).  
`AiProvider` is the **strategy interface** — one method, one responsibility.

---

## 2. Factory — `provider.ts`

Selects which strategy to use based on environment. Call sites stay unaware of DeepSeek vs mock.

```ts
import { DeepSeekProvider } from "./providers/deepseek";
import { MockAiProvider } from "./providers/mock";
import type { AiProvider } from "@/lib/ai/types";

export type { AiProvider } from "@/lib/ai/types";

export function getAiProvider(): AiProvider {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (apiKey) return new DeepSeekProvider(apiKey);
  return new MockAiProvider();
}
```

This is a **simple factory**: configuration (`DEEPSEEK_API_KEY`) drives implementation choice. No `if (apiKey)` scattered through the app.

---

## 3. Strategies — `providers/mock.ts` & `providers/deepseek.ts`

Each class **implements** `AiProvider`. Same method signature, different algorithm.

### Mock strategy (deterministic, no network)

Useful for local dev, CI, and fast feedback when the API is down or unpaid.

```ts
export class MockAiProvider implements AiProvider {
  async analyzeDeck(context: DeckContext): Promise<DeckAnalysis> {
    const archetype = context.archetype.name ?? context.identity.archetype ?? "mixed";
    // ... rule-based strengths / weaknesses / suggestions from context signals
    return { summary, strengths, weaknesses, suggestions };
  }
}
```

Mock reads the same `DeckContext` the real model gets, so UI and tests see realistic structure without burning tokens.

### Real strategy (adapter to external API)

`DeepSeekProvider` is an **adapter**: it translates your domain (`DeckContext`) into an HTTP call and back into `DeckAnalysis`.

```ts
export class DeepSeekProvider implements AiProvider {
  constructor(private readonly apiKey: string) {}

  async analyzeDeck(context: DeckContext): Promise<DeckAnalysis> {
    const prompt = buildDeckAnalysisPrompt(context);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: "You are a Yu-Gi-Oh! deck analyst. Respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek request failed (${response.status}): ${await response.text()}`);
    }

    const content = (await response.json()).choices?.[0]?.message?.content;
    const parsed = extractJsonFromModelText(content);
    return parseDeckAnalysis(parsed);
  }
}
```

Transport (fetch), prompting, and validation are **inside** the adapter — not in `analyze-deck.ts`.

---

## 4. Prompt builder — `prompts/deck-analysis.ts`

Keeps prompt text out of the provider class. One place to tune instructions and JSON shape.

```ts
export function buildDeckAnalysisPrompt(context: DeckContext): string {
  const payload = {
    name: context.name,
    archetype: context.archetype,
    identity: context.identity,
    stats: context.stats,
    typeDistribution: context.typeDistribution,
    monsterBreakdown: context.monsterBreakdown,
    averageMonsterStats: context.averageMonsterStats,
    keyCards: context.keyCards,
    consistencySignals: context.consistencySignals,
    rawCards: context.rawCards,
  };

  return `You are a Yu-Gi-Oh! TCG deck analyst. Analyze the deck data below and respond with JSON only.
...
Deck data:
${JSON.stringify(payload, null, 2)}`;
}
```

Pattern: **serialize domain object → append to system instructions**. The model never sees raw `Deck` zones; it sees the curated `DeckContext` payload.

---

## 5. Boundary validation — `schemas.ts`

LLMs can return malformed JSON. Validate at the **adapter exit** before the rest of the app trusts the data.

```ts
export const deckAnalysisSchema = z.object({
  summary: z.string().min(1),
  strengths: z.array(z.object({ title: z.string().min(1), description: z.string().min(1) })),
  weaknesses: z.array(z.object({ title: z.string().min(1), description: z.string().min(1) })),
  suggestions: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      priority: z.enum(["low", "medium", "high"]),
    })
  ),
});

export function parseDeckAnalysis(data: unknown): DeckAnalysis {
  return deckAnalysisSchema.parse(data);
}

export function extractJsonFromModelText(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1].trim() : trimmed);
}
```

`parseDeckAnalysis` is the **trust boundary**: `unknown` in, typed `DeckAnalysis` out. Fenced-code extraction handles models that wrap JSON in markdown.

---

## 6. Orchestrator — `analyze-deck.ts`

Thin entry point: normalize input, inject provider, delegate.

```ts
export async function analyzeDeck(
  input: Deck | DeckContext,
  provider: AiProvider = getAiProvider()
): Promise<DeckAnalysis> {
  const context = "rawCards" in input ? input : buildDeckContext(input);
  return provider.analyzeDeck(context);
}
```

Two important details:

1. **Dependency injection** — `provider` defaults to `getAiProvider()` but can be overridden in tests:
   ```ts
   await analyzeDeck(deck, new MockAiProvider());
   ```
2. **Input polymorphism** — accepts `Deck` or pre-built `DeckContext` so API routes and scripts can skip re-building context.

---

## Pattern map

| File | Role | Pattern name |
|---|---|---|
| `types.ts` | `AiProvider`, `DeckContext`, `DeckAnalysis` | Interface / contract |
| `provider.ts` | `getAiProvider()` | Factory |
| `providers/mock.ts` | `MockAiProvider` | Strategy (dev/test) |
| `providers/deepseek.ts` | `DeepSeekProvider` | Strategy + Adapter |
| `prompts/deck-analysis.ts` | `buildDeckAnalysisPrompt()` | Template / builder |
| `schemas.ts` | `parseDeckAnalysis()` | Boundary validation |
| `analyze-deck.ts` | `analyzeDeck()` | Facade + DI |

---

## Adding a new provider

1. Create `src/lib/ai/providers/openai.ts` implementing `AiProvider`.
2. Reuse `buildDeckAnalysisPrompt` and `parseDeckAnalysis`.
3. Register in `getAiProvider()` (or a new env flag).
4. No changes to `analyze-deck.ts` or UI call sites.

```ts
export class OpenAiProvider implements AiProvider {
  async analyzeDeck(context: DeckContext): Promise<DeckAnalysis> {
    const prompt = buildDeckAnalysisPrompt(context);
    // ... OpenAI-specific fetch
    return parseDeckAnalysis(extractJsonFromModelText(content));
  }
}
```

---

## Usage

```ts
import { analyzeDeck } from "@/lib/ai/analyze-deck";

// Production: uses DeepSeek when DEEPSEEK_API_KEY is set, else mock
const analysis = await analyzeDeck(deck);

// Test: force mock
import { MockAiProvider } from "@/lib/ai/providers/mock";
const mockAnalysis = await analyzeDeck(deck, new MockAiProvider());
```

---

## Related files

- `src/lib/ai/deck-context.ts` — builds `DeckContext` from `Deck`
- `src/lib/ai/fixtures/deck-analysis.results.json` — saved runs (context + analysis)
- `scripts/test-analyze.ts` — re-run fixture generation
