import Link from "next/link";
import type { CSSProperties } from "react";
import SectionLabel from "@/components/SectionLabel";
import { formatPostDateTime } from "@/lib/formatPostDate";
import type { PostFrontmatter } from "@/lib/posts";

type RevealOrder = () => CSSProperties;

/** Default preview cap for home and other previews. */
export const BLOG_ARTICLES_PREVIEW_DEFAULT = 3;

/** Slightly larger type for full-width feature columns (e.g. /blog split). */
export type BlogArticlesTypography = "default" | "feature";

const TYPOGRAPHY: Record<
  BlogArticlesTypography,
  {
    heading: string;
    browse: string;
    meta: string;
    title: string;
    arrow: string;
    summary: string;
    empty: string;
  }
> = {
  default: {
    heading: "text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl",
    browse:
      "reveal-stagger-item mt-8 inline-block text-sm font-bold text-accent transition-opacity hover:opacity-90",
    meta: "text-[11px] font-bold uppercase tracking-[0.2em] text-muted",
    title:
      "text-lg font-bold uppercase leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent lg:text-xl",
    arrow: "mt-1 shrink-0 text-sm font-bold text-muted transition-colors group-hover:text-accent",
    summary: "mt-4 text-sm leading-relaxed text-muted",
    empty: "text-sm text-muted",
  },
  feature: {
    heading:
      "text-[2rem] font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]",
    browse:
      "reveal-stagger-item mt-8 inline-block text-base font-bold text-accent transition-opacity hover:opacity-90",
    meta: "text-xs font-bold uppercase tracking-[0.2em] text-muted",
    title:
      "text-xl font-bold uppercase leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent lg:text-2xl",
    arrow: "mt-1 shrink-0 text-base font-bold text-muted transition-colors group-hover:text-accent",
    summary: "mt-4 text-sm leading-relaxed text-muted sm:text-base",
    empty: "text-base text-muted",
  },
};

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
  /** `feature`: larger type for hero-style columns; default elsewhere */
  typography?: BlogArticlesTypography;
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
  typography = "default",
}: {
  posts: PostFrontmatter[];
  ro?: RevealOrder;
  listClassName?: string;
  typography?: BlogArticlesTypography;
}) {
  const t = TYPOGRAPHY[typography];

  if (posts.length === 0) {
    return (
      <p className={`reveal-stagger-item lg:pt-1 ${t.empty} ${listClassName}`.trim()} style={ro?.()}>
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
              <p className={t.meta}>
                <time dateTime={dateTime}>{label}</time>{" "}
                <span className="text-accent">/ Articles</span>
              </p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h3 className={t.title}>{post.title}</h3>
                <span className={t.arrow} aria-hidden>
                  →
                </span>
              </div>
              {post.summary ? <p className={t.summary}>{post.summary}</p> : null}
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
  typography = "default",
  className = "",
}: {
  ro?: RevealOrder;
  heading: string;
  showBrowseLink: boolean;
  showSectionLabel: boolean;
  typography?: BlogArticlesTypography;
  className?: string;
}) {
  const t = TYPOGRAPHY[typography];

  return (
    <header className={className}>
      {showSectionLabel ? (
        <SectionLabel className="reveal-stagger-item" style={ro?.()}>
          Blog & articles
        </SectionLabel>
      ) : null}
      <h2 className={`reveal-stagger-item ${t.heading}`} style={ro?.()}>
        {heading}
      </h2>
      {showBrowseLink ? (
        <Link href="/blog" className={t.browse} style={ro?.()}>
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
  typography = "default",
  heading = DEFAULT_HEADING,
  className = "",
}: Props) {
  const visiblePosts = limit == null ? posts : posts.slice(0, limit);

  if (layout === "stacked") {
    return (
      <div className={className}>
        <BlogArticlesHeader
          ro={ro}
          heading={heading}
          showBrowseLink={showBrowseLink}
          showSectionLabel={showSectionLabel}
          typography={typography}
        />
        <BlogArticlesList
          posts={visiblePosts}
          ro={ro}
          typography={typography}
          listClassName="mt-12"
        />
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
        typography={typography}
        className="max-lg:max-w-xl lg:col-span-5"
      />
      <div className="lg:col-span-7">
        <BlogArticlesList posts={visiblePosts} ro={ro} typography={typography} />
      </div>
    </div>
  );
}
