import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed, generateObject, generateText, streamText } from "ai";
import { z } from "zod";
import {
  getGeminiChatModel,
  getGeminiEmbedModel,
  getEmbedDimensions,
} from "../config";
import type { EnrichedMetadata } from "../types";
import type { LlmProviderApi } from "./types";

const enrichSchema = z.object({
  role: z.string().optional(),
  stack: z.array(z.string()).optional(),
  concepts: z.array(z.string()).optional(),
  domain: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  likely_questions: z.array(z.string()).optional(),
});

function getGoogle() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }
  return createGoogleGenerativeAI({ apiKey });
}

export const geminiProvider: LlmProviderApi = {
  name: "gemini",

  async embed(text: string): Promise<number[]> {
    const google = getGoogle();
    const dims = getEmbedDimensions();
    const { embedding } = await embed({
      model: google.textEmbeddingModel(getGeminiEmbedModel()),
      value: text,
      providerOptions: {
        google: {
          outputDimensionality: dims,
        },
      },
    });
    return embedding;
  },

  async enrichChunk(
    originalContent: string,
    context: { title: string; source: string },
  ): Promise<EnrichedMetadata> {
    const google = getGoogle();
    const { object } = await generateObject({
      model: google(getGeminiChatModel()),
      schema: enrichSchema,
      prompt: `Extract structured metadata from this portfolio text. Do NOT add facts not present in the source.

Title: ${context.title}
Source: ${context.source}

Source text:
---
${originalContent}
---`,
    });
    return object;
  },

  async chatStream({ system, user, onTextDelta }) {
    const google = getGoogle();
    const modelId = getGeminiChatModel();
    const result = streamText({
      model: google(modelId),
      system,
      prompt: user,
    });

    let text = "";
    for await (const part of result.textStream) {
      text += part;
      onTextDelta(part);
    }

    return { text, model: modelId };
  },

  async suggestGapEntry(question: string): Promise<string> {
    const google = getGoogle();
    const { text } = await generateText({
      model: google(getGeminiChatModel()),
      prompt: `A visitor asked a question not covered by a portfolio knowledge base. Propose ONE short FAQ paragraph the site owner could add (NDA-safe, no invented employers). Mark uncertain parts with [verify].

Question: ${question}`,
    });
    return text.trim();
  },
};
