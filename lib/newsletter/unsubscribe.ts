import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";
import { syncResendContactOptOut } from "./resend-contact";

export async function unsubscribeNewsletterSubscriber(
  subscriberId: string,
): Promise<
  | { ok: true; already: boolean }
  | { ok: false; error: string; status: 404 | 502 }
> {
  const db = getDb();
  const rows = await db
    .select({
      id: newsletterSubscribers.id,
      email: newsletterSubscribers.email,
      status: newsletterSubscribers.status,
    })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.id, subscriberId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return { ok: false, error: "Subscriber not found.", status: 404 };
  }

  if (row.status === "unsubscribed") {
    return { ok: true, already: true };
  }

  const now = new Date();
  await db
    .update(newsletterSubscribers)
    .set({
      status: "unsubscribed",
      unsubscribedAt: now,
    })
    .where(eq(newsletterSubscribers.id, row.id));

  try {
    await syncResendContactOptOut(row.email);
  } catch (e) {
    console.error("newsletter resend opt-out sync failed", e);
  }

  return { ok: true, already: false };
}
