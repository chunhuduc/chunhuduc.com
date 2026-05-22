import { Resend } from "resend";
import { getContactConfig } from "@/lib/contact";
import {
  NOTIFY_DEBOUNCE_MS,
  getLiveChatEmailSkipReason,
  getLiveChatNotifyEmail,
} from "./config";
import { getConversationForNotify, setLastNotifyAt } from "./store";

export async function maybeNotifyOwnerNewMessage(params: {
  conversationId: string;
  messageBody: string;
}): Promise<void> {
  const skip = getLiveChatEmailSkipReason();
  if (skip) {
    console.warn(`live chat owner email skipped: ${skip}`);
    return;
  }

  const to = getLiveChatNotifyEmail();
  const { apiKey, from, fromName, siteName } = getContactConfig();
  if (!to || !apiKey) {
    console.warn("live chat owner email skipped: Resend not configured");
    return;
  }

  const conv = await getConversationForNotify(params.conversationId);
  if (!conv) return;

  const now = Date.now();
  if (conv.lastNotifyAt && now - conv.lastNotifyAt.getTime() < NOTIFY_DEBOUNCE_MS) {
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://chunhuduc.com";
  const adminUrl = `${baseUrl}/admin/chat?id=${encodeURIComponent(params.conversationId)}`;
  const who = conv.visitorName || conv.visitorEmail || "A visitor";
  const preview = params.messageBody.slice(0, 500);
  const page = conv.pageUrl ? `\nPage: ${conv.pageUrl}` : "";

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: `${fromName} <${from}>`,
    to: [to],
    replyTo: conv.visitorEmail || undefined,
    subject: `[${siteName}] New live chat from ${who}`,
    text: `New message on ${siteName} live chat.\n\nFrom: ${who}${page}\n\n${preview}\n\nReply in admin inbox:\n${adminUrl}`,
  });

  if (result.error) {
    console.error("live chat notify email failed", result.error);
    return;
  }

  await setLastNotifyAt(params.conversationId);
}
