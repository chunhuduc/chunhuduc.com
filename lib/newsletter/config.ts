import { isDatabaseConfigured } from "@/lib/db/client";

export function getNewsletterConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID?.trim();
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  const unsubscribeSecret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET?.trim();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://chunhuduc.com";

  return {
    apiKey,
    topicId,
    webhookSecret,
    unsubscribeSecret,
    siteUrl,
  };
}

export function isNewsletterSubscribeConfigured(): boolean {
  return isDatabaseConfigured();
}

export function isNewsletterWebhookConfigured(): boolean {
  const { apiKey, webhookSecret } = getNewsletterConfig();
  return Boolean(apiKey && webhookSecret);
}

export function isNewsletterUnsubscribeConfigured(): boolean {
  return Boolean(getNewsletterConfig().unsubscribeSecret && isDatabaseConfigured());
}
