import { isDatabaseConfigured } from "@/lib/db/client";

export function isLiveChatEnabled(): boolean {
  if (process.env.LIVE_CHAT_ENABLED === "false") return false;
  return isDatabaseConfigured() && Boolean(process.env.ABLY_API_KEY?.trim());
}

export function getAblyApiKey(): string {
  const key = process.env.ABLY_API_KEY?.trim();
  if (!key) {
    throw new Error("ABLY_API_KEY is not set.");
  }
  return key;
}

export function isLiveChatEmailNotifyEnabled(): boolean {
  return process.env.LIVE_CHAT_EMAIL_NOTIFY !== "false";
}

export function getLiveChatNotifyEmail(): string {
  return (
    process.env.LIVE_CHAT_NOTIFY_EMAIL?.trim() ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    ""
  );
}

export function getLiveChatEmailSkipReason(): string | null {
  if (!isLiveChatEmailNotifyEnabled()) return "LIVE_CHAT_EMAIL_NOTIFY=false";
  if (!process.env.RESEND_API_KEY?.trim()) return "RESEND_API_KEY missing";
  if (!getLiveChatNotifyEmail()) return "LIVE_CHAT_NOTIFY_EMAIL / CONTACT_TO_EMAIL missing";
  return null;
}

export const MAX_MESSAGE_LENGTH = 2000;
export const NOTIFY_DEBOUNCE_MS = 3 * 60 * 1000;
