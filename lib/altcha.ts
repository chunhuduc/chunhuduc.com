import {
  create,
  deriveHmacKeySecret,
  randomInt,
  CappedMap,
} from "altcha-lib/frameworks/nextjs";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";
import { isLocalhostRequest } from "./altcha-local";

type AltchaApi = ReturnType<typeof create>;

let api: AltchaApi | null = null;

export function isAltchaConfigured(): boolean {
  return Boolean(process.env.ALTCHA_HMAC_SECRET?.trim());
}

/** Production-like verification; skipped on localhost unless ALTCHA_ENFORCE_LOCALHOST=true */
export function isAltchaEnforced(request?: Request): boolean {
  if (!isAltchaConfigured()) return false;
  if (process.env.ALTCHA_ENFORCE_LOCALHOST === "true") return true;
  if (request && isLocalhostRequest(request)) return false;
  if (!request && process.env.NODE_ENV === "development") return false;
  return true;
}

export { isLocalhostClient, isLocalhostHost, isLocalhostRequest } from "./altcha-local";

async function getApi(): Promise<AltchaApi> {
  if (!isAltchaConfigured()) {
    throw new Error("ALTCHA_HMAC_SECRET is not set");
  }

  if (!api) {
    const hmacSignatureSecret = process.env.ALTCHA_HMAC_SECRET!.trim();
    const hmacKeySignatureSecret = await deriveHmacKeySecret(hmacSignatureSecret);

    api = create({
      hmacSignatureSecret,
      hmacKeySignatureSecret,
      deriveKey,
      fieldName: "altcha",
      createChallengeParameters: () => ({
        algorithm: "PBKDF2/SHA-256",
        cost: 5_000,
        counter: randomInt(5_000, 10_000),
        expiresAt: new Date(Date.now() + 600_000),
      }),
      store: new CappedMap<string, boolean>({ maxSize: 1_000 }),
    });
  }

  return api;
}

export async function altchaChallengeHandler(request: Request): Promise<Response> {
  const instance = await getApi();
  return instance.challengeHandler(request);
}

/**
 * Verify ALTCHA on submit. When `trustedSession` is true (e.g. repeat message in the
 * same chat session), an empty token is accepted because the widget is hidden client-side
 * and ALTCHA payloads are single-use.
 */
export async function verifyAltchaForSubmit(
  token: string | undefined,
  request: Request | undefined,
  options?: { trustedSession?: boolean },
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isAltchaEnforced(request)) {
    return { ok: true };
  }

  const trimmed = token?.trim();
  if (!trimmed) {
    if (options?.trustedSession) {
      return { ok: true };
    }
    return { ok: false, error: "Complete the verification challenge." };
  }

  return verifyAltchaToken(trimmed, request);
}

export async function verifyAltchaToken(
  token: string | undefined,
  request?: Request,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isAltchaEnforced(request)) {
    return { ok: true };
  }

  const trimmed = token?.trim();
  if (!trimmed) {
    return { ok: false, error: "Complete the verification challenge." };
  }

  const instance = await getApi();
  const verifyRequest = new Request("http://localhost/api/altcha/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ altcha: trimmed }),
  });

  const response = await instance.verifyHandler(verifyRequest);
  const result = (await response.json()) as {
    error?: string | null;
    verification?: { verified?: boolean } | null;
  };

  if (result.error || !result.verification?.verified) {
    return {
      ok: false,
      error: "Verification failed. Please try again.",
    };
  }

  return { ok: true };
}
