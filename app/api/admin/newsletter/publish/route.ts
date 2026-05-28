import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { newsletterPosts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/newsletter/admin-guard";
import {
  countActiveSubscribers,
  getDeliveryStatsBySlug,
  isNewsletterPublishConfigured,
  publishPost,
} from "@/lib/newsletter/publish";
import { getPostBySlug } from "@/lib/posts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  if (!isNewsletterPublishConfigured()) {
    return NextResponse.json(
      {
        error:
          "Publish is not configured. Set RESEND_API_KEY, CONTACT_FROM_EMAIL, and NEWSLETTER_UNSUBSCRIBE_SECRET.",
      },
      { status: 503 },
    );
  }

  let body: { slug?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const slug = String(body.slug ?? "").trim();
  if (!slug) {
    return NextResponse.json({ error: "slug is required." }, { status: 400 });
  }

  try {
    getPostBySlug(slug);
  } catch {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  try {
    const result = await publishPost(slug);
    return NextResponse.json(result);
  } catch (e) {
    console.error("newsletter publish failed", e);
    return NextResponse.json({ error: "Publish failed." }, { status: 502 });
  }
}
