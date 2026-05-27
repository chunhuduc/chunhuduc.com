import Link from "next/link";
import type { CSSProperties } from "react";
import SectionLabel from "@/components/SectionLabel";
import { formatPostDateTime } from "@/lib/formatPostDate";
import type { PostFrontmatter } from "@/lib/posts";

type RevealOrder = () => CSSProperties;

/** Default preview cap for home and other previews. */
export const BLOG_ARTICLES_PREVIEW_DEFAULT = 3;

type Props = {
  posts: PostFrontmatter[];
  /** Pass `createRevealOrders()` for scroll reveal stagger on children */
  ro?: RevealOrder;
  /** Max posts to show; default {@link BLOG_ARTICLES_PREVIEW_DEFAULT}. Pass `null` for no cap. */
  limit?: number | null;
  showBrowseLink?: boolean;
  /** `split`: header left + list right (home). `stacked`: header above list (blog page) */
  layout?: "split" | "stacked";
  showSectionLabel?: boolean;
  heading?: string;
  className?: string;
};

const DEFAULT_HEADING = "Check out my latest articles and tutorials";

function formatListDate(raw: string) {
  const { dateTime, label } = formatPostDateTime(raw);
  return { dateTime, label: label.toUpperCase() };
}

function BlogArticlesList({
  posts,
  ro,
  listClassName = "",
}: {
  posts: PostFrontmatter[];
  ro?: RevealOrder;
  listClassName?: string;
}) {
  if (posts.length === 0) {
    return (
      <p className={`reveal-stagger-item text-sm text-muted lg:pt-1 ${listClassName}`.trim()} style={ro?.()}>
        No posts yet.
      </p>
    );
  }

  return (
    <ul className={`m-0 list-none space-y-0 p-0 ${listClassName}`.trim()}>
      {posts.map((post, idx) => {
        const { dateTime, label } = formatListDate(post.date);
        return (
          <li
            key={post.slug}
            className={`reveal-stagger-item ${idx > 0 ? "mt-10 border-t border-[#3f444e] pt-10" : "lg:pt-1"}`}
            style={ro?.()}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                <time dateTime={dateTime}>{label}</time>{" "}
                <span className="text-accent">/ Articles</span>
              </p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold uppercase leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent lg:text-xl">
                  {post.title}
                </h3>
                <span
                  className="mt-1 shrink-0 text-sm font-bold text-muted transition-colors group-hover:text-accent"
                  aria-hidden
                >
                  →
                </span>
              </div>
              {post.summary ? (
                <p className="mt-4 text-sm leading-relaxed text-muted">{post.summary}</p>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function BlogArticlesHeader({
  ro,
  heading,
  showBrowseLink,
  showSectionLabel,
  className = "",
}: {
  ro?: RevealOrder;
  heading: string;
  showBrowseLink: boolean;
  showSectionLabel: boolean;
  className?: string;
}) {
  return (
    <header className={className}>
      {showSectionLabel ? (
        <SectionLabel className="reveal-stagger-item" style={ro?.()}>
          Blog & articles
        </SectionLabel>
      ) : null}
      <h2
        className="reveal-stagger-item text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        style={ro?.()}
      >
        {heading}
      </h2>
      {showBrowseLink ? (
        <Link
          href="/blog"
          className="reveal-stagger-item mt-8 inline-block text-sm font-bold text-accent transition-opacity hover:opacity-90"
          style={ro?.()}
        >
          Browse all articles -&gt;
        </Link>
      ) : null}
    </header>
  );
}

/** Blog index block: section label, heading, optional browse link, and article list. */
export default function BlogArticlesSection({
  posts,
  ro,
  limit = BLOG_ARTICLES_PREVIEW_DEFAULT,
  showBrowseLink = false,
  showSectionLabel = true,
  layout = "split",
  heading = DEFAULT_HEADING,
  className = "",
}: Props) {
  const visiblePosts = limit == null ? posts : posts.slice(0, limit);

  if (layout === "stacked") {
    return (
      <div className={className}>
        <BlogArticlesHeader ro={ro} heading={heading} showBrowseLink={showBrowseLink} showSectionLabel={showSectionLabel} />
        <BlogArticlesList posts={visiblePosts} ro={ro} listClassName="mt-12" />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-14 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-14 xl:gap-x-[4.25rem] ${className}`.trim()}
    >
      <BlogArticlesHeader
        ro={ro}
        heading={heading}
        showBrowseLink={showBrowseLink}
        showSectionLabel={showSectionLabel}
        className="max-lg:max-w-xl lg:col-span-5"
      />
      <div className="lg:col-span-7">
        <BlogArticlesList posts={visiblePosts} ro={ro} />
      </div>
    </div>
  );
}
