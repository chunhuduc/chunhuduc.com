import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "ask_admin";
const MAX_AGE_SEC = 86_400;

function getSecret(): string | null {
  return process.env.ADMIN_SECRET?.trim() || null;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function isAdminConfigured(): boolean {
  return Boolean(getSecret());
}

export function createAdminCookieValue(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE_SEC);
  const sig = sign(exp, secret);
  return `${exp}.${sig}`;
}

export function verifyAdminCookie(cookieHeader: string | null): boolean {
  const secret = getSecret();
  if (!secret || !cookieHeader) return false;

  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const raw = match?.[1];
  if (!raw) return false;

  const [exp, sig] = raw.split(".");
  if (!exp || !sig) return false;

  const expected = sign(exp, secret);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum < Math.floor(Date.now() / 1000)) {
    return false;
  }

  return true;
}

export function adminCookieHeader(): string {
  const value = createAdminCookieValue();
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE_SEC}`;
}

export { COOKIE_NAME };
