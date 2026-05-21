import { NextResponse } from "next/server";
import { adminCookieHeader, isAdminConfigured } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin not configured." }, { status: 503 });
  }

  let body: { secret?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const provided = String(body.secret ?? "").trim();
  const expected = process.env.ADMIN_SECRET?.trim();

  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": adminCookieHeader(),
      },
    },
  );
}
