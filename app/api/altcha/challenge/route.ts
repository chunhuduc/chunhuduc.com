import { NextResponse } from "next/server";
import { altchaChallengeHandler, isAltchaConfigured } from "@/lib/altcha";

export async function GET() {
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
