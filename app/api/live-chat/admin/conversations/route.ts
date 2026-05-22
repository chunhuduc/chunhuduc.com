import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/live-chat/admin";
import { isLiveChatEnabled } from "@/lib/live-chat/config";
import { listConversationsForAdmin } from "@/lib/live-chat/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: "Live chat is not configured." }, { status: 503 });
  }

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const conversations = await listConversationsForAdmin();
    return NextResponse.json({ conversations });
  } catch (e) {
    console.error("live-chat admin list failed", e);
    return NextResponse.json({ error: "Could not load conversations." }, { status: 502 });
  }
}
