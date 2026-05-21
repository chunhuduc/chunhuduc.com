import type { ChunkInput } from "./types";

const TARGET_CHARS = 2400;
const OVERLAP_CHARS = 120;

/**
 * Split long documents into overlapping chunks (~600-900 tokens heuristic via char count).
 */
export function chunkText(
  meta: Omit<ChunkInput, "chunkIndex" | "originalContent">,
  text: string,
): ChunkInput[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  if (normalized.length <= TARGET_CHARS) {
    return [
      {
        ...meta,
        chunkIndex: 0,
        originalContent: normalized,
      },
    ];
  }

  const chunks: ChunkInput[] = [];
  let start = 0;
  let index = 0;

  while (start < normalized.length) {
    let end = Math.min(start + TARGET_CHARS, normalized.length);
    if (end < normalized.length) {
      const breakAt = normalized.lastIndexOf("\n\n", end);
      if (breakAt > start + TARGET_CHARS * 0.5) {
        end = breakAt;
      }
    }

    const slice = normalized.slice(start, end).trim();
    if (slice) {
      chunks.push({
        ...meta,
        chunkIndex: index,
        originalContent: slice,
      });
      index += 1;
    }

    if (end >= normalized.length) break;
    start = Math.max(end - OVERLAP_CHARS, start + 1);
  }

  return chunks;
}
