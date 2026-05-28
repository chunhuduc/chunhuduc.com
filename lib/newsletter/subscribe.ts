import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";
import { syncResendContactOptIn } from "./resend-contact";

export async function subscribeToNewsletter(email: string): Promise<
  | { ok: true }
  | { ok: false; error: string; status: 502 }
> {
  const db = getDb();
  const now = new Date();

  const existing = await db
    .select({
      id: newsletterSubscribers.id,
      status: newsletterSubscribers.status,
      resendContactId: newsletterSubscribers.resendContactId,
    })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))
    .limit(1);

  const row = existing[0];
  let subscriberId = row?.id;

  if (!row) {
    const inserted = await db
      .insert(newsletterSubscribers)
      .values({
        email,
        status: "active",
        subscribedAt: now,
      })
      .returning({ id: newsletterSubscribers.id });
    subscriberId = inserted[0]?.id;
    if (!subscriberId) {
      return { ok: false, error: "Could not save subscription.", status: 502 };
    }
  } else if (row.status === "unsubscribed") {
    await db
      .update(newsletterSubscribers)
      .set({
        status: "active",
        subscribedAt: now,
        unsubscribedAt: null,
      })
      .where(eq(newsletterSubscribers.id, row.id));
  }

  const resendSync = await syncResendContactOptIn(email);
  if (!resendSync.ok) {
    return { ok: false, error: resendSync.error, status: 502 };
  }

  if (resendSync.contactId && subscriberId) {
    await db
      .update(newsletterSubscribers)
      .set({ resendContactId: resendSync.contactId })
      .where(eq(newsletterSubscribers.id, subscriberId));
  }

  return { ok: true };
}
