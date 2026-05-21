import { NextResponse } from "next/server";
import { altchaChallengeHandler, isAltchaConfigured, isAltchaEnforced } from "@/lib/altcha";

export async function GET(request: Request) {
  if (!isAltchaEnforced(request)) {
    return NextResponse.json({ skipped: true, reason: "localhost" });
  }

  if (!isAltchaConfigured()) {
    return NextResponse.json(
      { error: "ALTCHA is not configured." },
      { status: 503 },
    );
  }

  try {
    return await altchaChallengeHandler(new Request("http://localhost"));
  } catch (err) {
    console.error("altcha challenge failed", err);
    return NextResponse.json(
      { error: "Could not create verification challenge." },
      { status: 500 },
    );
  }
}
