"use client";

import { useCallback, useEffect, useState } from "react";

type Gap = {
  id: string;
  question: string;
  reason: string;
  suggestedEntry: string | null;
  status: string;
  createdAt: string;
};

export default function AdminKnowledgePage() {
  const [secret, setSecret] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});

  const loadGaps = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/gaps?status=pending", { credentials: "include" });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? `Failed (${res.status})`);
      }
      const json = (await res.json()) as { gaps: Gap[] };
      setGaps(json.gaps);
      const nextEdits: Record<string, string> = {};
      for (const g of json.gaps) {
        nextEdits[g.id] = g.suggestedEntry ?? "";
      }
      setEdits(nextEdits);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) void loadGaps();
  }, [loggedIn, loadGaps]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ secret }),
    });
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setError(json.error ?? "Login failed.");
      return;
    }
    setLoggedIn(true);
  }

  async function act(id: string, action: "approve" | "reject") {
    setError("");
    const res = await fetch("/api/admin/gaps", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id,
        action,
        suggestedEntry: edits[id],
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string; warning?: string };
    if (!res.ok) {
      setError(json.error ?? "Action failed.");
      return;
    }
    if (json.warning) {
      setError(json.warning);
    }
    await loadGaps();
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <h1 className="text-2xl font-bold text-foreground">Knowledge admin</h1>
        <p className="mt-2 text-sm text-muted">Review knowledge gaps before adding to the corpus.</p>
        <form onSubmit={login} className="mt-8 space-y-4">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="ADMIN_SECRET"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-background"
          >
            Sign in
          </button>
        </form>
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Pending knowledge gaps</h1>
        <button
          type="button"
          onClick={() => void loadGaps()}
          className="text-sm font-bold text-accent hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {loading ? <p className="mt-6 text-sm text-muted">Loading…</p> : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      {gaps.length === 0 && !loading ? (
        <p className="mt-8 text-sm text-muted">No pending gaps.</p>
      ) : (
        <ul className="mt-8 space-y-8">
          {gaps.map((g) => (
            <li
              key={g.id}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                {g.reason} · {new Date(g.createdAt).toLocaleString()}
              </p>
              <p className="mt-2 font-semibold text-foreground">{g.question}</p>
              <textarea
                value={edits[g.id] ?? ""}
                onChange={(e) =>
                  setEdits((prev) => ({ ...prev, [g.id]: e.target.value }))
                }
                rows={5}
                className="mt-4 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm"
              />
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => void act(g.id, "approve")}
                  className="rounded-lg bg-accent px-3 py-1.5 text-sm font-bold text-background"
                >
                  Approve and ingest
                </button>
                <button
                  type="button"
                  onClick={() => void act(g.id, "reject")}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-sm font-semibold"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
