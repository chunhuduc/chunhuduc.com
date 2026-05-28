import { Resend } from "resend";
import { NextResponse } from "next/server";
import { applyDeliveryWebhookEvent } from "@/lib/newsletter/delivery";
import { getNewsletterConfig, isNewsletterWebhookConfigured } from "@/lib/newsletter/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isNewsletterWebhookConfigured()) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const { apiKey, webhookSecret } = getNewsletterConfig();
  const rawBody = await request.text();

  const resend = new Resend(apiKey);
  let event;
  try {
    event = resend.webhooks.verify({
      payload: rawBody,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret: webhookSecret!,
    });
  } catch (e) {
    console.error("newsletter webhook verify failed", e);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    await applyDeliveryWebhookEvent(event);
  } catch (e) {
    console.error("newsletter webhook handler failed", e);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
