-- OpenAI text-embedding-3-small uses 1536 dimensions (Gemini was 768).
-- Run once when switching LLM_PROVIDER=openai, then: npm run knowledge:ingest

DROP INDEX IF EXISTS documents_embedding_idx;

ALTER TABLE documents DROP COLUMN IF EXISTS embedding;
ALTER TABLE documents ADD COLUMN embedding vector(1536);

ALTER TABLE documents ALTER COLUMN embedding_provider SET DEFAULT 'openai';

CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON documents
  USING hnsw (embedding vector_cosine_ops)
  WHERE status = 'active' AND embedding IS NOT NULL;
