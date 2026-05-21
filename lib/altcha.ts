import {
  create,
  deriveHmacKeySecret,
  randomInt,
  CappedMap,
} from "altcha-lib/frameworks/nextjs";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

type AltchaApi = ReturnType<typeof create>;

let api: AltchaApi | null = null;

export function isAltchaConfigured(): boolean {
  return Boolean(process.env.ALTCHA_HMAC_SECRET?.trim());
}

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

export async function verifyAltchaToken(
  token: string | undefined,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isAltchaConfigured()) {
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
