export type LlmProvider = "gemini" | "openai";

export function getLlmProvider(): LlmProvider {
  const p = process.env.LLM_PROVIDER?.trim().toLowerCase();
  return p === "openai" ? "openai" : "gemini";
}

export function getEmbedDimensions(): number {
  if (getLlmProvider() === "openai") {
    return Number(process.env.OPENAI_EMBED_DIMENSIONS ?? 1536);
  }
  return Number(process.env.GEMINI_EMBED_DIMENSIONS ?? 768);
}

export function getRagTopK(): number {
  const n = Number(process.env.RAG_TOP_K ?? 8);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 20) : 8;
}

export function getRagMinSimilarity(): number {
  const n = Number(process.env.RAG_MIN_SIMILARITY ?? 0.72);
  return Number.isFinite(n) ? n : 0.72;
}

export function getGeminiChatModel(): string {
  return process.env.GEMINI_CHAT_MODEL?.trim() || "gemini-2.5-flash";
}

export function getGeminiEmbedModel(): string {
  return process.env.GEMINI_EMBED_MODEL?.trim() || "gemini-embedding-001";
}

export function getOpenaiChatModel(): string {
  return process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";
}

export function getOpenaiEmbedModel(): string {
  return process.env.OPENAI_EMBED_MODEL?.trim() || "text-embedding-3-small";
}
