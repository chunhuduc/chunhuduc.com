export type EnrichedMetadata = {
  role?: string;
  stack?: string[];
  concepts?: string[];
  domain?: string;
  responsibilities?: string[];
  keywords?: string[];
  likely_questions?: string[];
};

export type SourceDocument = {
  title: string;
  source: string;
  sourceUri: string | null;
  text: string;
};

export type ChunkInput = {
  title: string;
  source: string;
  sourceUri: string | null;
  chunkIndex: number;
  originalContent: string;
};

export type RetrievedChunk = {
  id: string;
  title: string;
  source: string;
  sourceUri: string | null;
  originalContent: string;
  enrichedContent: string | null;
  similarity: number;
};

export type ChatSourceCitation = {
  index: number;
  documentId: string;
  title: string;
  source: string;
  sourceUri: string | null;
  similarity: number;
};
