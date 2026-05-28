import { NextResponse } from "next/server";
import { verifyAltchaToken } from "@/lib/altcha";
import { isNewsletterSubscribeConfigured } from "@/lib/newsletter/config";
import { parseNewsletterSubscribeBody } from "@/lib/newsletter/parse";
import { subscribeToNewsletter } from "@/lib/newsletter/subscribe";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isNewsletterSubscribeConfigured()) {
    return NextResponse.json(
      { error: "Newsletter is not configured yet." },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const limited = checkRateLimit(`newsletter:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const raw = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const altchaCheck = await verifyAltchaToken(
    typeof raw.altcha === "string" ? raw.altcha : String(raw.altcha ?? ""),
    request,
  );
  if (!altchaCheck.ok) {
    return NextResponse.json({ error: altchaCheck.error }, { status: 403 });
  }

  const parsed = parseNewsletterSubscribeBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await subscribeToNewsletter(parsed.data.email);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("newsletter subscribe failed", e);
    return NextResponse.json(
      { error: "Could not save subscription. Try again later." },
      { status: 502 },
    );
  }
}
