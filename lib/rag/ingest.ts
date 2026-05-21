import { createHash } from "crypto";
import { getSql, toVectorLiteral, isDatabaseConfigured } from "@/lib/db/client";
import { getLlmProvider } from "./config";
import { chunkText } from "./chunk";
import { enrichedToEmbedText, serializeEnriched } from "./enrich";
import { getProvider } from "./providers";
import type { ChunkInput, SourceDocument } from "./types";

function hashChunk(source: string, chunkIndex: number, original: string): string {
  return createHash("sha256")
    .update(`${source}:${chunkIndex}:${original}`)
    .digest("hex");
}

export async function upsertChunk(
  chunk: ChunkInput,
  enrichedJson: string | null,
  embedding: number[],
): Promise<void> {
  const sql = getSql();
  const provider = getLlmProvider();
  const contentHash = hashChunk(chunk.source, chunk.chunkIndex, chunk.originalContent);
  const vector = toVectorLiteral(embedding);

  await sql`
    INSERT INTO documents (
      title, source, source_uri, chunk_index,
      original_content, enriched_content, embedding,
      embedding_provider, content_hash, status, updated_at
    ) VALUES (
      ${chunk.title},
      ${chunk.source},
      ${chunk.sourceUri},
      ${chunk.chunkIndex},
      ${chunk.originalContent},
      ${enrichedJson},
      ${vector}::vector,
      ${provider},
      ${contentHash},
      'active',
      now()
    )
    ON CONFLICT (source, chunk_index, content_hash)
    DO UPDATE SET
      title = EXCLUDED.title,
      source_uri = EXCLUDED.source_uri,
      original_content = EXCLUDED.original_content,
      enriched_content = EXCLUDED.enriched_content,
      embedding = EXCLUDED.embedding,
      embedding_provider = EXCLUDED.embedding_provider,
      status = 'active',
      updated_at = now()
  `;
}

export async function ingestDocuments(
  sources: SourceDocument[],
  options?: { skipEnrich?: boolean; sourceFilter?: string },
): Promise<{ chunks: number; skipped: number }> {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is required for ingest.");
  }

  const provider = getProvider();
  let chunks = 0;
  let skipped = 0;

  for (const doc of sources) {
    if (options?.sourceFilter && !doc.source.includes(options.sourceFilter)) {
      continue;
    }

    const parts = chunkText(
      {
        title: doc.title,
        source: doc.source,
        sourceUri: doc.sourceUri,
      },
      doc.text,
    );

    for (const part of parts) {
      try {
        let enriched = null;
        if (!options?.skipEnrich) {
          enriched = await provider.enrichChunk(part.originalContent, {
            title: part.title,
            source: part.source,
          });
        }

        const embedText = enrichedToEmbedText(
          part.originalContent,
          enriched,
        );
        const embedding = await provider.embed(embedText);
        const enrichedJson = enriched ? serializeEnriched(enriched) : null;

        await upsertChunk(part, enrichedJson, embedding);
        chunks += 1;
        console.log(`  ok ${part.source} #${part.chunkIndex}`);
      } catch (e) {
        skipped += 1;
        console.error(`  fail ${part.source} #${part.chunkIndex}`, e);
      }
    }
  }

  return { chunks, skipped };
}

export async function ingestSingleMarkdown(params: {
  title: string;
  source: string;
  sourceUri: string | null;
  text: string;
}): Promise<number> {
  return (
    await ingestDocuments([
      {
        title: params.title,
        source: params.source,
        sourceUri: params.sourceUri,
        text: params.text,
      },
    ])
  ).chunks;
}
