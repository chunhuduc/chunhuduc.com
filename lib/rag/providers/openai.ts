import { createOpenAI } from "@ai-sdk/openai";
import { embed, generateObject, generateText, streamText } from "ai";
import {
  ENRICH_PROMPT_SUFFIX,
  enrichSchemaStrict,
  normalizeEnriched,
} from "../enrich-schema";
import {
  getOpenaiChatModel,
  getOpenaiEmbedModel,
} from "../config";
import type { EnrichedMetadata } from "../types";
import type { LlmProviderApi } from "./types";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }
  return createOpenAI({ apiKey });
}

export const openaiProvider: LlmProviderApi = {
  name: "openai",

  async embed(text: string): Promise<number[]> {
    const openai = getOpenAI();
    const { embedding } = await embed({
      model: openai.embedding(getOpenaiEmbedModel()),
      value: text,
    });
    return embedding;
  },

  async enrichChunk(
    originalContent: string,
    context: { title: string; source: string },
  ): Promise<EnrichedMetadata> {
    const openai = getOpenAI();
    const { object } = await generateObject({
      model: openai(getOpenaiChatModel()),
      schema: enrichSchemaStrict,
      prompt: `Extract structured metadata from this portfolio text. Do NOT add facts not present in the source. ${ENRICH_PROMPT_SUFFIX}

Title: ${context.title}
Source: ${context.source}

Source text:
---
${originalContent}
---`,
    });
    return normalizeEnriched(object);
  },

  async chatStream({ system, user, onTextDelta }) {
    const openai = getOpenAI();
    const modelId = getOpenaiChatModel();
    const result = streamText({
      model: openai(modelId),
      system,
      messages: [{ role: "user", content: user }],
    });

    let text = "";
    for await (const part of result.textStream) {
      text += part;
      onTextDelta(part);
    }

    return { text, model: modelId };
  },

  async suggestGapEntry(question: string): Promise<string> {
    const openai = getOpenAI();
    const { text } = await generateText({
      model: openai(getOpenaiChatModel()),
      prompt: `A visitor asked a question not covered by a portfolio knowledge base. Propose ONE short FAQ paragraph the site owner could add (NDA-safe, no invented employers). Mark uncertain parts with [verify].

Question: ${question}`,
    });
    return text.trim();
  },
};
