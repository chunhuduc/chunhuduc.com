import { getSql, toVectorLiteral } from "@/lib/db/client";
import { getEmbedDimensions, getLlmProvider, getRagTopK } from "./config";
import { getProvider } from "./providers";
import type { RetrievedChunk } from "./types";

type DbRow = {
  id: string;
  title: string;
  source: string;
  source_uri: string | null;
  original_content: string;
  enriched_content: string | null;
  similarity: number;
};

export async function embedQuery(question: string): Promise<number[]> {
  const provider = getProvider();
  return provider.embed(question.trim());
}

export async function retrieveSimilarChunks(
  question: string,
  topK = getRagTopK(),
): Promise<RetrievedChunk[]> {
  const embedding = await embedQuery(question);
  const sql = getSql();
  const provider = getLlmProvider();
  const dims = getEmbedDimensions();
  const vector = toVectorLiteral(embedding);

  const rows = await sql<DbRow[]>`
    SELECT
      id,
      title,
      source,
      source_uri,
      original_content,
      enriched_content,
      1 - (embedding <=> ${vector}::vector) AS similarity
    FROM documents
    WHERE status = 'active'
      AND embedding IS NOT NULL
      AND embedding_provider = ${provider}
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${topK}
  `;

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    source: r.source,
    sourceUri: r.source_uri,
    originalContent: r.original_content,
    enrichedContent: r.enriched_content,
    similarity: Number(r.similarity),
  }));
}
