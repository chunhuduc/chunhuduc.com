import { Resend } from "resend";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import {
  newsletterDeliveries,
  newsletterPosts,
  newsletterSubscribers,
} from "@/lib/db/schema";
import { getPostBySlug } from "@/lib/posts";
import { getNewsletterConfig } from "./config";
import { buildNewsletterEmail, getNewsletterFromHeader } from "./email-template";

export type PublishResult = {
  sent: number;
  skipped: number;
  failed: number;
};

const SENDABLE_STATUSES = ["pending", "failed"] as const;

export function getPublishBatchSize(): number {
  const raw = Number.parseInt(process.env.NEWSLETTER_PUBLISH_BATCH_SIZE ?? "25", 10);
  if (!Number.isFinite(raw) || raw < 1) return 25;
  return Math.min(raw, 100);
}

export function isNewsletterPublishConfigured(): boolean {
  const { apiKey, unsubscribeSecret } = getNewsletterConfig();
  return Boolean(apiKey && unsubscribeSecret && getNewsletterFromHeader());
}

export async function publishPost(slug: string): Promise<PublishResult> {
  const post = getPostBySlug(slug);
  const db = getDb();
  const now = new Date();
  const summary = post.summary?.trim() ?? "";

  await db
    .insert(newsletterPosts)
    .values({
      slug: post.slug,
      title: post.title,
      summary,
      firstPublishedAt: now,
      lastPublishAt: now,
      publishCount: 1,
    })
    .onConflictDoUpdate({
      target: newsletterPosts.slug,
      set: {
        title: post.title,
        summary,
        lastPublishAt: now,
        publishCount: sql`${newsletterPosts.publishCount} + 1`,
      },
    });

  const subscribers = await db
    .select({
      id: newsletterSubscribers.id,
      email: newsletterSubscribers.email,
    })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.status, "active"));

  if (subscribers.length > 0) {
    await db
      .insert(newsletterDeliveries)
      .values(
        subscribers.map((s) => ({
          postSlug: slug,
          subscriberId: s.id,
          email: s.email,
          status: "pending" as const,
        })),
      )
      .onConflictDoNothing({
        target: [newsletterDeliveries.postSlug, newsletterDeliveries.email],
      });
  }

  const deliveries = await db
    .select({
      id: newsletterDeliveries.id,
      email: newsletterDeliveries.email,
      subscriberId: newsletterDeliveries.subscriberId,
      status: newsletterDeliveries.status,
    })
    .from(newsletterDeliveries)
    .where(eq(newsletterDeliveries.postSlug, slug));

  let skipped = 0;
  const toSend = [];
  for (const row of deliveries) {
    if (SENDABLE_STATUSES.includes(row.status as (typeof SENDABLE_STATUSES)[number])) {
      toSend.push(row);
    } else {
      skipped += 1;
    }
  }

  if (toSend.length === 0) {
    return { sent: 0, skipped, failed: 0 };
  }

  const { apiKey } = getNewsletterConfig();
  const fromHeader = getNewsletterFromHeader();
  if (!apiKey || !fromHeader) {
    throw new Error("Newsletter publish is not configured.");
  }

  const resend = new Resend(apiKey);
  const batchSize = getPublishBatchSize();
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < toSend.length; i += batchSize) {
    const batch = toSend.slice(i, i + batchSize);
    for (const delivery of batch) {
      const content = buildNewsletterEmail({
        slug: post.slug,
        title: post.title,
        summary,
        content: post.content,
        date: post.date,
        subscriberId: delivery.subscriberId,
      });

      const result = await resend.emails.send({
        from: fromHeader,
        to: [delivery.email],
        subject: content.subject,
        html: content.html,
        text: content.text,
        tags: [
          { name: "post_slug", value: slug },
          { name: "delivery_id", value: delivery.id },
        ],
      });

      if (result.error || !result.data?.id) {
        failed += 1;
        const message = result.error?.message ?? "Send failed.";
        await db
          .update(newsletterDeliveries)
          .set({
            status: "failed",
            errorMessage: message,
            updatedAt: now,
          })
          .where(eq(newsletterDeliveries.id, delivery.id));
        continue;
      }

      sent += 1;
      await db
        .update(newsletterDeliveries)
        .set({
          status: "sent",
          resendEmailId: result.data.id,
          errorMessage: null,
          sentAt: now,
          updatedAt: now,
        })
        .where(eq(newsletterDeliveries.id, delivery.id));
    }
  }

  return { sent, skipped, failed };
}

export async function countActiveSubscribers(): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.status, "active"));
  return rows[0]?.count ?? 0;
}

export type DeliveryRow = {
  id: string;
  email: string;
  status: string;
  resendEmailId: string | null;
  errorMessage: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  updatedAt: string;
};

export async function listDeliveriesForPost(slug: string): Promise<DeliveryRow[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: newsletterDeliveries.id,
      email: newsletterDeliveries.email,
      status: newsletterDeliveries.status,
      resendEmailId: newsletterDeliveries.resendEmailId,
      errorMessage: newsletterDeliveries.errorMessage,
      sentAt: newsletterDeliveries.sentAt,
      deliveredAt: newsletterDeliveries.deliveredAt,
      updatedAt: newsletterDeliveries.updatedAt,
    })
    .from(newsletterDeliveries)
    .where(eq(newsletterDeliveries.postSlug, slug));

  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    status: r.status,
    resendEmailId: r.resendEmailId,
    errorMessage: r.errorMessage,
    sentAt: r.sentAt?.toISOString() ?? null,
    deliveredAt: r.deliveredAt?.toISOString() ?? null,
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export type PostStats = {
  delivered: number;
  failed: number;
  pending: number;
  sent: number;
  bounced: number;
  complained: number;
  total: number;
};

export async function getDeliveryStatsBySlug(): Promise<Map<string, PostStats>> {
  const db = getDb();
  const rows = await db
    .select({
      postSlug: newsletterDeliveries.postSlug,
      delivered: sql<number>`count(*) filter (where ${newsletterDeliveries.status} = 'delivered')::int`,
      failed: sql<number>`count(*) filter (where ${newsletterDeliveries.status} = 'failed')::int`,
      pending: sql<number>`count(*) filter (where ${newsletterDeliveries.status} = 'pending')::int`,
      sent: sql<number>`count(*) filter (where ${newsletterDeliveries.status} = 'sent')::int`,
      bounced: sql<number>`count(*) filter (where ${newsletterDeliveries.status} = 'bounced')::int`,
      complained: sql<number>`count(*) filter (where ${newsletterDeliveries.status} = 'complained')::int`,
      total: sql<number>`count(*)::int`,
    })
    .from(newsletterDeliveries)
    .groupBy(newsletterDeliveries.postSlug);

  const map = new Map<string, PostStats>();

  for (const row of rows) {
    map.set(row.postSlug, {
      delivered: Number(row.delivered) || 0,
      failed: Number(row.failed) || 0,
      pending: Number(row.pending) || 0,
      sent: Number(row.sent) || 0,
      bounced: Number(row.bounced) || 0,
      complained: Number(row.complained) || 0,
      total: Number(row.total) || 0,
    });
  }

  return map;
}
