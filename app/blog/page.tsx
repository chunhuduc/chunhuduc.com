import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Architecture notes, integration checklists, and delivery patterns.",
};

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Blog</h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Short posts on systems design, integrations, and tooling. Written in Markdown under{" "}
          <code className="rounded bg-white/12 px-1 font-mono text-sm">content/blog</code>.
        </p>
      </header>

      <ul className="mt-12 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block px-4 py-5 transition-colors hover:bg-white/[0.06] sm:px-6"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{post.date}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{post.title}</p>
              {post.summary ? (
                <p className="mt-1 text-sm leading-relaxed text-muted">{post.summary}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
