import { getContactConfig } from "@/lib/contact";
import { getNewsletterConfig } from "./config";
import { buildUnsubscribeUrl, createUnsubscribeToken } from "./unsubscribe-token";

export type NewsletterEmailContent = {
  subject: string;
  html: string;
  text: string;
};

export function buildNewsletterEmail(params: {
  slug: string;
  title: string;
  summary: string;
  subscriberId: string;
}): NewsletterEmailContent {
  const { siteUrl } = getNewsletterConfig();
  const base = siteUrl.replace(/\/$/, "");
  const articleUrl = `${base}/blog/${params.slug}`;
  const summary = params.summary.trim() || "A new article is on the blog.";
  const token = createUnsubscribeToken(params.subscriberId);
  const unsubUrl = token ? buildUnsubscribeUrl(token) : null;

  const subject = `New post: ${params.title}`;

  const textLines = [
    params.title,
    "",
    summary,
    "",
    `Read the article: ${articleUrl}`,
  ];
  if (unsubUrl) {
    textLines.push("", `Unsubscribe: ${unsubUrl}`);
  }
  const text = textLines.join("\n");

  const unsubHtml = unsubUrl
    ? `<p style="margin-top:32px;font-size:13px;color:#888;"><a href="${escapeHtml(unsubUrl)}" style="color:#888;">Unsubscribe</a> from these emails.</p>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="font-size:22px;margin:0 0 16px;">${escapeHtml(params.title)}</h1>
  <p style="margin:0 0 24px;color:#444;">${escapeHtml(summary)}</p>
  <p style="margin:0 0 8px;"><a href="${escapeHtml(articleUrl)}" style="font-weight:600;color:#2563eb;">Read article →</a></p>
  ${unsubHtml}
</body>
</html>`;

  return { subject, html, text };
}

export function getNewsletterFromHeader(): string | null {
  const { from, fromName } = getContactConfig();
  if (!from) return null;
  return `${fromName} <${from}>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
