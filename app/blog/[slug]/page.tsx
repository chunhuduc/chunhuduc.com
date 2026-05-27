import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostByline from "@/components/BlogPostByline";
import HomeSurfaceStrip from "@/components/HomeSurfaceStrip";
import MarkdownBody from "@/components/MarkdownBody";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import { createRevealOrders } from "@/lib/revealStagger";
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

  const headerRo = createRevealOrders();
  const linksRo = createRevealOrders();
  const bodyRo = createRevealOrders();

  const bodySurface = links.length > 0 ? "base" : "soft";
  const blogColumn = "mx-auto w-full max-w-3xl lg:max-w-4xl";

  return (
    <article>
      <HomeSurfaceStrip surface="base" kind="firstAfterHero">
        <header>
          <RevealStaggerRoot className={blogColumn}>
          <span
            className="reveal-stagger-item block h-px w-20 bg-foreground"
            aria-hidden
            style={headerRo()}
          />
          <h1
            className="reveal-stagger-item mt-8 text-4xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
            style={headerRo()}
          >
            {post.title}
          </h1>
          {post.summary ? (
            <p
              className="reveal-stagger-item mt-6 text-base leading-relaxed text-muted sm:text-lg"
              style={headerRo()}
            >
              {post.summary}
            </p>
          ) : null}
          </RevealStaggerRoot>
        </header>
      </HomeSurfaceStrip>

      {links.length > 0 ? (
        <HomeSurfaceStrip surface="soft" kind="continuation">
          <aside>
            <RevealStaggerRoot className={blogColumn}>
            <h2
              className="reveal-stagger-item text-xs font-semibold uppercase tracking-[0.2em] text-accent"
              style={linksRo()}
            >
              Related code
            </h2>
            <ul className="reveal-stagger-item mt-4 space-y-2" style={linksRo()}>
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
            </RevealStaggerRoot>
          </aside>
        </HomeSurfaceStrip>
      ) : null}

      <HomeSurfaceStrip surface={bodySurface} kind="closing" compactTop>
        <RevealStaggerRoot className={blogColumn}>
          <BlogPostByline
            date={post.date}
            className="reveal-stagger-item mb-8"
            style={bodyRo()}
          />
          <div className="reveal-stagger-item" style={bodyRo()}>
            <MarkdownBody content={post.content} />
          </div>
        </RevealStaggerRoot>
      </HomeSurfaceStrip>
    </article>
  );
}
