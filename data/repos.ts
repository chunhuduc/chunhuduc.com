export type RepoShowcase = {
  title: string;
  summary: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
};

/**
 * Curated GitHub repos for `/projects`. Add rows when public repos exist.
 * Blog posts can link related repos via frontmatter (`repo`, `relatedRepos`).
 */
export const repos: RepoShowcase[] = [];
