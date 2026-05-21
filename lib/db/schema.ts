import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    source: text("source").notNull(),
    sourceUri: text("source_uri"),
    chunkIndex: integer("chunk_index").notNull().default(0),
    originalContent: text("original_content").notNull(),
    enrichedContent: text("enriched_content"),
    /** Stored via raw SQL on ingest; not mapped in Drizzle selects by default */
    embeddingProvider: text("embedding_provider").notNull().default("openai"),
    contentHash: text("content_hash").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("documents_source_idx").on(t.source),
    index("documents_status_idx").on(t.status),
  ],
);

export const chatLogs = pgTable(
  "chat_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: text("session_id"),
    question: text("question").notNull(),
    answer: text("answer"),
    retrievedChunks: jsonb("retrieved_chunks").$type<RetrievedChunkRef[]>().default([]),
    maxSimilarity: doublePrecision("max_similarity"),
    grounded: boolean("grounded").notNull().default(false),
    model: text("model"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("chat_logs_created_at_idx").on(t.createdAt)],
);

export const knowledgeGaps = pgTable(
  "knowledge_gaps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    question: text("question").notNull(),
    reason: text("reason").notNull(),
    suggestedEntry: text("suggested_entry"),
    status: text("status").notNull().default("pending"),
    chatLogId: uuid("chat_log_id").references(() => chatLogs.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (t) => [index("knowledge_gaps_status_idx").on(t.status)],
);

export type RetrievedChunkRef = {
  document_id: string;
  title: string;
  source: string;
  source_uri: string | null;
  similarity: number;
};

export type DocumentRow = typeof documents.$inferSelect;
export type ChatLogRow = typeof chatLogs.$inferSelect;
export type KnowledgeGapRow = typeof knowledgeGaps.$inferSelect;
