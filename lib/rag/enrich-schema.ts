import { z } from "zod";
import type { EnrichedMetadata } from "./types";

/**
 * OpenAI structured outputs require every property key in `required`.
 * Use empty string / empty array when a field does not apply.
 */
export const enrichSchemaStrict = z.object({
  role: z.string(),
  stack: z.array(z.string()),
  concepts: z.array(z.string()),
  domain: z.string(),
  responsibilities: z.array(z.string()),
  keywords: z.array(z.string()),
  likely_questions: z.array(z.string()),
});

export type EnrichSchemaRaw = z.infer<typeof enrichSchemaStrict>;

export const ENRICH_PROMPT_SUFFIX = `For any field that does not apply, use an empty string or empty array (do not omit keys).`;

export function normalizeEnriched(raw: EnrichSchemaRaw): EnrichedMetadata {
  const out: EnrichedMetadata = {};
  const role = raw.role.trim();
  const domain = raw.domain.trim();
  if (role) out.role = role;
  if (domain) out.domain = domain;
  if (raw.stack.length) out.stack = raw.stack;
  if (raw.concepts.length) out.concepts = raw.concepts;
  if (raw.responsibilities.length) out.responsibilities = raw.responsibilities;
  if (raw.keywords.length) out.keywords = raw.keywords;
  if (raw.likely_questions.length) out.likely_questions = raw.likely_questions;
  return out;
}
