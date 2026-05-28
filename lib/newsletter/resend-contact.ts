import { Resend } from "resend";
import { getNewsletterConfig } from "./config";

export async function syncResendContactOptIn(email: string): Promise<{
  ok: true;
  contactId: string | null;
} | {
  ok: false;
  error: string;
}> {
  const { apiKey, topicId } = getNewsletterConfig();
  if (!apiKey) {
    return { ok: true, contactId: null };
  }

  const resend = new Resend(apiKey);
  const topics = topicId
    ? [{ id: topicId, subscription: "opt_in" as const }]
    : undefined;

  const created = await resend.contacts.create({
    email,
    unsubscribed: false,
    topics,
  });

  if (!created.error) {
    return { ok: true, contactId: created.data?.id ?? null };
  }

  const updated = await resend.contacts.update({
    email,
    unsubscribed: false,
  });
  if (updated.error) {
    console.error("newsletter resend contact sync failed", created.error, updated.error);
    return { ok: false, error: "Could not sync subscription. Try again later." };
  }

  if (topicId) {
    const topicResult = await resend.contacts.topics.update({
      email,
      topics: [{ id: topicId, subscription: "opt_in" }],
    });
    if (topicResult.error) {
      console.error("newsletter resend topic opt-in failed", topicResult.error);
    }
  }

  const contact = await resend.contacts.get({ email });
  return { ok: true, contactId: contact.data?.id ?? null };
}

export async function syncResendContactOptOut(email: string): Promise<void> {
  const { apiKey, topicId } = getNewsletterConfig();
  if (!apiKey) return;

  const resend = new Resend(apiKey);

  const updated = await resend.contacts.update({
    email,
    unsubscribed: true,
  });
  if (updated.error) {
    console.error("newsletter resend contact opt-out failed", updated.error);
  }

  if (topicId) {
    const topicResult = await resend.contacts.topics.update({
      email,
      topics: [{ id: topicId, subscription: "opt_out" }],
    });
    if (topicResult.error) {
      console.error("newsletter resend topic opt-out failed", topicResult.error);
    }
  }
}
