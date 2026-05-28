"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

type PostStats = {
  delivered: number;
  failed: number;
  pending: number;
  sent: number;
  bounced: number;
  complained: number;
  total: number;
};

type PostRow = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  firstPublishedAt: string | null;
  lastPublishAt: string | null;
  publishCount: number;
  stats: PostStats;
};

type DeliveryRow = {
  id: string;
  email: string;
  status: string;
  resendEmailId: string | null;
  errorMessage: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  updatedAt: string;
};

export default function AdminNewsletterPage() {
  const [secret, setSecret] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [totalActiveSubscribers, setTotalActiveSubscribers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);
  const [publishingSlug, setPublishingSlug] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/newsletter/posts", { credentials: "include" });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? `Failed (${res.status})`);
      }
      const json = (await res.json()) as {
        posts: PostRow[];
        totalActiveSubscribers: number;
      };
      setPosts(json.posts);
      setTotalActiveSubscribers(json.totalActiveSubscribers);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDeliveries = useCallback(async (slug: string) => {
    setDeliveriesLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/newsletter/posts/${encodeURIComponent(slug)}/deliveries`, {
        credentials: "include",
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? `Failed (${res.status})`);
      }
      const json = (await res.json()) as { deliveries: DeliveryRow[] };
      setDeliveries(json.deliveries);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load deliveries failed.");
      setDeliveries([]);
    } finally {
      setDeliveriesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) void loadPosts();
  }, [loggedIn, loadPosts]);

  useEffect(() => {
    if (loggedIn && expandedSlug) {
      void loadDeliveries(expandedSlug);
      void loadPosts();
    }
  }, [loggedIn, expandedSlug, loadDeliveries, loadPosts]);

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

  async function publish(slug: string, title: string) {
    if (
      !window.confirm(
        `Publish newsletter for “${title}” to all active subscribers?`,
      )
    ) {
      return;
    }

    setPublishingSlug(slug);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/newsletter/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        sent?: number;
        skipped?: number;
        failed?: number;
      };
      if (!res.ok) {
        throw new Error(json.error ?? `Publish failed (${res.status})`);
      }
      setMessage(
        `Published ${slug}: sent ${json.sent ?? 0}, skipped ${json.skipped ?? 0}, failed ${json.failed ?? 0}.`,
      );
      await loadPosts();
      if (expandedSlug === slug) {
        await loadDeliveries(slug);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed.");
    } finally {
      setPublishingSlug(null);
    }
  }

  function toggleExpanded(slug: string) {
    setExpandedSlug((current) => (current === slug ? null : slug));
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <h1 className="text-2xl font-bold text-foreground">Newsletter admin</h1>
        <p className="mt-2 text-sm text-muted">
          Publish blog posts to subscribers and review delivery status.
        </p>
        <form onSubmit={login} className="mt-8 space-y-4">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="ADMIN_SECRET"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-base sm:text-sm"
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
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Newsletter</h1>
          <p className="mt-1 text-sm text-muted">
            {totalActiveSubscribers} active subscriber
            {totalActiveSubscribers === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadPosts()}
          className="text-sm font-bold text-accent hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {loading ? <p className="mt-6 text-sm text-muted">Loading…</p> : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-foreground/90">{message}</p> : null}

      {posts.length === 0 && !loading ? (
        <p className="mt-8 text-sm text-muted">No blog posts found.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wide text-muted">
                <th className="py-3 pr-4">Post</th>
                <th className="py-3 pr-4">Delivered</th>
                <th className="py-3 pr-4">Sent</th>
                <th className="py-3 pr-4">Pending</th>
                <th className="py-3 pr-4">Failed</th>
                <th className="py-3 pr-4">Publishes</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const expanded = expandedSlug === post.slug;
                return (
                  <Fragment key={post.slug}>
                    <tr className="border-b border-white/5 align-top">
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-foreground">{post.title}</p>
                        <p className="mt-1 text-xs text-muted">{post.slug}</p>
                      </td>
                      <td className="py-4 pr-4">{post.stats.delivered}</td>
                      <td className="py-4 pr-4">{post.stats.sent}</td>
                      <td className="py-4 pr-4">{post.stats.pending}</td>
                      <td className="py-4 pr-4">{post.stats.failed}</td>
                      <td className="py-4 pr-4">{post.publishCount}</td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => void publish(post.slug, post.title)}
                            disabled={publishingSlug === post.slug}
                            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-background disabled:opacity-50"
                          >
                            {publishingSlug === post.slug ? "Publishing…" : "Publish"}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleExpanded(post.slug)}
                            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold"
                          >
                            {expanded ? "Hide" : "Deliveries"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded ? (
                      <tr className="border-b border-white/5">
                        <td colSpan={7} className="pb-6 pt-2">
                          {deliveriesLoading ? (
                            <p className="text-xs text-muted">Loading deliveries…</p>
                          ) : deliveries.length === 0 ? (
                            <p className="text-xs text-muted">No deliveries yet.</p>
                          ) : (
                            <ul className="space-y-2">
                              {deliveries.map((d) => (
                                <li
                                  key={d.id}
                                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs"
                                >
                                  <span className="font-medium text-foreground">{d.email}</span>
                                  <span className="text-muted">{d.status}</span>
                                  {d.errorMessage ? (
                                    <span className="text-red-400">{d.errorMessage}</span>
                                  ) : null}
                                  {d.deliveredAt ? (
                                    <span className="text-muted">
                                      delivered {new Date(d.deliveredAt).toLocaleString()}
                                    </span>
                                  ) : d.sentAt ? (
                                    <span className="text-muted">
                                      sent {new Date(d.sentAt).toLocaleString()}
                                    </span>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
