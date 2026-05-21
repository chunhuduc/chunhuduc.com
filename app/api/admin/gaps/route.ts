import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyAdminCookie } from "@/lib/admin-auth";
import { getDb, isDatabaseConfigured } from "@/lib/db/client";
import { knowledgeGaps } from "@/lib/db/schema";
import { ingestSingleMarkdown } from "@/lib/rag/ingest";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET(request: Request) {
  if (!verifyAdminCookie(request.headers.get("cookie"))) {
    return unauthorized();
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "pending";

  const db = getDb();
  const rows = await db
    .select()
    .from(knowledgeGaps)
    .where(eq(knowledgeGaps.status, status))
    .orderBy(desc(knowledgeGaps.createdAt));

  return NextResponse.json({ gaps: rows });
}

export async function PATCH(request: Request) {
  if (!verifyAdminCookie(request.headers.get("cookie"))) {
    return unauthorized();
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let body: {
    id?: string;
    action?: "approve" | "reject";
    suggestedEntry?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const id = String(body.id ?? "").trim();
  const action = body.action;
  if (!id || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ error: "id and action required." }, { status: 400 });
  }

  const db = getDb();
  const existing = await db
    .select()
    .from(knowledgeGaps)
    .where(eq(knowledgeGaps.id, id))
    .limit(1);

  const gap = existing[0];
  if (!gap) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (action === "reject") {
    await db
      .update(knowledgeGaps)
      .set({ status: "rejected", reviewedAt: new Date() })
      .where(eq(knowledgeGaps.id, id));
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  const entry =
    String(body.suggestedEntry ?? "").trim() ||
    gap.suggestedEntry ||
    "";

  const source = `knowledge:approved/gap-${id}.md`;
  const title = `FAQ: ${gap.question.slice(0, 80)}`;

  try {
    const chunks = await ingestSingleMarkdown({
      title,
      source,
      sourceUri: "/ask",
      text: `# ${title}\n\n${entry}\n\n_Original question:_ ${gap.question}`,
    });

    await db
      .update(knowledgeGaps)
      .set({
        status: "ingested",
        suggestedEntry: entry,
        reviewedAt: new Date(),
      })
      .where(eq(knowledgeGaps.id, id));

    return NextResponse.json({ ok: true, status: "ingested", chunks });
  } catch (e) {
    console.error("approve ingest failed", e);
    await db
      .update(knowledgeGaps)
      .set({
        status: "approved",
        suggestedEntry: entry,
        reviewedAt: new Date(),
      })
      .where(eq(knowledgeGaps.id, id));

    return NextResponse.json({
      ok: true,
      status: "approved",
      warning: "Saved as approved but ingest failed. Run knowledge:ingest manually.",
    });
  }
}
