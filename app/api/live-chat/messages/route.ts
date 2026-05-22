import { NextResponse } from "next/server";
import { verifyAltchaToken } from "@/lib/altcha";
import { publishInboxUpdate, publishMessage } from "@/lib/live-chat/ably-server";
import { isLiveChatEnabled, MAX_MESSAGE_LENGTH } from "@/lib/live-chat/config";
import { maybeNotifyOwnerNewMessage } from "@/lib/live-chat/notify";
import {
  insertMessage,
  listMessages,
  updateConversationVisitor,
  verifyVisitorAccess,
} from "@/lib/live-chat/store";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: "Live chat is not configured." }, { status: 503 });
  }

  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId")?.trim() ?? "";
  const visitorToken = url.searchParams.get("visitorToken")?.trim() ?? "";

  if (!conversationId || !visitorToken) {
    return NextResponse.json({ error: "conversationId and visitorToken required." }, { status: 400 });
  }

  if (!(await verifyVisitorAccess(conversationId, visitorToken))) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const messages = await listMessages(conversationId);
    return NextResponse.json({ messages });
  } catch (e) {
    console.error("live-chat list messages failed", e);
    return NextResponse.json({ error: "Could not load messages." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: "Live chat is not configured." }, { status: 503 });
  }

  const ip = getClientIp(request);
  const limited = checkRateLimit(`live-chat:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many messages. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let body: {
    conversationId?: string;
    visitorToken?: string;
    body?: string;
    altcha?: string;
    visitorName?: string;
    visitorEmail?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const conversationId = String(body.conversationId ?? "").trim();
  const visitorToken = String(body.visitorToken ?? "").trim();
  const text = String(body.body ?? "").trim().slice(0, MAX_MESSAGE_LENGTH);

  if (!conversationId || !visitorToken || !text) {
    return NextResponse.json({ error: "conversationId, visitorToken, and body required." }, { status: 400 });
  }

  if (!(await verifyVisitorAccess(conversationId, visitorToken))) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const altchaCheck = await verifyAltchaToken(
    typeof body.altcha === "string" ? body.altcha : "",
    request,
  );
  if (!altchaCheck.ok) {
    return NextResponse.json({ error: altchaCheck.error }, { status: 403 });
  }

  if (body.visitorName || body.visitorEmail) {
    await updateConversationVisitor(conversationId, visitorToken, {
      visitorName:
        typeof body.visitorName === "string" ? body.visitorName.trim().slice(0, 120) : undefined,
      visitorEmail:
        typeof body.visitorEmail === "string" ? body.visitorEmail.trim().slice(0, 254) : undefined,
    });
  }

  try {
    const message = await insertMessage({
      conversationId,
      sender: "visitor",
      body: text,
    });

    const payload = {
      type: "message" as const,
      id: message.id,
      sender: message.sender,
      body: message.body,
      createdAt: message.createdAt,
    };

    await publishMessage(conversationId, payload);
    await publishInboxUpdate({
      type: "conversation.updated",
      conversationId,
      lastMessageAt: message.createdAt,
      preview: text.slice(0, 120),
    });

    try {
      await maybeNotifyOwnerNewMessage({ conversationId, messageBody: text });
    } catch (notifyErr) {
      console.error("live chat owner email failed", notifyErr);
    }

    return NextResponse.json({ message });
  } catch (e) {
    console.error("live-chat post message failed", e);
    return NextResponse.json({ error: "Could not send message." }, { status: 502 });
  }
}
