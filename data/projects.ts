import type { ProjectMotifData } from "@/components/ProjectMotif";

export type ProjectCard = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  demoUrl?: string;
  featured?: boolean;
  outcome?: string;
  motif?: ProjectMotifData;
};

/** NDA-safe initiative summaries aligned with private workspace distill (`SUMMARIES.md`). */
export const projects: ProjectCard[] = [
  {
    title: "TikTok fleet automation system",
    summary:
      "Python system for managing 50-100+ TikTok accounts via Geelark cloud Android phones: per-device hardware fingerprinting, Webshare residential proxies, ffmpeg content pipeline with LUT color grading and speed/pitch jitter, OpenAI/Gemini caption rewriting per country, SQLite scheduler with organic cadence jitter, and in-app posting via Geelark task API.",
    tags: ["Python", "Geelark", "ffmpeg", "SQLite", "Webshare", "OpenAI"],
    href: "https://github.com/chunhuduc/tiktok-multi-account-management-geelark",
    demoUrl: "https://chunhuduc.github.io/tiktok-multi-account-management-geelark",
    featured: true,
    outcome:
      "Manages 50–100+ accounts per deployment with per-device fingerprinting, country-matched proxies, and organic-cadence scheduling.",
    motif: { from: "#4338ca", to: "#6ea8ff", icon: "automation" },
  },
  {
    title: "Middle-East Philanthropy web initiative",
    summary:
      "Modern bilingual EN/AR experience with RTL, Sitecore XM Cloud + Next.js, Vercel and CDN-backed delivery. Editorial scalability, reusable components, roadmap hooks toward CRM/API integrations.",
    tags: ["Sitecore XM Cloud", "Next.js", "Vercel", "RTL", "Composable CMS"],
    outcome:
      "Enterprise multilingual platform serving EN/AR audiences with Sitecore XM Cloud and global CDN delivery.",
    motif: { from: "#0f766e", to: "#22d3ee", icon: "web" },
  },
  {
    title: "Premium streaming token enforcement",
    summary:
      "Multi-region access control using Akamai media delivery plus HarperDB for high-throughput token state; mitigation for shared or reused tokens and abuse vectors near legitimate playback flows.",
    tags: ["Akamai", "HarperDB", "CDN", "Streaming security", "Architecture"],
    outcome:
      "Multi-region abuse mitigation protecting premium content at CDN edge across millions of playback sessions.",
    motif: { from: "#6d28d9", to: "#c026d3", icon: "streaming" },
  },
  {
    title: "Creator automation pipelines",
    summary:
      "Python tooling for individual TikTok creators: Playwright/Selenium uploads, FFmpeg/MoviePy processing, OpenAI + Whisper assisted captions and scripting.",
    tags: ["Python", "Automation", "OpenAI", "Playwright"],
    outcome:
      "End-to-end pipeline from source scrape to published post — hands-free for individual creators.",
    motif: { from: "#ea580c", to: "#e11d48", icon: "creator" },
  },
];
