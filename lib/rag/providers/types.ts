import type { EnrichedMetadata } from "../types";

export type LlmProviderApi = {
  name: "gemini" | "openai";
  embed(text: string): Promise<number[]>;
  enrichChunk(originalContent: string, context: { title: string; source: string }): Promise<EnrichedMetadata>;
  chatStream(params: {
    system: string;
    user: string;
    onTextDelta: (delta: string) => void;
  }): Promise<{ text: string; model: string }>;
  suggestGapEntry(question: string): Promise<string>;
};
