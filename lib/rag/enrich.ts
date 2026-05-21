import type { EnrichedMetadata } from "./types";

export function enrichedToEmbedText(
  original: string,
  enriched: EnrichedMetadata | null,
): string {
  if (!enriched) return original;

  const parts: string[] = [original, ""];
  if (enriched.role) parts.push(`Role: ${enriched.role}`);
  if (enriched.domain) parts.push(`Domain: ${enriched.domain}`);
  if (enriched.stack?.length) parts.push(`Stack: ${enriched.stack.join(", ")}`);
  if (enriched.concepts?.length) parts.push(`Concepts: ${enriched.concepts.join(", ")}`);
  if (enriched.responsibilities?.length) {
    parts.push(`Responsibilities: ${enriched.responsibilities.join("; ")}`);
  }
  if (enriched.keywords?.length) parts.push(`Keywords: ${enriched.keywords.join(", ")}`);
  if (enriched.likely_questions?.length) {
    parts.push(`Likely questions: ${enriched.likely_questions.join(" | ")}`);
  }

  return parts.join("\n");
}

export function serializeEnriched(enriched: EnrichedMetadata): string {
  return JSON.stringify(enriched);
}
