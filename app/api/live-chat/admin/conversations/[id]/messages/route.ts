import { NextResponse } from "next/server";
import { publishMessage } from "@/lib/live-chat/ably-server";
import { isAdminRequest } from "@/lib/live-chat/admin";
import { isLiveChatEnabled, MAX_MESSAGE_LENGTH } from "@/lib/live-chat/config";
import { insertMessage, listMessages, markConversationRead } from "@/lib/live-chat/store";

export const runtime = "nodejs";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: "Live chat is not configured." }, { status: 503 });
  }

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await ctx.params;

  try {
    const messages = await listMessages(id);
    await markConversationRead(id);
    return NextResponse.json({ messages });
  } catch (e) {
    console.error("live-chat admin get messages failed", e);
    return NextResponse.json({ error: "Could not load messages." }, { status: 502 });
  }
}

export async function POST(request: Request, ctx: RouteCtx) {
  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: "Live chat is not configured." }, { status: 503 });
  }

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id: conversationId } = await ctx.params;

  let body: { body?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const text = String(body.body ?? "").trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!text) {
    return NextResponse.json({ error: "body required." }, { status: 400 });
  }

  try {
    const message = await insertMessage({
      conversationId,
      sender: "owner",
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

    return NextResponse.json({ message });
  } catch (e) {
    console.error("live-chat admin reply failed", e);
    return NextResponse.json({ error: "Could not send reply." }, { status: 502 });
  }
}
