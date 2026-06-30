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
  {
    title: "PyloMarket",
    summary:
      "Self-owned Next.js + HarperDB prediction market with Server Actions, GraphQL-defined data model, order-book style trading, JWT/HttpOnly cookie auth, and Solana deposit/withdraw automation. Docker + GitHub Actions deploy to DigitalOcean.",
    tags: ["Next.js", "HarperDB", "TypeScript", "Solana", "Docker", "GitHub Actions"],
    githubUrl: "https://github.com/chunhuduc/pylomarket",
    featured: true,
  },
  {
    title: "CheaterCheck.ai",
    summary:
      "Turborepo monorepo (Next.js 15 + NestJS) with a Postgres-backed job queue on Neon/Prisma, Ably realtime progress, Stripe Checkout paywall with signature-verified webhooks, and Resend email.",
    tags: ["Next.js", "NestJS", "Turborepo", "Prisma", "Stripe", "Ably"],
    githubUrl: "https://github.com/chunhuduc/CheaterCheck.ai",
  },
  {
    title: "stripe-global-payout",
    summary: "Portfolio reference API demonstrating Stripe Global Payouts integration.",
    tags: ["Stripe", "Express", "API"],
    githubUrl: "https://github.com/chunhuduc/stripe-global-payout",
  },
  {
    title: "Chợ Xuân Mai",
    summary:
      "Hyperlocal marketplace for residents of a single apartment complex to pass along household items and post \"Tôi cần\" (I need) requests, separated from generic Facebook food-listing noise.",
    tags: ["Next.js", "Marketplace", "Side project"],
    githubUrl: "https://github.com/chunhuduc/choxuanmai.app",
  },
  {
    title: "ConOi",
    summary:
      "Personalized daily email from parent to child, tailored by name, age, and interests. Brainstorm docs plus a tested Google Apps Script proof-of-concept; Next.js + Neon + OpenAI build in progress.",
    tags: ["Next.js", "Neon", "OpenAI", "Side project"],
    githubUrl: "https://github.com/chunhuduc/conoi.app",
  },
];
