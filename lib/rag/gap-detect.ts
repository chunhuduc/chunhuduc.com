import { getDb } from "@/lib/db/client";
import { knowledgeGaps } from "@/lib/db/schema";
import { getProvider } from "./providers";
import type { RetrievedChunk } from "./types";
import { isGroundedRetrieval, looksLikeRefusal, maxSimilarity } from "./grounded";

export type GapReason = "low_similarity" | "model_refused";

export async function maybeCreateKnowledgeGap(params: {
  question: string;
  chunks: RetrievedChunk[];
  answer: string;
  chatLogId?: string;
}): Promise<void> {
  const grounded = isGroundedRetrieval(params.chunks);
  const refused = looksLikeRefusal(params.answer);

  let reason: GapReason | null = null;
  if (!grounded) {
    reason = "low_similarity";
  } else if (refused) {
    reason = "model_refused";
  }

  if (!reason) return;

  const provider = getProvider();
  let suggested = "";
  try {
    suggested = await provider.suggestGapEntry(params.question);
  } catch (e) {
    console.error("gap suggest failed", e);
    suggested = "[Draft FAQ needed for this question]";
  }

  const db = getDb();
  await db.insert(knowledgeGaps).values({
    question: params.question,
    reason,
    suggestedEntry: suggested,
    status: "pending",
    chatLogId: params.chatLogId ?? null,
  });
}

export function retrievalStats(chunks: RetrievedChunk[]) {
  return {
    maxSimilarity: maxSimilarity(chunks),
    grounded: isGroundedRetrieval(chunks),
  };
}
