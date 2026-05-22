import { NextResponse } from "next/server";
import { verifyAltchaForSubmit } from "@/lib/altcha";
import { isDatabaseConfigured } from "@/lib/db/client";
import { getDb } from "@/lib/db/client";
import { chatLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { toCitations } from "@/lib/rag/citations";
import { maybeCreateKnowledgeGap, retrievalStats } from "@/lib/rag/gap-detect";
import { isGroundedRetrieval } from "@/lib/rag/grounded";
import { getProvider } from "@/lib/rag/providers";
import { NO_CONTEXT_MESSAGE, PORTFOLIO_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/rag/prompt";
import { retrieveSimilarChunks } from "@/lib/rag/retrieve";

const MAX_QUESTION = 2000;

export const runtime = "nodejs";

type ChatBody = {
  question?: string;
  altcha?: string;
  sessionId?: string;
};

function encodeEvent(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Ask AI is not configured yet." },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const limited = checkRateLimit(`chat:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many questions. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const question = String(body.question ?? "").trim().slice(0, MAX_QUESTION);
  if (!question) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  const sessionId = String(body.sessionId ?? "").trim().slice(0, 64) || null;

  const trustedSession = sessionId ? await askSessionHasPriorLogs(sessionId) : false;
  const altchaCheck = await verifyAltchaForSubmit(
    typeof body.altcha === "string" ? body.altcha : "",
    request,
    { trustedSession },
  );
  if (!altchaCheck.ok) {
    return NextResponse.json({ error: altchaCheck.error }, { status: 403 });
  }

  let chunks;
  try {
    chunks = await retrieveSimilarChunks(question);
  } catch (e) {
    console.error("retrieve failed", e);
    return NextResponse.json(
      { error: "Could not search knowledge base. Try again later." },
      { status: 502 },
    );
  }

  const citations = toCitations(chunks);
  const stats = retrievalStats(chunks);

  if (!isGroundedRetrieval(chunks)) {
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(
          encoder.encode(
            encodeEvent({
              type: "sources",
              sources: citations,
              grounded: false,
            }),
          ),
        );
        controller.enqueue(
          encoder.encode(
            encodeEvent({ type: "text", text: NO_CONTEXT_MESSAGE }),
          ),
        );
        controller.enqueue(encoder.encode(encodeEvent({ type: "done" })));
        controller.close();
      },
    });

    void logChat({
      sessionId,
      question,
      answer: NO_CONTEXT_MESSAGE,
      citations,
      stats,
      model: "template:no_context",
    }).then((logId) =>
      maybeCreateKnowledgeGap({
        question,
        chunks,
        answer: NO_CONTEXT_MESSAGE,
        chatLogId: logId,
      }),
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const provider = getProvider();
  const userPrompt = buildUserPrompt(question, chunks);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(
          encodeEvent({
            type: "sources",
            sources: citations,
            grounded: true,
          }),
        ),
      );

      let answer = "";
      try {
        const result = await provider.chatStream({
          system: PORTFOLIO_SYSTEM_PROMPT,
          user: userPrompt,
          onTextDelta(delta) {
            answer += delta;
            controller.enqueue(
              encoder.encode(encodeEvent({ type: "text", text: delta })),
            );
          },
        });
        answer = result.text || answer;

        controller.enqueue(encoder.encode(encodeEvent({ type: "done" })));
        controller.close();

        const logId = await logChat({
          sessionId,
          question,
          answer,
          citations,
          stats: { ...stats, grounded: true },
          model: result.model,
        });

        await maybeCreateKnowledgeGap({
          question,
          chunks,
          answer,
          chatLogId: logId,
        });
      } catch (e) {
        console.error("chat stream failed", e);
        controller.enqueue(
          encoder.encode(
            encodeEvent({
              type: "error",
              error: "Something went wrong. Try again.",
            }),
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function askSessionHasPriorLogs(sessionId: string): Promise<boolean> {
  try {
    const db = getDb();
    const rows = await db
      .select({ id: chatLogs.id })
      .from(chatLogs)
      .where(eq(chatLogs.sessionId, sessionId))
      .limit(1);
    return rows.length > 0;
  } catch (e) {
    console.error("ask session lookup failed", e);
    return false;
  }
}

async function logChat(params: {
  sessionId: string | null;
  question: string;
  answer: string;
  citations: ReturnType<typeof toCitations>;
  stats: { maxSimilarity: number; grounded: boolean };
  model: string;
}): Promise<string | undefined> {
  try {
    const db = getDb();
    const rows = await db
      .insert(chatLogs)
      .values({
        sessionId: params.sessionId,
        question: params.question,
        answer: params.answer,
        retrievedChunks: params.citations.map((c) => ({
          document_id: c.documentId,
          title: c.title,
          source: c.source,
          source_uri: c.sourceUri,
          similarity: c.similarity,
        })),
        maxSimilarity: params.stats.maxSimilarity,
        grounded: params.stats.grounded,
        model: params.model,
      })
      .returning({ id: chatLogs.id });

    return rows[0]?.id;
  } catch (e) {
    console.error("chat log insert failed", e);
    return undefined;
  }
}
