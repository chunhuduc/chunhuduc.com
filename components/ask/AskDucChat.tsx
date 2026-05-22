"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatSourceCitation } from "@/lib/rag/types";
import AskComposer, { markAltchaVerified } from "./AskComposer";
import AskExampleChips from "./AskExampleChips";
import AskMessageList, { type ChatMessage } from "./AskMessageList";

function parseSseChunk(
  line: string,
): { type: string; text?: string; sources?: ChatSourceCitation[]; error?: string } | null {
  if (!line.startsWith("data: ")) return null;
  try {
    return JSON.parse(line.slice(6)) as {
      type: string;
      text?: string;
      sources?: ChatSourceCitation[];
      error?: string;
    };
  } catch {
    return null;
  }
}

function sessionId(): string {
  const key = "ask_session_id";
  if (typeof sessionStorage === "undefined") return "";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function AskDucChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [altchaEpoch, setAltchaEpoch] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const sendQuestion = useCallback(async (question: string, altcha: string) => {
    const q = question.trim();
    if (!q || loading) return;

    setError("");
    setLoading(true);

    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: q },
      { id: assistantId, role: "assistant", content: "", sources: [], streaming: true },
    ]);
    setInput("");

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          altcha,
          sessionId: sessionId(),
        }),
        signal: ac.signal,
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? `Request failed (${res.status})`);
      }

      if (!res.body) {
        throw new Error("No response body.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sources: ChatSourceCitation[] = [];
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          const event = parseSseChunk(line);
          if (!event) continue;

          if (event.type === "sources" && event.sources) {
            sources = event.sources;
          } else if (event.type === "text" && event.text) {
            fullText += event.text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: fullText, sources, streaming: true }
                  : m,
              ),
            );
          } else if (event.type === "error") {
            throw new Error(event.error ?? "Stream error.");
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: fullText, sources, streaming: false }
            : m,
        ),
      );
      markAltchaVerified();
      setAltchaEpoch((n) => n + 1);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <div>
      <AskExampleChips
        disabled={loading}
        onSelect={(text) => setInput(text)}
      />

      <div
        className="mt-8 max-h-[min(60vh,520px)] overflow-y-auto rounded-2xl bg-[#232b35] p-5 shadow-[0_18px_52px_rgba(0,0,0,0.42)] sm:p-6"
        aria-live="polite"
        aria-relevant="additions text"
      >
        <AskMessageList messages={messages} />
        {loading && messages.length > 0 && messages[messages.length - 1]?.role === "user" ? (
          <p className="mt-4 text-xs font-semibold text-muted">Thinking…</p>
        ) : null}
      </div>

      <AskComposer
        key={altchaEpoch}
        value={input}
        onChange={setInput}
        onSubmit={(altcha) => void sendQuestion(input, altcha)}
        loading={loading}
      />

      {error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
