import type { ProjectCard } from "./projectCard";

/**
 * NDA-protected projects with no public repo to source a showcase block
 * from (see `docs/projects/SHOWCASE-FORMAT.md` in the SA workspace).
 * Hand-authored, never touched by `npm run projects:sync`.
 */
export const projectsNda: ProjectCard[] = [
  {
    title: "Middle-East Philanthropy web initiative",
    summary:
      "Modern bilingual EN/AR experience with RTL, Sitecore XM Cloud + Next.js, Vercel and CDN-backed delivery. Editorial scalability, reusable components, roadmap hooks toward CRM/API integrations.",
    tags: ["Sitecore XM Cloud", "Next.js", "Vercel", "RTL", "Composable CMS"],
    outcome:
      "Enterprise multilingual platform serving EN/AR audiences with Sitecore XM Cloud and global CDN delivery.",
    complexityScore: 7,
    motif: { from: "#0f766e", to: "#22d3ee", icon: "web" },
    architecture: {
      from: "#0f766e",
      to: "#22d3ee",
      nodes: [
        { id: "cms", label: "XM Cloud", x: 20, y: 14, kind: "store" },
        { id: "next", label: "Next.js SSR", x: 50, y: 32, kind: "primary" },
        { id: "cdn", label: "Global CDN", x: 50, y: 54 },
        { id: "en", label: "EN audience", x: 82, y: 42 },
        { id: "ar", label: "AR / RTL", x: 82, y: 64 },
        { id: "crm", label: "CRM / API", x: 20, y: 50, kind: "store" },
      ],
      edges: [
        { from: "cms", to: "next", flow: true },
        { from: "crm", to: "next", flow: true, curve: 4 },
        { from: "next", to: "cdn", flow: true },
        { from: "cdn", to: "en", flow: true },
        { from: "cdn", to: "ar", flow: true },
      ],
    },
  },
  {
    title: "Premium streaming token enforcement",
    summary:
      "Multi-region access control using Akamai media delivery plus HarperDB for high-throughput token state; mitigation for shared or reused tokens and abuse vectors near legitimate playback flows.",
    tags: ["Akamai", "HarperDB", "CDN", "Streaming security", "Architecture"],
    outcome:
      "Multi-region abuse mitigation protecting premium content at CDN edge across millions of playback sessions.",
    complexityScore: 8,
    motif: { from: "#6d28d9", to: "#c026d3", icon: "streaming" },
    architecture: {
      from: "#6d28d9",
      to: "#c026d3",
      nodes: [
        { id: "viewer", label: "Viewer", x: 18, y: 14 },
        { id: "edge", label: "Akamai edge", x: 50, y: 14, kind: "primary" },
        { id: "token", label: "Token check", x: 50, y: 36 },
        { id: "state", label: "HarperDB state", x: 50, y: 58, kind: "store" },
        { id: "content", label: "Premium content", x: 82, y: 14 },
        { id: "deny", label: "Abuse block", x: 82, y: 47 },
      ],
      edges: [
        { from: "viewer", to: "edge", flow: true },
        { from: "edge", to: "token", flow: true },
        { from: "token", to: "state" },
        { from: "state", to: "token" },
        { from: "edge", to: "content", flow: true },
        { from: "token", to: "deny", curve: -5 },
      ],
    },
  },
  {
    title: "Creator automation pipelines",
    summary:
      "Python tooling for individual TikTok creators: Playwright/Selenium uploads, FFmpeg/MoviePy processing, OpenAI + Whisper assisted captions and scripting.",
    tags: ["Python", "Automation", "OpenAI", "Playwright"],
    outcome:
      "End-to-end pipeline from source scrape to published post — hands-free for individual creators.",
    complexityScore: 6,
    motif: { from: "#ea580c", to: "#e11d48", icon: "creator" },
    architecture: {
      from: "#ea580c",
      to: "#e11d48",
      nodes: [
        { id: "scrape", label: "Source scrape", x: 20, y: 14 },
        { id: "proc", label: "FFmpeg / MoviePy", x: 20, y: 36, kind: "default" },
        { id: "whisper", label: "Whisper + GPT", x: 20, y: 58 },
        { id: "orch", label: "Orchestrator", x: 54, y: 36, kind: "primary" },
        { id: "browser", label: "Playwright", x: 84, y: 26 },
        { id: "post", label: "Published post", x: 84, y: 50 },
      ],
      edges: [
        { from: "scrape", to: "proc", flow: true },
        { from: "proc", to: "whisper", flow: true },
        { from: "proc", to: "orch", flow: true },
        { from: "whisper", to: "orch", flow: true, curve: 6 },
        { from: "orch", to: "browser", flow: true },
        { from: "browser", to: "post", flow: true },
      ],
    },
  },
];
