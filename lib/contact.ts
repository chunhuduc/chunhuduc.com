import { profile } from "@/data/profile";

export type ContactPayload = {
  name: string;
  email: string;
  project: string;
  /** Honeypot; must stay empty */
  company?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_PROJECT = 8000;

export function getContactConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || profile.email;
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || profile.email;
  const fromName = process.env.CONTACT_FROM_NAME?.trim() || "Chu Nhu Duc";
  const siteName = process.env.CONTACT_SITE_NAME?.trim() || "chunhuduc.com";

  return { apiKey, to, from, fromName, siteName };
}

export function parseContactBody(
  body: unknown,
): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const raw = body as Record<string, unknown>;
  const name = String(raw.name ?? "").trim().slice(0, MAX_NAME);
  const email = String(raw.email ?? "").trim().slice(0, MAX_EMAIL);
  const project = String(raw.project ?? "").trim().slice(0, MAX_PROJECT);
  const company = String(raw.company ?? "").trim();

  if (company) {
    return { ok: false, error: "Rejected." };
  }

  if (!email) {
    return { ok: false, error: "Email is required." };
  }

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  return { ok: true, data: { name, email, project, company } };
}

export function buildOwnerEmailContent(data: ContactPayload) {
  const subject = data.name
    ? `Project inquiry from ${data.name}`
    : "Project inquiry from chunhuduc.com";

  const lines = [
    data.name ? `Name: ${data.name}` : null,
    `Email: ${data.email}`,
    "",
    data.project || "(no message provided)",
  ].filter((line) => line !== null);

  return { subject, text: lines.join("\n") };
}

export function buildAutoReplyContent(data: ContactPayload, siteName: string) {
  const greeting = data.name ? `Hi ${data.name},` : "Hi,";

  const text = [
    greeting,
    "",
    `Thanks for reaching out via ${siteName}. Your message was received.`,
    "",
    "I typically reply within a few business days. You can reply to this email if you want to add details.",
    "If your note is urgent, include timeline and scope in one place so I can respond faster.",
    "",
    "Best,",
    "CHU NHƯ ĐỨC",
  ].join("\n");

  return {
    subject: "We received your message",
    text,
  };
}
