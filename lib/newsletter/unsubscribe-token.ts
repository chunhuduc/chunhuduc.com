import { createHmac, timingSafeEqual } from "crypto";
import { getNewsletterConfig } from "./config";

const TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1000;

type TokenPayload = {
  id: string;
  exp: number;
};

function getSecret(): string | null {
  return getNewsletterConfig().unsubscribeSecret ?? null;
}

function signPayload(encoded: string, secret: string): string {
  return createHmac("sha256", secret).update(encoded).digest("base64url");
}

export function createUnsubscribeToken(subscriberId: string): string | null {
  const secret = getSecret();
  if (!secret) return null;

  const payload: TokenPayload = {
    id: subscriberId,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encoded, secret);
  return `${encoded}.${signature}`;
}

export function verifyUnsubscribeToken(
  token: string,
): { ok: true; subscriberId: string } | { ok: false; error: string } {
  const secret = getSecret();
  if (!secret) {
    return { ok: false, error: "Unsubscribe is not configured." };
  }

  const trimmed = token.trim();
  const dot = trimmed.lastIndexOf(".");
  if (dot <= 0) {
    return { ok: false, error: "Invalid unsubscribe link." };
  }

  const encoded = trimmed.slice(0, dot);
  const signature = trimmed.slice(dot + 1);
  const expected = signPayload(encoded, secret);

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return { ok: false, error: "Invalid unsubscribe link." };
  }

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as TokenPayload;
  } catch {
    return { ok: false, error: "Invalid unsubscribe link." };
  }

  if (!payload.id || typeof payload.exp !== "number" || Date.now() > payload.exp) {
    return { ok: false, error: "This unsubscribe link has expired." };
  }

  return { ok: true, subscriberId: payload.id };
}

export function buildUnsubscribeUrl(token: string): string {
  const { siteUrl } = getNewsletterConfig();
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}
