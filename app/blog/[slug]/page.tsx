import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownBody from "@/components/MarkdownBody";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

function githubRepoUrl(repo: string) {
  return `https://github.com/${repo}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.summary ?? post.title,
      openGraph: {
        title: post.title,
        description: post.summary ?? post.title,
        url: `https://chunhuduc.com/blog/${slug}`,
        type: "article",
        publishedTime: post.date,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const links: { label: string; href: string }[] = [];
  if (post.repo) links.push({ label: post.repo, href: githubRepoUrl(post.repo) });
  post.relatedRepos?.forEach((r) => links.push({ label: r, href: githubRepoUrl(r) }));

  return (
    <article className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <Link href="/blog" className="text-sm font-semibold text-accent hover:opacity-90">
        Back to blog
      </Link>
      <header className="mt-6">
        <p className="text-sm font-medium text-muted">{post.date}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-foreground">
          {post.title}
        </h1>
        {post.summary ? (
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.summary}</p>
        ) : null}
      </header>

      {links.length > 0 ? (
        <aside className="mt-10 rounded-xl border border-white/10 bg-white/[0.05] p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-accent">
            Related code
          </h2>
          <ul className="mt-3 space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-medium text-accent hover:opacity-90"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      <div className="mt-10">
        <MarkdownBody content={post.content} />
      </div>
    </article>
  );
}
