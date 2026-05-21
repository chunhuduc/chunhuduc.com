import type { ChatSourceCitation, RetrievedChunk } from "./types";

export type { ChatSourceCitation };

export function toCitations(chunks: RetrievedChunk[]): ChatSourceCitation[] {
  return chunks.map((c, i) => ({
    index: i + 1,
    documentId: c.id,
    title: c.title,
    source: c.source,
    sourceUri: c.sourceUri,
    similarity: c.similarity,
  }));
}
