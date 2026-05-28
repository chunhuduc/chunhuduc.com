import { eq } from "drizzle-orm";
import type { WebhookEventPayload } from "resend";
import { getDb } from "@/lib/db/client";
import { newsletterDeliveries } from "@/lib/db/schema";
import type { NewsletterDeliveryStatus } from "@/lib/db/schema";
import { getEventTag } from "./webhook-tags";

const EMAIL_EVENT_TYPES = new Set([
  "email.sent",
  "email.delivered",
  "email.failed",
  "email.bounced",
  "email.complained",
]);

function isEmailDeliveryEvent(
  event: WebhookEventPayload,
): event is Extract<
  WebhookEventPayload,
  { type: "email.sent" | "email.delivered" | "email.failed" | "email.bounced" | "email.complained" }
> {
  return EMAIL_EVENT_TYPES.has(event.type);
}

function statusForEvent(
  type: Extract<
    WebhookEventPayload,
    { type: "email.sent" | "email.delivered" | "email.failed" | "email.bounced" | "email.complained" }
  >["type"],
): NewsletterDeliveryStatus | null {
  switch (type) {
    case "email.sent":
      return "sent";
    case "email.delivered":
      return "delivered";
    case "email.failed":
      return "failed";
    case "email.bounced":
      return "bounced";
    case "email.complained":
      return "complained";
    default:
      return null;
  }
}

function errorMessageForEvent(
  event: Extract<
    WebhookEventPayload,
    { type: "email.sent" | "email.delivered" | "email.failed" | "email.bounced" | "email.complained" }
  >,
): string | null {
  if (event.type === "email.failed" && "failed" in event.data) {
    return event.data.failed?.reason ?? "Send failed";
  }
  if (event.type === "email.bounced" && "bounce" in event.data) {
    return event.data.bounce?.message ?? "Bounced";
  }
  if (event.type === "email.complained") {
    return "Complaint received";
  }
  return null;
}

export async function applyDeliveryWebhookEvent(event: WebhookEventPayload): Promise<boolean> {
  if (!isEmailDeliveryEvent(event)) {
    return false;
  }

  const nextStatus = statusForEvent(event.type);
  if (!nextStatus) {
    return false;
  }

  const emailId = event.data.email_id;
  const deliveryId = getEventTag(event.data.tags, "delivery_id");

  const db = getDb();
  const now = new Date();
  const errorMessage = errorMessageForEvent(event);

  const rows = deliveryId
    ? await db
        .select({ id: newsletterDeliveries.id, status: newsletterDeliveries.status })
        .from(newsletterDeliveries)
        .where(eq(newsletterDeliveries.id, deliveryId))
        .limit(1)
    : await db
        .select({ id: newsletterDeliveries.id, status: newsletterDeliveries.status })
        .from(newsletterDeliveries)
        .where(eq(newsletterDeliveries.resendEmailId, emailId))
        .limit(1);

  const row = rows[0];
  if (!row) return false;

  if (row.status === "delivered" && nextStatus !== "complained") {
    return true;
  }

  // Do not downgrade delivered/sent when a late email.sent webhook arrives.
  if (
    nextStatus === "sent" &&
    (row.status === "delivered" || row.status === "sent")
  ) {
    return true;
  }

  await db
    .update(newsletterDeliveries)
    .set({
      status: nextStatus,
      resendEmailId: emailId,
      errorMessage,
      ...(nextStatus === "sent" || nextStatus === "delivered" ? { sentAt: now } : {}),
      ...(nextStatus === "delivered" ? { deliveredAt: now } : {}),
      updatedAt: now,
    })
    .where(eq(newsletterDeliveries.id, row.id));

  return true;
}
