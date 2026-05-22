"use client";

import AltchaWidget from "@/components/AltchaWidget";
import { isLocalhostClient } from "@/lib/altcha-local";
import type { LiveChatMessageDto, LiveChatMessagePayload } from "@/lib/live-chat/types";
import { useChatMessageListScroll } from "@/hooks/useChatMessageListScroll";
import { useLiveChatAbly } from "@/hooks/useLiveChatAbly";
import { playLiveChatSound } from "@/lib/live-chat/play-sound";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  LIVE_CHAT_ALTCHA_SESSION_KEY,
  LIVE_CHAT_ALTCHA_TTL_MS,
  STORAGE_CONVERSATION_ID,
  STORAGE_LAST_READ_AT,
  STORAGE_VISITOR_TOKEN,
} from "./constants";
import { LIVE_CHAT_STARTERS } from "./starters";

const skipAltcha = () => typeof window !== "undefined" && isLocalhostClient();

function isAltchaVerified(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  const raw = sessionStorage.getItem(LIVE_CHAT_ALTCHA_SESSION_KEY);
  if (!raw) return false;
  const until = Number(raw);
  return Number.isFinite(until) && until > Date.now();
}

function markAltchaVerified() {
  sessionStorage.setItem(
    LIVE_CHAT_ALTCHA_SESSION_KEY,
    String(Date.now() + LIVE_CHAT_ALTCHA_TTL_MS),
  );
}

function readStoredSession(): { conversationId: string; visitorToken: string } | null {
  const conversationId = localStorage.getItem(STORAGE_CONVERSATION_ID)?.trim();
  const visitorToken = localStorage.getItem(STORAGE_VISITOR_TOKEN)?.trim();
  if (!conversationId || !visitorToken) return null;
  return { conversationId, visitorToken };
}

function storeSession(conversationId: string, visitorToken: string) {
  localStorage.setItem(STORAGE_CONVERSATION_ID, conversationId);
  localStorage.setItem(STORAGE_VISITOR_TOKEN, visitorToken);
}

