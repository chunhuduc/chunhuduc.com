import { NextResponse } from "next/server";
import { verifyAdminCookie } from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/db/client";

export function adminUnauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export function adminDbUnavailable() {
  return NextResponse.json({ error: "Database not configured." }, { status: 503 });
}

export function requireAdmin(request: Request): NextResponse | null {
  if (!verifyAdminCookie(request.headers.get("cookie"))) {
    return adminUnauthorized();
  }
  if (!isDatabaseConfigured()) {
    return adminDbUnavailable();
  }
  return null;
}
