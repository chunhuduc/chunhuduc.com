import { NextResponse } from "next/server";
import { isLiveChatEnabled } from "@/lib/live-chat/config";
import { createConversation } from "@/lib/live-chat/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: "Live chat is not configured." }, { status: 503 });
  }

  let body: { pageUrl?: string; visitorName?: string; visitorEmail?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  try {
    const { conversationId, visitorToken } = await createConversation({
      pageUrl: typeof body.pageUrl === "string" ? body.pageUrl.slice(0, 500) : null,
      visitorName:
        typeof body.visitorName === "string" ? body.visitorName.trim().slice(0, 120) : null,
      visitorEmail:
        typeof body.visitorEmail === "string" ? body.visitorEmail.trim().slice(0, 254) : null,
    });

    return NextResponse.json({ conversationId, visitorToken });
  } catch (e) {
    console.error("live-chat start failed", e);
    return NextResponse.json({ error: "Could not start chat." }, { status: 502 });
  }
}
