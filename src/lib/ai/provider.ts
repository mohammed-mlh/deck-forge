import { DeepSeekProvider } from "./providers/deepseek";
import { MockAiProvider } from "./providers/mock";
import type { AiProvider } from "@/lib/ai/types";

export type { AiProvider } from "@/lib/ai/types";

export function getAiProvider(): AiProvider {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (apiKey) return new DeepSeekProvider(apiKey);
  return new MockAiProvider(); // Fallback to mock provider if API key is not set
}
