import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { newsletterPosts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/newsletter/admin-guard";
import { countActiveSubscribers, getDeliveryStatsBySlug } from "@/lib/newsletter/publish";
import { getAllPostsMeta } from "@/lib/posts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const [postsMeta, statsBySlug, totalActiveSubscribers, dbPosts] = await Promise.all([
      Promise.resolve(getAllPostsMeta()),
      getDeliveryStatsBySlug(),
      countActiveSubscribers(),
      getDb()
        .select()
        .from(newsletterPosts),
    ]);

    const dbBySlug = new Map(dbPosts.map((p) => [p.slug, p]));

    const posts = postsMeta.map((meta) => {
      const dbPost = dbBySlug.get(meta.slug);
      const stats = statsBySlug.get(meta.slug) ?? {
        delivered: 0,
        failed: 0,
        pending: 0,
        sent: 0,
        bounced: 0,
        complained: 0,
        total: 0,
      };

      return {
        slug: meta.slug,
        title: meta.title,
        date: meta.date,
        summary: meta.summary ?? "",
        firstPublishedAt: dbPost?.firstPublishedAt?.toISOString() ?? null,
        lastPublishAt: dbPost?.lastPublishAt?.toISOString() ?? null,
        publishCount: dbPost?.publishCount ?? 0,
        stats,
      };
    });

    return NextResponse.json({ totalActiveSubscribers, posts });
  } catch (e) {
    console.error("newsletter posts list failed", e);
    return NextResponse.json({ error: "Could not load posts." }, { status: 502 });
  }
}
