import { profile } from "@/data/profile";
import { formatPostDateTime } from "@/lib/formatPostDate";
import { getContactConfig } from "@/lib/contact";
import { siteColors, siteFonts } from "@/lib/designTokens";
import { getNewsletterConfig } from "./config";
import { renderMarkdownForEmail } from "./markdown-email";
import { buildUnsubscribeUrl, createUnsubscribeToken } from "./unsubscribe-token";

export type NewsletterEmailContent = {
  subject: string;
  html: string;
  text: string;
};

const C = siteColors;
const font = siteFonts.sansEmail;

export function buildNewsletterEmail(params: {
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  subscriberId: string;
}): NewsletterEmailContent {
  const { siteUrl } = getNewsletterConfig();
  const { siteName } = getContactConfig();
  const base = siteUrl.replace(/\/$/, "");
  const articleUrl = `${base}/blog/${params.slug}`;
  const summary = params.summary.trim();
  const token = createUnsubscribeToken(params.subscriberId);
  const unsubUrl = token ? buildUnsubscribeUrl(token) : null;
  const { label: dateLabel } = formatPostDateTime(params.date);

  const subject = params.title;
  const bodyHtml = renderMarkdownForEmail(params.content);

  const textParts: string[] = [];
  if (summary) textParts.push(summary);
  if (dateLabel) textParts.push("", dateLabel);
  textParts.push("", params.content.trim(), "", `Read on site: ${articleUrl}`, "", `Website: ${base}`);
  if (unsubUrl) textParts.push("", `Unsubscribe: ${unsubUrl}`);
  const text = textParts.join("\n");

  const summaryBlock = summary
    ? `<h1 style="margin:0;font-size:36px;font-weight:800;line-height:1.12;letter-spacing:-0.02em;color:${C.foreground};">${escapeHtml(summary)}</h1>`
    : "";

  const dateBlock = dateLabel
    ? `<p style="margin:${summary ? 32 : 0}px 0 0;font-size:14px;font-weight:500;color:${C.muted};">${escapeHtml(dateLabel)}</p>`
    : "";

  const bodyMarginTop = dateLabel ? 8 : summary ? 32 : 0;

  const unsubHtml = unsubUrl
    ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:${C.muted};"><a href="${escapeHtml(unsubUrl)}" style="color:${C.muted};text-decoration:underline;">Unsubscribe</a></p>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${escapeHtml(params.title)}</title>
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
  <!--<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${C.background};color:${C.foreground};font-family:${font};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.background};">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
          <tr>
            <td>
              ${summaryBlock}
              ${dateBlock}
              <div style="margin-top:${bodyMarginTop}px;font-size:16px;line-height:1.65;color:${C.foregroundSoft};">
                ${bodyHtml}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-top:40px;">
              <p style="margin:0;font-size:16px;line-height:1.5;">
                <a href="${escapeHtml(articleUrl)}" style="font-weight:700;color:${C.accent};text-decoration:underline;text-underline-offset:4px;">Read on ${escapeHtml(siteName || profile.siteUrl.replace(/^https?:\/\//, ""))} →</a>
              </p>
              <p style="margin:16px 0 0;font-size:14px;line-height:1.5;color:${C.muted};">
                <a href="${escapeHtml(base)}" style="color:${C.accent};text-decoration:none;">${escapeHtml(base)}</a>
              </p>
              ${unsubHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

export function getNewsletterFromHeader(): string | null {
  const { from, siteName } = getContactConfig();
  if (!from) return null;
  return `${siteName} <${from}>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
