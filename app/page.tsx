import Link from "next/link";
import { profile } from "@/data/profile";
import { getAllPostsMeta } from "@/lib/posts";

export default function Home() {
  const posts = getAllPostsMeta().slice(0, 3);
  const gh = profile.social.github?.trim();
  const li = profile.social.linkedin?.trim();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Portfolio
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-2 text-lg font-medium text-muted">{profile.headline}</p>
        <p className="mt-1 text-base text-muted">{profile.subline}</p>
        <p className="mt-6 text-base leading-relaxed text-foreground/90">
          {profile.aboutLead}
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/90">
          {profile.aboutFocus}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            href={`mailto:${profile.email}`}
          >
            Email me
          </a>
          {gh ? (
            <a
              className="inline-flex items-center justify-center rounded-lg border border-line bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/50"
              href={gh}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          ) : null}
          {li ? (
            <a
              className="inline-flex items-center justify-center rounded-lg border border-line bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/50"
              href={li}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          ) : null}
          <Link
            href="/experience"
            className="inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2.5 text-sm font-semibold text-accent underline decoration-line underline-offset-4 hover:opacity-90"
          >
            Full experience
          </Link>
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-line bg-white/60 p-6 shadow-[0_8px_24px_rgba(18,20,23,0.06)] sm:p-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-accent">
          Currently
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
          <span className="font-semibold text-foreground">Solution Architect</span>{" "}
          at FPT Software · {profile.location} · {profile.englishNote}
        </p>
        <p className="mt-2 text-sm text-muted">
          Stack emphasis: composable web (Sitecore XM Cloud, Next.js, Vercel/CDN), streaming
          delivery security patterns (Akamai, token enforcement), Node.js and TypeScript systems.
        </p>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Latest writing
          </h2>
          <Link href="/blog" className="text-sm font-semibold text-accent hover:opacity-90">
            View all
          </Link>
        </div>
        <ul className="mt-6 divide-y divide-line border border-line rounded-xl bg-white/40">
          {posts.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted">No posts yet.</li>
          ) : (
            posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block px-4 py-5 transition-colors hover:bg-line/30 sm:px-6"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {post.date}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{post.title}</p>
                  {post.summary ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted">{post.summary}</p>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
