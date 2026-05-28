const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;

export type NewsletterSubscribePayload = {
  email: string;
  /** Honeypot; must stay empty */
  company?: string;
};

export function normalizeNewsletterEmail(raw: string): string {
  return raw.trim().toLowerCase().slice(0, MAX_EMAIL);
}

export function parseNewsletterSubscribeBody(
  body: unknown,
): { ok: true; data: NewsletterSubscribePayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const raw = body as Record<string, unknown>;
  const email = normalizeNewsletterEmail(String(raw.email ?? ""));
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

  return { ok: true, data: { email, company } };
}
