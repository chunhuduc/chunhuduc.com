import { NextResponse } from "next/server";
import { createVisitorTokenRequest } from "@/lib/live-chat/ably-server";
import { isLiveChatEnabled } from "@/lib/live-chat/config";
import { verifyVisitorAccess } from "@/lib/live-chat/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: "Live chat is not configured." }, { status: 503 });
  }

  let body: { conversationId?: string; visitorToken?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const conversationId = String(body.conversationId ?? "").trim();
  const visitorToken = String(body.visitorToken ?? "").trim();

  if (!conversationId || !visitorToken) {
    return NextResponse.json({ error: "conversationId and visitorToken required." }, { status: 400 });
  }

  if (!(await verifyVisitorAccess(conversationId, visitorToken))) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const tokenRequest = await createVisitorTokenRequest(conversationId);
    return NextResponse.json(tokenRequest);
  } catch (e) {
    console.error("ably visitor token failed", e);
    return NextResponse.json({ error: "Could not create realtime token." }, { status: 502 });
  }
}
