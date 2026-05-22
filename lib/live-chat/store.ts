import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { liveConversations, liveMessages } from "@/lib/db/schema";
import type { LiveChatConversationDto, LiveChatMessageDto, LiveChatSender } from "./types";

export async function createConversation(params: {
  pageUrl?: string | null;
  visitorName?: string | null;
  visitorEmail?: string | null;
}): Promise<{ conversationId: string; visitorToken: string }> {
  const db = getDb();
  const visitorToken = randomUUID();
  const rows = await db
    .insert(liveConversations)
    .values({
      visitorToken,
      pageUrl: params.pageUrl ?? null,
      visitorName: params.visitorName ?? null,
      visitorEmail: params.visitorEmail ?? null,
    })
    .returning({ id: liveConversations.id });

  const id = rows[0]?.id;
  if (!id) throw new Error("Failed to create conversation.");
  return { conversationId: id, visitorToken };
}

export async function verifyVisitorAccess(
  conversationId: string,
  visitorToken: string,
): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .select({ id: liveConversations.id })
    .from(liveConversations)
    .where(eq(liveConversations.id, conversationId))
    .limit(1);

  const row = rows[0];
  if (!row) return false;

  const tokenRows = await db
    .select({ visitorToken: liveConversations.visitorToken })
    .from(liveConversations)
    .where(eq(liveConversations.id, conversationId))
    .limit(1);

  return tokenRows[0]?.visitorToken === visitorToken;
}

export async function updateConversationVisitor(
  conversationId: string,
  visitorToken: string,
  patch: { visitorName?: string | null; visitorEmail?: string | null },
): Promise<boolean> {
  if (!(await verifyVisitorAccess(conversationId, visitorToken))) return false;
  const db = getDb();
  const set: Partial<typeof liveConversations.$inferInsert> = {};
  if (patch.visitorName !== undefined) set.visitorName = patch.visitorName;
  if (patch.visitorEmail !== undefined) set.visitorEmail = patch.visitorEmail;
  if (Object.keys(set).length === 0) return true;
  await db.update(liveConversations).set(set).where(eq(liveConversations.id, conversationId));
  return true;
}

export async function insertMessage(params: {
  conversationId: string;
  sender: LiveChatSender;
  body: string;
}): Promise<LiveChatMessageDto> {
  const db = getDb();
  const now = new Date();
  const rows = await db
    .insert(liveMessages)
    .values({
      conversationId: params.conversationId,
      sender: params.sender,
      body: params.body,
    })
    .returning({
      id: liveMessages.id,
      sender: liveMessages.sender,
      body: liveMessages.body,
      createdAt: liveMessages.createdAt,
    });

  const row = rows[0];
  if (!row) throw new Error("Failed to insert message.");

  await db
    .update(liveConversations)
    .set({ lastMessageAt: now })
    .where(eq(liveConversations.id, params.conversationId));

  return {
    id: row.id,
    sender: row.sender as LiveChatSender,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listMessages(
  conversationId: string,
): Promise<LiveChatMessageDto[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: liveMessages.id,
      sender: liveMessages.sender,
      body: liveMessages.body,
      createdAt: liveMessages.createdAt,
    })
    .from(liveMessages)
    .where(eq(liveMessages.conversationId, conversationId))
    .orderBy(liveMessages.createdAt);

  return rows.map((r) => ({
    id: r.id,
    sender: r.sender as LiveChatSender,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function listConversationsForAdmin(): Promise<LiveChatConversationDto[]> {
  const db = getDb();
  const convs = await db
    .select()
    .from(liveConversations)
    .where(eq(liveConversations.status, "open"))
    .orderBy(desc(liveConversations.lastMessageAt));

  const result: LiveChatConversationDto[] = [];
  for (const c of convs) {
    const lastMsg = await db
      .select({ body: liveMessages.body })
      .from(liveMessages)
      .where(eq(liveMessages.conversationId, c.id))
      .orderBy(desc(liveMessages.createdAt))
      .limit(1);

    const lastMessageAt = c.lastMessageAt.toISOString();
    const ownerRead = c.ownerLastReadAt?.getTime() ?? 0;
    const lastMsgTime = c.lastMessageAt.getTime();

    result.push({
      id: c.id,
      visitorName: c.visitorName,
      visitorEmail: c.visitorEmail,
      pageUrl: c.pageUrl,
      status: c.status,
      lastMessageAt,
      ownerLastReadAt: c.ownerLastReadAt?.toISOString() ?? null,
      lastPreview: lastMsg[0]?.body?.slice(0, 120) ?? null,
      unread: lastMsgTime > ownerRead,
    });
  }

  return result;
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const db = getDb();
  await db
    .update(liveConversations)
    .set({ ownerLastReadAt: new Date() })
    .where(eq(liveConversations.id, conversationId));
}

export async function getConversationForNotify(conversationId: string) {
  const db = getDb();
  const rows = await db
    .select({
      id: liveConversations.id,
      visitorName: liveConversations.visitorName,
      visitorEmail: liveConversations.visitorEmail,
      pageUrl: liveConversations.pageUrl,
      lastNotifyAt: liveConversations.lastNotifyAt,
    })
    .from(liveConversations)
    .where(eq(liveConversations.id, conversationId))
    .limit(1);

  return rows[0] ?? null;
}

export async function setLastNotifyAt(conversationId: string): Promise<void> {
  const db = getDb();
  await db
    .update(liveConversations)
    .set({ lastNotifyAt: new Date() })
    .where(eq(liveConversations.id, conversationId));
}
