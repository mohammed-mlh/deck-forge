import { buildDeckAnalysisPrompt } from "@/lib/ai/prompts/deck-analysis";
import { buildDeckDoctorPrompt } from "@/lib/ai/prompts/deck-doctor";
import {
  extractJsonFromModelText,
  parseDeckAnalysis,
  parseDeckDoctor,
} from "@/lib/ai/schemas";
import type {
  AiProvider,
  DeckAnalysis,
  DeckContext,
  DeckDoctorResult,
} from "@/lib/ai/types";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

interface DeepSeekChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

async function deepSeekJson<T>(
  apiKey: string,
  system: string,
  user: string,
  parse: (data: unknown) => T
): Promise<T> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      thinking: { type: "disabled" },
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek request failed (${response.status}): ${errorText}`);
  }

  const json = (await response.json()) as DeepSeekChatResponse;
  const content = json.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek returned an empty response");
  }

  return parse(extractJsonFromModelText(content));
}

export class DeepSeekProvider implements AiProvider {
  constructor(private readonly apiKey: string) {}

  async analyzeDeck(context: DeckContext): Promise<DeckAnalysis> {
    return deepSeekJson(
      this.apiKey,
      "You are a Yu-Gi-Oh! deck analyst. Respond with valid JSON only.",
      buildDeckAnalysisPrompt(context),
      parseDeckAnalysis
    );
  }

  async improveDeck(context: DeckContext): Promise<DeckDoctorResult> {
    return deepSeekJson(
      this.apiKey,
      "You are a Yu-Gi-Oh! deck doctor. Respond with valid JSON only.",
      buildDeckDoctorPrompt(context),
      parseDeckDoctor
    );
  }
}
