import type { Metadata } from "next";
import BlogPageMainSplit from "@/components/BlogPageMainSplit";
import BlogPagePlaceholderSection from "@/components/BlogPagePlaceholderSection";
import HomeSurfaceStrip from "@/components/HomeSurfaceStrip";
import RevealStaggerRoot from "@/components/RevealStaggerRoot";
import { createRevealOrders } from "@/lib/revealStagger";
import { getAllPostsMeta } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Architecture notes, integration checklists, and delivery patterns.",
};

export default function BlogPage() {
  const posts = getAllPostsMeta();
  const articlesRo = createRevealOrders();
  const asideRo = createRevealOrders();
  const placeholderRo = createRevealOrders();

  return (
    <>
      <BlogPageMainSplit posts={posts} articlesRo={articlesRo} asideRo={asideRo} />

      <HomeSurfaceStrip surface="base" kind="closing" topSeparator>
        <RevealStaggerRoot as="section">
          <BlogPagePlaceholderSection ro={placeholderRo} />
        </RevealStaggerRoot>
      </HomeSurfaceStrip>
    </>
  );
}