function getLastReadAt(): number {
  const raw = localStorage.getItem(STORAGE_LAST_READ_AT);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

function setLastReadAt(ms: number) {
  localStorage.setItem(STORAGE_LAST_READ_AT, String(ms));
}

function countUnreadOwnerMessages(msgs: LiveChatMessageDto[], lastReadAt: number): number {
  return msgs.filter(
    (m) => m.sender === "owner" && new Date(m.createdAt).getTime() > lastReadAt,
  ).length;
}

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorToken, setVisitorToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<LiveChatMessageDto[]>([]);
  const [input, setInput] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAltcha, setShowAltcha] = useState(
    () => !skipAltcha() && !isAltchaVerified(),
  );
  const [altchaKey, setAltchaKey] = useState(0);

  const visitorHasMessaged = messages.some((m) => m.sender === "visitor");

  useEffect(() => {
    if (skipAltcha() || !visitorHasMessaged) return;
    markAltchaVerified();
    setShowAltcha(false);
  }, [visitorHasMessaged]);
  const [ready, setReady] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const openRef = useRef(open);
  openRef.current = open;

  const { listRef, onScroll, forceScrollToBottom } = useChatMessageListScroll(
    messages,
    open && ready,
  );

  const markAllRead = useCallback((msgs: LiveChatMessageDto[]) => {
    const latest = msgs.reduce((max, m) => {
      const t = new Date(m.createdAt).getTime();
      return t > max ? t : max;
    }, Date.now());
    setLastReadAt(latest);
    setUnreadCount(0);
  }, []);

  const appendMessage = useCallback((msg: LiveChatMessageDto) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  const onAblyMessage = useCallback(
    (payload: LiveChatMessagePayload) => {
      const msg: LiveChatMessageDto = {
        id: payload.id,
        sender: payload.sender,
        body: payload.body,
        createdAt: payload.createdAt,
      };
      appendMessage(msg);

      if (payload.sender !== "owner") return;
      const msgAt = new Date(payload.createdAt).getTime();
      if (msgAt <= getLastReadAt()) return;

      const panelOpen = openRef.current;
      if (!panelOpen || document.hidden) {
        setUnreadCount((c) => c + 1);
        playLiveChatSound();
      }
    },
    [appendMessage],
  );

  useLiveChatAbly({
    conversationId,
    visitorToken,
    enabled: Boolean(conversationId),
    onMessage: onAblyMessage,
    mode: "visitor",
  });

  useEffect(() => {
    const stored = readStoredSession();
    if (!stored) return;
    setConversationId(stored.conversationId);
    setVisitorToken(stored.visitorToken);
    void (async () => {
      const params = new URLSearchParams({
        conversationId: stored.conversationId,
        visitorToken: stored.visitorToken,
      });
      const res = await fetch(`/api/live-chat/messages?${params}`);
      if (!res.ok) return;
      const json = (await res.json()) as { messages: LiveChatMessageDto[] };
      const msgs = json.messages ?? [];
      setUnreadCount(countUnreadOwnerMessages(msgs, getLastReadAt()));
    })();
  }, []);

  const ensureConversation = useCallback(async () => {
    const stored = readStoredSession();
    if (stored) {
      setConversationId(stored.conversationId);
      setVisitorToken(stored.visitorToken);
      return stored;
    }

    const res = await fetch("/api/live-chat/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageUrl: typeof window !== "undefined" ? window.location.href : null,
      }),
    });
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(json.error ?? "Could not start chat.");
    }
    const json = (await res.json()) as { conversationId: string; visitorToken: string };
    storeSession(json.conversationId, json.visitorToken);
    setConversationId(json.conversationId);
    setVisitorToken(json.visitorToken);
    return json;
  }, []);

  const loadHistory = useCallback(async (cid: string, token: string) => {
    const params = new URLSearchParams({ conversationId: cid, visitorToken: token });
    const res = await fetch(`/api/live-chat/messages?${params}`);
    if (!res.ok) return;
    const json = (await res.json()) as { messages: LiveChatMessageDto[] };
    const msgs = json.messages ?? [];
    setMessages(msgs);
    return msgs;
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setError("");
      try {
        const session = await ensureConversation();
        if (cancelled) return;
        const msgs = await loadHistory(session.conversationId, session.visitorToken);
        if (!cancelled) {
          markAllRead(msgs ?? []);
          setReady(true);
          requestAnimationFrame(() => forceScrollToBottom());
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Chat unavailable.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, ensureConversation, loadHistory, markAllRead, forceScrollToBottom]);

  useEffect(() => {
    if (!open || messages.length === 0) return;
    markAllRead(messages);
  }, [open, messages, markAllRead]);

  async function sendMessage(text: string, altcha: string) {
    if (!conversationId || !visitorToken || !text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/live-chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          visitorToken,
          body: text.trim(),
          altcha: altcha || undefined,
          visitorName: visitorName.trim() || undefined,
          visitorEmail: visitorEmail.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Send failed.");
      }
      const json = (await res.json()) as { message: LiveChatMessageDto };
      appendMessage(json.message);
      requestAnimationFrame(() => forceScrollToBottom());
      setInput("");
      if (!skipAltcha()) {
        markAltchaVerified();
        setShowAltcha(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const form = e.currentTarget;
    const altchaInput = form.querySelector<HTMLInputElement>('input[name="altcha"]');
    const altcha = altchaInput?.value?.trim() ?? "";

    if (!skipAltcha() && !isAltchaVerified() && !visitorHasMessaged) {
      if (!altcha) {
        setError("Complete the verification challenge before sending.");
        return;
      }
    }

    void sendMessage(input, altcha);
  }

  function handleStarter(text: string) {
    setInput(text);
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end sm:bottom-6 sm:right-6">
      {open ? (
        <div
          className="live-chat-panel pointer-events-auto mb-3 flex h-[min(32rem,70dvh)] w-[min(100vw-2rem,22rem)] touch-manipulation flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0f1115]/95 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md"
          role="dialog"
          aria-label="Chat with Đức"
        >
          <header className="flex items-start justify-between gap-2 border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-hero-foreground">Chat with Đức</p>
              <p className="mt-0.5 text-xs leading-snug text-hero-muted">
                You're talking to me directly, not a bot. I get notified when you message and reply as soon as I can.
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-hero-muted transition-colors hover:bg-white/10 hover:text-hero-foreground"
              aria-label="Close chat"
              onClick={() => {
                markAllRead(messages);
                setOpen(false);
              }}
            >
              ✕
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
            {messages.length === 0 && ready ? (
              <div className="mb-3">
                <p className="text-xs font-semibold text-hero-muted">Suggestions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LIVE_CHAT_STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={loading}
                      onClick={() => handleStarter(s)}
                      className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-left text-xs font-semibold text-hero-foreground/90 transition-colors hover:border-accent/30 hover:bg-white/[0.08] disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div
              ref={listRef}
              onScroll={onScroll}
              className="scrollbar-none min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    m.sender === "visitor"
                      ? "ml-auto bg-accent/90 text-white"
                      : "mr-auto bg-white/10 text-hero-foreground"
                  }`}
                >
                  {m.body}
                </div>
              ))}
            </div>

            {messages.length > 0 || !ready ? null : (
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-base text-hero-foreground placeholder:text-hero-muted sm:text-sm"
                  maxLength={120}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-base text-hero-foreground placeholder:text-hero-muted sm:text-sm"
                  maxLength={254}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-3 shrink-0">
              {showAltcha ? (
                <div className="mb-2">
                  <AltchaWidget disabled={loading} resetKey={altchaKey} />
                </div>
              ) : null}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={2000}
                  disabled={loading || !ready}
                  placeholder="Type a message…"
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-base text-hero-foreground placeholder:text-hero-muted focus:border-accent/50 focus:outline-none sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !ready || !input.trim()}
                  className="shrink-0 rounded-lg bg-accent px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
              {error ? (
                <p className="mt-2 text-xs text-red-400" role="alert">
                  {error}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (open) {
            markAllRead(messages);
            setOpen(false);
          } else {
            setOpen(true);
          }
        }}
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_28px_rgba(31,75,130,0.55)] transition-transform hover:scale-105"
        aria-label={
          open
            ? "Close chat"
            : unreadCount > 0
              ? `Open chat, ${unreadCount} new message${unreadCount === 1 ? "" : "s"}`
              : "Open chat"
        }
        aria-expanded={open}
      >
        {!open && unreadCount > 0 ? (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#0f1115]"
            aria-hidden
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          {open ? (
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          )}
        </svg>
      </button>
    </div>
  );
}
