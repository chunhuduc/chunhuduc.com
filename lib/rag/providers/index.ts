import { getLlmProvider } from "../config";
import { geminiProvider } from "./gemini";
import { openaiProvider } from "./openai";
import type { LlmProviderApi } from "./types";

export function getProvider(): LlmProviderApi {
  return getLlmProvider() === "openai" ? openaiProvider : geminiProvider;
}

export type { LlmProviderApi };
