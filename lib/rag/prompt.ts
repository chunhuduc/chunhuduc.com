import type { RetrievedChunk } from "./types";

export const PORTFOLIO_SYSTEM_PROMPT = `You are Đức's portfolio assistant. Answer only using the provided context. Never invent experience, employers, projects, or metrics. Be concise, professional, and helpful.

Rules:
- If the context does not contain enough information, say clearly that it is not in the public portfolio materials.
- When stating a fact from context, cite sources using [1], [2], etc. matching the context labels.
- Do not mention internal file paths or private repo names.
- If the user asks about hiring, collaboration, or consulting, suggest contacting Đức via the site contact form or Upwork (as appropriate).
- Prefer English unless the user writes in another language.`;

export function buildContextBlock(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "(No context retrieved.)";

  return chunks
    .map((c, i) => {
      const label = `[${i + 1}] ${c.title} (${c.source})`;
      const body = c.originalContent.trim();
      return `${label}\n${body}`;
    })
    .join("\n\n---\n\n");
}

export function buildUserPrompt(question: string, chunks: RetrievedChunk[]): string {
  return `Context:
---
${buildContextBlock(chunks)}
---

Question: ${question.trim()}`;
}

export const NO_CONTEXT_MESSAGE =
  "I don't have that in my public portfolio materials. For hiring or project questions, please contact Đức directly via the site contact form or Upwork profile.";
