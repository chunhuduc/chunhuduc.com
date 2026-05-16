import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostFrontmatter = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  /** `owner/repo` */
  repo?: string;
  relatedRepos?: string[];
};

const postsDirectory = path.join(process.cwd(), "content/blog");

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): PostFrontmatter & { content: string } {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing post: ${slug}`);
  }
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    summary: data.summary != null ? String(data.summary) : undefined,
    repo: data.repo != null ? String(data.repo) : undefined,
    relatedRepos: Array.isArray(data.relatedRepos)
      ? data.relatedRepos.map(String)
      : undefined,
    content,
  };
}

export function getAllPostsMeta(): PostFrontmatter[] {
  return getPostSlugs().map((slug) => {
    const post = getPostBySlug(slug);
    return {
      slug: post.slug,
      title: post.title,
      date: post.date,
      summary: post.summary,
      repo: post.repo,
      relatedRepos: post.relatedRepos,
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPosts(): (PostFrontmatter & { content: string })[] {
  return getPostSlugs()
    .map(getPostBySlug)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
