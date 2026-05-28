import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
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

export const liveConversations = pgTable(
  "live_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    visitorToken: text("visitor_token").notNull(),
    visitorName: text("visitor_name"),
    visitorEmail: text("visitor_email"),
    pageUrl: text("page_url"),
    status: text("status").notNull().default("open"),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
    ownerLastReadAt: timestamp("owner_last_read_at", { withTimezone: true }),
    lastNotifyAt: timestamp("last_notify_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("live_conversations_status_last_msg_idx").on(t.status, t.lastMessageAt)],
);

export const liveMessages = pgTable(
  "live_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => liveConversations.id, { onDelete: "cascade" }),
    sender: text("sender").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("live_messages_conversation_created_idx").on(t.conversationId, t.createdAt)],
);

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    status: text("status").notNull().default("active"),
    resendContactId: text("resend_contact_id"),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true }).notNull().defaultNow(),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  },
  (t) => [index("newsletter_subscribers_status_idx").on(t.status)],
);

export const newsletterPosts = pgTable("newsletter_posts", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  firstPublishedAt: timestamp("first_published_at", { withTimezone: true }),
  lastPublishAt: timestamp("last_publish_at", { withTimezone: true }),
  publishCount: integer("publish_count").notNull().default(0),
});

export const newsletterDeliveries = pgTable(
  "newsletter_deliveries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postSlug: text("post_slug")
      .notNull()
      .references(() => newsletterPosts.slug, { onDelete: "cascade" }),
    subscriberId: uuid("subscriber_id")
      .notNull()
      .references(() => newsletterSubscribers.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    status: text("status").notNull().default("pending"),
    resendEmailId: text("resend_email_id"),
    errorMessage: text("error_message"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("newsletter_deliveries_post_email_uidx").on(t.postSlug, t.email),
    index("newsletter_deliveries_post_status_idx").on(t.postSlug, t.status),
    index("newsletter_deliveries_subscriber_idx").on(t.subscriberId),
    index("newsletter_deliveries_resend_email_id_idx").on(t.resendEmailId),
  ],
);

export type NewsletterSubscriberStatus = "active" | "unsubscribed";
export type NewsletterDeliveryStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "failed"
  | "bounced"
  | "complained"
  | "skipped_unsubscribed";

export type DocumentRow = typeof documents.$inferSelect;
export type ChatLogRow = typeof chatLogs.$inferSelect;
export type KnowledgeGapRow = typeof knowledgeGaps.$inferSelect;
export type LiveConversationRow = typeof liveConversations.$inferSelect;
export type LiveMessageRow = typeof liveMessages.$inferSelect;
export type NewsletterSubscriberRow = typeof newsletterSubscribers.$inferSelect;
export type NewsletterPostRow = typeof newsletterPosts.$inferSelect;
export type NewsletterDeliveryRow = typeof newsletterDeliveries.$inferSelect;
