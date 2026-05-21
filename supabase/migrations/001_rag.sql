-- Ask Đức AI: pgvector + RAG tables
-- Run in any Postgres host SQL console (Neon recommended on free tier; enable vector extension if needed)

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  source_uri TEXT,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  original_content TEXT NOT NULL,
  enriched_content TEXT,
  embedding vector(768),
  embedding_provider TEXT NOT NULL DEFAULT 'gemini',
  content_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source, chunk_index, content_hash)
);

CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON documents
  USING hnsw (embedding vector_cosine_ops)
  WHERE status = 'active' AND embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS documents_source_idx ON documents (source);
CREATE INDEX IF NOT EXISTS documents_status_idx ON documents (status);

CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  retrieved_chunks JSONB DEFAULT '[]'::jsonb,
  max_similarity DOUBLE PRECISION,
  grounded BOOLEAN NOT NULL DEFAULT false,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_logs_created_at_idx ON chat_logs (created_at DESC);

CREATE TABLE IF NOT EXISTS knowledge_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_entry TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'ingested')),
  chat_log_id UUID REFERENCES chat_logs (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS knowledge_gaps_status_idx ON knowledge_gaps (status);
