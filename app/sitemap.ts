import type { MetadataRoute } from "next";
import { getAllPostsMeta } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://chunhuduc.com";
  const posts = getAllPostsMeta();
  const fixed = ["", "/experience", "/projects", "/blog"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const blog = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: (() => {
      const d = new Date(p.date);
      return Number.isNaN(d.getTime()) ? new Date() : d;
    })(),
  }));
  return [...fixed, ...blog];
}
