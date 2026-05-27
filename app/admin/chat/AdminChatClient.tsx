"use client";

import { useChatMessageListScroll } from "@/hooks/useChatMessageListScroll";
import { useLiveChatAbly, useLiveChatInboxAbly } from "@/hooks/useLiveChatAbly";
import type {
  LiveChatConversationDto,
  LiveChatMessageDto,
  LiveChatMessagePayload,
} from "@/lib/live-chat/types";
import { formatVisitorDisplay } from "@/lib/live-chat/visitor";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AdminChatClient() {
  const searchParams = useSearchParams();
  const [secret, setSecret] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [conversations, setConversations] = useState<LiveChatConversationDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<LiveChatMessageDto[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { listRef, onScroll, forceScrollToBottom } = useChatMessageListScroll(
    messages,
    loggedIn && Boolean(selectedId),
    "owner",
  );

  const loadConversations = useCallback(async () => {
    const res = await fetch("/api/live-chat/admin/conversations", { credentials: "include" });
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(json.error ?? `Failed (${res.status})`);
    }
    const json = (await res.json()) as { conversations: LiveChatConversationDto[] };
    setConversations(json.conversations);
  }, []);

  const loadMessages = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/live-chat/admin/conversations/${id}/messages`, {
        credentials: "include",
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? `Failed (${res.status})`);
      }
      const json = (await res.json()) as { messages: LiveChatMessageDto[] };
      setMessages(json.messages);
      void loadConversations();
    },
    [loadConversations],
  );

  const appendMessage = useCallback((msg: LiveChatMessageDto) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  const onAblyMessage = useCallback(
    (payload: LiveChatMessagePayload) => {
      appendMessage({
        id: payload.id,
        sender: payload.sender,
        body: payload.body,
        createdAt: payload.createdAt,
      });
    },
    [appendMessage],
  );

  useLiveChatAbly({
    conversationId: selectedId,
    visitorToken: null,
    enabled: loggedIn && Boolean(selectedId),
    onMessage: onAblyMessage,
    mode: "admin",
  });

  useLiveChatInboxAbly({
    enabled: loggedIn,
    onInbox: () => {
      void loadConversations();
    },
  });

  useEffect(() => {
    if (!loggedIn) return;
    void loadConversations().catch((e) => setError(e instanceof Error ? e.message : "Load failed."));
  }, [loggedIn, loadConversations]);

  useEffect(() => {
    const id = searchParams.get("id")?.trim();
    if (id && loggedIn) setSelectedId(id);
  }, [searchParams, loggedIn]);

  useEffect(() => {
    if (!loggedIn || !selectedId) return;
    setLoading(true);
    void loadMessages(selectedId)
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed."))
      .finally(() => {
        setLoading(false);
        requestAnimationFrame(() => forceScrollToBottom());
      });
  }, [loggedIn, selectedId, loadMessages, forceScrollToBottom]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    if (!res.ok) {
      setError("Invalid secret.");
      return;
    }
    setLoggedIn(true);
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !reply.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/live-chat/admin/conversations/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: reply.trim() }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Reply failed.");
      }
      const json = (await res.json()) as { message: LiveChatMessageDto };
      appendMessage(json.message);
      requestAnimationFrame(() => forceScrollToBottom());
      setReply("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reply failed.");
    } finally {
      setLoading(false);
    }
  }

  const selectedConversation =
    selectedId != null ? conversations.find((c) => c.id === selectedId) : undefined;
  const selectedVisitor = selectedConversation
    ? formatVisitorDisplay(selectedConversation)
    : null;

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-extrabold text-foreground">Live chat admin</h1>
        <p className="mt-2 text-sm text-muted">Enter ADMIN_SECRET to open the inbox.</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full rounded-lg border border-line bg-background px-3 py-2 text-base sm:text-sm"
            placeholder="Admin secret"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            Sign in
          </button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-5xl flex-col px-4 py-10">
      <h1 className="text-2xl font-extrabold text-foreground">Live chat inbox</h1>
      <p className="mt-1 text-sm text-muted">Realtime via Ably. Email alerts when visitors message.</p>

      <div className="mt-6 grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(0,14rem)_1fr]">
        <aside className="overflow-y-auto rounded-xl border border-line bg-background">
          <ul className="divide-y divide-line">
            {conversations.length === 0 ? (
              <li className="px-3 py-4 text-sm text-muted">No open conversations.</li>
            ) : (
              conversations.map((c) => {
                const visitor = formatVisitorDisplay(c);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full px-3 py-3 text-left text-sm transition-colors hover:bg-muted/10 ${
                        selectedId === c.id ? "bg-accent/10" : ""
                      }`}
                    >
                      <span className="font-semibold text-foreground">
                        {visitor.title}
                        {c.unread ? (
                          <span
                            className="ml-2 inline-block h-2 w-2 rounded-full bg-accent"
                            aria-hidden
                          />
                        ) : null}
                      </span>
                      {visitor.subtitle ? (
                        <span className="mt-0.5 block truncate text-xs text-muted">
                          {visitor.subtitle}
                        </span>
                      ) : null}
                      <span className="mt-1 block truncate text-xs text-muted">
                        {c.lastPreview ?? "—"}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        <section className="flex min-h-[20rem] flex-col rounded-xl border border-line bg-background">
          {!selectedId ? (
            <p className="flex flex-1 items-center justify-center p-6 text-sm text-muted">
              Select a conversation.
            </p>
          ) : (
            <>
              {selectedVisitor ? (
                <div className="border-b border-line px-4 py-3">
                  {selectedConversation?.visitorName ? (
                    <p className="text-sm font-semibold text-foreground">
                      {selectedConversation.visitorName}
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-foreground">{selectedVisitor.title}</p>
                  )}
                  {selectedConversation?.visitorEmail ? (
                    <a
                      href={`mailto:${selectedConversation.visitorEmail}`}
                      className="mt-0.5 block text-xs text-accent hover:underline"
                    >
                      {selectedConversation.visitorEmail}
                    </a>
                  ) : null}
                </div>
              ) : null}
              <div
                ref={listRef}
                onScroll={onScroll}
                className="scrollbar-none min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-4"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      m.sender === "owner"
                        ? "ml-auto bg-accent text-white"
                        : "mr-auto bg-muted/20 text-foreground"
                    }`}
                  >
                    {m.body}
                  </div>
                ))}
              </div>
              <form onSubmit={handleReply} className="border-t border-line p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    maxLength={2000}
                    disabled={loading}
                    placeholder="Reply…"
                    className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-base sm:text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading || !reply.trim()}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
