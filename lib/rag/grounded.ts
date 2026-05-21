import { getRagMinSimilarity } from "./config";
import type { RetrievedChunk } from "./types";

export function maxSimilarity(chunks: RetrievedChunk[]): number {
  if (chunks.length === 0) return 0;
  return Math.max(...chunks.map((c) => c.similarity));
}

export function isGroundedRetrieval(chunks: RetrievedChunk[]): boolean {
  const threshold = getRagMinSimilarity();
  return chunks.some((c) => c.similarity >= threshold);
}

export function looksLikeRefusal(answer: string): boolean {
  const lower = answer.toLowerCase();
  const patterns = [
    "don't have",
    "do not have",
    "not in my",
    "not in the",
    "no information",
    "cannot find",
    "not covered",
    "public portfolio",
  ];
  return patterns.some((p) => lower.includes(p));
}
