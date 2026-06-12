import { buildDeckAnalysisPrompt } from "@/lib/ai/prompts/deck-analysis";
import { extractJsonFromModelText, parseDeckAnalysis } from "@/lib/ai/schemas";
import type { AiProvider, DeckAnalysis, DeckContext } from "@/lib/ai/types";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

interface DeepSeekChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

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
          {
            role: "system",
            content: "You are a Yu-Gi-Oh! deck analyst. Respond with valid JSON only.",
          },
          { role: "user", content: prompt },
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

    const parsed = extractJsonFromModelText(content);
    return parseDeckAnalysis(parsed);
  }
}
