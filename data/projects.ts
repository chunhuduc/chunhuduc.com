// GENERATED FILE — do not hand-edit.
// Regenerate with `npm run projects:sync` (scripts/sync-projects.ts), which
// pulls each public-repo project's showcase block from its own README (see
// docs/projects/SHOWCASE-FORMAT.md in the SA workspace) and merges it with
// the hand-authored NDA-only entries in `data/projects-nda.ts`.
// Sorted by complexityScore descending; index 0 is the homepage hero card.
import type { ProjectCard } from "./projectCard";
import { projectsNda } from "./projects-nda";

const projectsFromRepos: ProjectCard[] = [
  {
    title: "TikTok fleet automation system",
    summary: "Python system for managing 50-100+ TikTok accounts via Geelark cloud Android phones: per-device hardware fingerprinting, Webshare residential proxies, ffmpeg content pipeline with LUT color grading and speed/pitch jitter, OpenAI/Gemini caption rewriting per country, SQLite scheduler with organic cadence jitter, and in-app posting via Geelark task API.",
    tags: ["Python", "Geelark", "ffmpeg", "SQLite", "Webshare", "OpenAI"],
    href: "https://github.com/chunhuduc/tiktok-multi-account-management-geelark",
    demoUrl: "https://chunhuduc.github.io/tiktok-multi-account-management-geelark",
    outcome: "Manages 50-100+ accounts per deployment with per-device fingerprinting, country-matched proxies, and organic-cadence scheduling.",
    complexityScore: 9,
    motif: { from: "#4338ca", to: "#6ea8ff", icon: "automation" },
    architecture: {
      from: "#4338ca",
      to: "#6ea8ff",
      nodes: [
        { id: "src", label: "Source media", x: 22, y: 12 },
        { id: "ffmpeg", label: "ffmpeg + LUT", x: 22, y: 32, kind: "default" },
        { id: "ai", label: "AI captions", x: 22, y: 52 },
        { id: "sched", label: "SQLite scheduler", x: 55, y: 32, kind: "primary" },
        { id: "proxy", label: "Webshare proxy", x: 82, y: 16 },
        { id: "fleet", label: "Geelark fleet", x: 82, y: 38 },
        { id: "tt", label: "TikTok x50-100", x: 82, y: 56 },
      ],
      edges: [
        { from: "src", to: "ffmpeg", flow: true },
        { from: "ffmpeg", to: "ai", flow: true },
        { from: "ffmpeg", to: "sched", flow: true },
        { from: "ai", to: "sched", flow: true, curve: 6 },
        { from: "sched", to: "fleet", flow: true },
        { from: "proxy", to: "fleet" },
        { from: "fleet", to: "tt", flow: true },
      ],
    },
  },
  {
    title: "PyloMarket",
    summary: "Self-owned Next.js + HarperDB prediction market with Server Actions, GraphQL-defined data model, order-book style trading, JWT/HttpOnly cookie auth, and Solana deposit/withdraw automation. Docker + GitHub Actions deploy to DigitalOcean.",
    tags: ["Next.js", "HarperDB", "TypeScript", "Solana", "Docker", "GitHub Actions"],
    href: "https://github.com/chunhuduc/pylomarket",
    outcome: "Polymarket-style order-book trading with end-to-end Solana wallet automation.",
    complexityScore: 7,
    motif: { from: "#7c3aed", to: "#06b6d4", icon: "web" },
    architecture: {
      from: "#7c3aed",
      to: "#06b6d4",
      nodes: [
        { id: "client", label: "Client / Server Components", x: 18, y: 14 },
        { id: "actions", label: "Server Actions", x: 50, y: 14, kind: "primary" },
        { id: "harperdb", label: "HarperDB", x: 50, y: 50, kind: "store" },
        { id: "auth", label: "JWT / HttpOnly", x: 18, y: 50 },
        { id: "solana", label: "Solana RPC", x: 82, y: 32 },
        { id: "deploy", label: "Docker + GH Actions", x: 82, y: 60 },
      ],
      edges: [
        { from: "client", to: "actions", flow: true },
        { from: "actions", to: "harperdb", flow: true },
        { from: "auth", to: "actions", curve: 4 },
        { from: "actions", to: "solana", flow: true },
        { from: "harperdb", to: "deploy", curve: -4 },
      ],
    },
  },
  {
    title: "CheaterCheck.ai",
    summary: "Turborepo monorepo (Next.js 15 + NestJS) with a Postgres-backed job queue on Neon/Prisma, Ably realtime progress, Stripe Checkout paywall with signature-verified webhooks, and Resend email.",
    tags: ["Next.js", "NestJS", "Turborepo", "Prisma", "Stripe", "Ably"],
    href: "https://github.com/chunhuduc/CheaterCheck.ai",
    outcome: "Postgres job queue with realtime progress and a Stripe-gated report flow.",
    complexityScore: 6,
    motif: { from: "#0891b2", to: "#84cc16", icon: "automation" },
    architecture: {
      from: "#0891b2",
      to: "#84cc16",
      nodes: [
        { id: "web", label: "Next.js web", x: 18, y: 14 },
        { id: "api", label: "NestJS API", x: 50, y: 14, kind: "primary" },
        { id: "db", label: "Postgres (Neon)", x: 50, y: 50, kind: "store" },
        { id: "worker", label: "Crawl worker", x: 82, y: 30 },
        { id: "ably", label: "Ably realtime", x: 18, y: 50 },
        { id: "stripe", label: "Stripe + Resend", x: 82, y: 58 },
      ],
      edges: [
        { from: "web", to: "api", flow: true },
        { from: "api", to: "db", flow: true },
        { from: "db", to: "worker", flow: true, curve: 4 },
        { from: "worker", to: "ably", curve: -6 },
        { from: "ably", to: "web", curve: -4 },
        { from: "api", to: "stripe", flow: true },
      ],
    },
  },
  {
    title: "Chợ Xuân Mai",
    summary: "Hyperlocal marketplace PWA for residents of a single apartment complex to pass along household items and post \"Tôi cần\" (I need) requests, with apartment verification. Next.js + NestJS monorepo, Neon/Drizzle, Ably realtime feed and chat, deployed to Vercel + Cloud Run.",
    tags: ["Next.js", "NestJS", "Drizzle", "Neon", "Ably", "PWA"],
    href: "https://github.com/chunhuduc/choxuanmai.app",
    complexityScore: 6,
    motif: { from: "#db2777", to: "#f97316", icon: "web" },
    architecture: {
      from: "#db2777",
      to: "#f97316",
      nodes: [
        { id: "web", label: "Next.js PWA", x: 18, y: 14 },
        { id: "api", label: "NestJS API", x: 50, y: 14, kind: "primary" },
        { id: "db", label: "Neon + Drizzle", x: 50, y: 50, kind: "store" },
        { id: "ably", label: "Ably realtime", x: 82, y: 22 },
        { id: "verify", label: "Apartment verify", x: 18, y: 50 },
        { id: "ingest", label: "FB ingest crawler", x: 82, y: 58 },
      ],
      edges: [
        { from: "web", to: "api", flow: true },
        { from: "api", to: "db", flow: true },
        { from: "api", to: "ably", flow: true },
        { from: "ably", to: "web", curve: -4 },
        { from: "verify", to: "api", curve: 4 },
        { from: "ingest", to: "db", curve: -4 },
      ],
    },
  },
  {
    title: "stripe-global-payout",
    summary: "Production-style API for Stripe Global Payouts: stores freelancer bank details as recipients and payout methods, moves money via Outbound Payments (v2), with idempotent webhook processing and a country-rail registry.",
    tags: ["Stripe", "Node.js", "TypeScript", "Express", "Neon", "Webhooks"],
    href: "https://github.com/chunhuduc/stripe-global-payout",
    demoUrl: "https://aaron-stripe-payout-api.vercel.app",
    outcome: "Pays international freelancers without onboarding them as Stripe Connect accounts.",
    complexityScore: 5,
    motif: { from: "#16a34a", to: "#65a30d", icon: "automation" },
    architecture: {
      from: "#16a34a",
      to: "#65a30d",
      nodes: [
        { id: "admin", label: "Admin client", x: 18, y: 14 },
        { id: "api", label: "Express API", x: 50, y: 14, kind: "primary" },
        { id: "db", label: "Neon Postgres", x: 50, y: 50, kind: "store" },
        { id: "stripe", label: "Stripe Global Payouts", x: 82, y: 30 },
        { id: "webhook", label: "Webhook + dedupe", x: 18, y: 50 },
      ],
      edges: [
        { from: "admin", to: "api", flow: true },
        { from: "api", to: "db", flow: true },
        { from: "api", to: "stripe", flow: true },
        { from: "stripe", to: "webhook", flow: true, curve: -4 },
        { from: "webhook", to: "db", curve: 4 },
      ],
    },
  },
  {
    title: "ConOi",
    summary: "Personalized daily email from parent to child, tailored by name, age, and interests. Brainstorm docs plus a tested Google Apps Script proof-of-concept; Next.js + Neon + OpenAI build in progress.",
    tags: ["Next.js", "Neon", "OpenAI"],
    href: "https://github.com/chunhuduc/conoi.app",
    complexityScore: 3,
    motif: { from: "#f59e0b", to: "#ec4899", icon: "creator" },
  },
];

export const projects: ProjectCard[] = [...projectsFromRepos, ...projectsNda].sort(
  (a, b) => b.complexityScore - a.complexityScore
);

export type { ProjectCard } from "./projectCard";
