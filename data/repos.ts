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
export const repos: RepoShowcase[] = [
  {
    title: "TikTok fleet automation",
    summary:
      "Python scaffold for managing 50-100+ TikTok accounts: Geelark cloud Android phones, Webshare residential proxies, ffmpeg content pipeline (LUT grading, speed/pitch jitter), OpenAI/Gemini caption rewriting, and organic-cadence SQLite scheduler.",
    tags: ["Python", "Geelark", "ffmpeg", "SQLite", "Webshare", "OpenAI"],
    githubUrl: "https://github.com/chunhuduc/tiktok-multi-account-management-geelark",
    demoUrl: "https://chunhuduc.github.io/tiktok-multi-account-management-geelark",
    featured: true,
  },
];
