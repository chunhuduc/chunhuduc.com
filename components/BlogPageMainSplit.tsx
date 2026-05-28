import type { CSSProperties, ReactNode } from "react";
import BlogArticlesSection from "@/components/BlogArticlesSection";
import BlogPageAside from "@/components/BlogPageAside";
import {
  STRIP_VERTICAL,
  SURFACE,
  type HomeSurfaceStripKind,
} from "@/components/HomeSurfaceStrip";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import { HEADER_BLEED_ID } from "@/lib/headerBleed";
import type { PostFrontmatter } from "@/lib/posts";

/** Equal halves: full column width with symmetric inset on lg+. */
const SPLIT_INNER =
  "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:max-w-none lg:px-10 xl:px-14 2xl:px-16";

type SplitPanelProps = {
  surface: keyof typeof SURFACE;
  kind: HomeSurfaceStripKind;
  innerClassName?: string;
  children: ReactNode;
};

function SplitPanel({ surface, kind, innerClassName = "", children }: SplitPanelProps) {
  return (
    <section
      className={`${SURFACE[surface]} text-foreground ${STRIP_VERTICAL[kind]} min-w-0 lg:flex lg:min-h-dvh lg:flex-col lg:justify-center`.trim()}
    >
      <div className={`${SPLIT_INNER} ${innerClassName}`.trim()}>{children}</div>
    </section>
  );
}

type Props = {
  posts: PostFrontmatter[];
  articlesRo: () => CSSProperties;
  asideRo: () => CSSProperties;
};

/**
 * Blog index hero: two alternating surfaces.
 * Mobile — stacked bands; desktop — side-by-side columns (50/50) with matching stripe colors.
 */
export default function BlogPageMainSplit({ posts, articlesRo, asideRo }: Props) {
  const articles = (
    <RevealStaggerRoot as="section">
      <BlogArticlesSection
        posts={posts}
        ro={articlesRo}
        layout="stacked"
        heading="Blog & articles"
        showSectionLabel={false}
        typography="feature"
        limit={2}
      />
    </RevealStaggerRoot>
  );

  const aside = (
    <RevealStaggerRoot as="section">
      <BlogPageAside ro={asideRo} variant="flat" />
    </RevealStaggerRoot>
  );

  return (
    <div id={HEADER_BLEED_ID} className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch">
      <SplitPanel
        surface="base"
        kind="firstAfterHero"
        innerClassName="max-lg:pt-[4.75rem] sm:max-lg:pt-[4.875rem]"
      >
        {articles}
      </SplitPanel>
      <SplitPanel surface="soft" kind="continuation">
        {aside}
      </SplitPanel>
    </div>
  );
}
