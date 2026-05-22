import { NextResponse } from "next/server";
import { createAdminTokenRequest } from "@/lib/live-chat/ably-server";
import { isAdminRequest } from "@/lib/live-chat/admin";
import { isLiveChatEnabled } from "@/lib/live-chat/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: "Live chat is not configured." }, { status: 503 });
  }

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const tokenRequest = await createAdminTokenRequest();
    return NextResponse.json(tokenRequest);
  } catch (e) {
    console.error("ably admin token failed", e);
    return NextResponse.json({ error: "Could not create realtime token." }, { status: 502 });
  }
}
