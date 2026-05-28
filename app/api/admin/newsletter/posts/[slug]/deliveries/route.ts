import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/newsletter/admin-guard";
import { listDeliveriesForPost } from "@/lib/newsletter/publish";
import { getPostBySlug } from "@/lib/posts";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;
  const trimmed = slug.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "slug is required." }, { status: 400 });
  }

  try {
    getPostBySlug(trimmed);
  } catch {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  try {
    const deliveries = await listDeliveriesForPost(trimmed);
    return NextResponse.json({ slug: trimmed, deliveries });
  } catch (e) {
    console.error("newsletter deliveries list failed", e);
    return NextResponse.json({ error: "Could not load deliveries." }, { status: 502 });
  }
}
