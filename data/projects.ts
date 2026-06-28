export type ProjectCard = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  demoUrl?: string;
};

/** NDA-safe initiative summaries aligned with private workspace distill (`SUMMARIES.md`). */
export const projects: ProjectCard[] = [
  {
    title: "Middle-East Philanthropy web initiative",
    summary:
      "Modern bilingual EN/AR experience with RTL, Sitecore XM Cloud + Next.js, Vercel and CDN-backed delivery. Editorial scalability, reusable components, roadmap hooks toward CRM/API integrations.",
    tags: ["Sitecore XM Cloud", "Next.js", "Vercel", "RTL", "Composable CMS"],
  },
  {
    title: "Premium streaming token enforcement",
    summary:
      "Multi-region access control narrative using Akamai media delivery plus HarperDB for high-throughput token state; mitigation for shared or reused tokens and abuse vectors near legitimate playback flows.",
    tags: ["Akamai", "HarperDB", "CDN", "Streaming security", "Architecture"],
  },
  {
    title: "TikTok fleet automation system",
    summary:
      "Python system for managing 50-100+ TikTok accounts via Geelark cloud Android phones: per-device hardware fingerprinting, Webshare residential proxies, ffmpeg content pipeline with LUT color grading and speed/pitch jitter, OpenAI/Gemini caption rewriting per country, SQLite scheduler with organic cadence jitter, and in-app posting via Geelark task API.",
    tags: ["Python", "Geelark", "ffmpeg", "SQLite", "Webshare", "OpenAI"],
    demoUrl: "https://chunhuduc.github.io/tiktok-multi-account-management-geelark",
  },
  {
    title: "Creator automation pipelines",
    summary:
      "Python tooling for individual TikTok creators: Playwright/Selenium uploads, FFmpeg/MoviePy processing, OpenAI + Whisper assisted captions and scripting.",
    tags: ["Python", "Automation", "OpenAI", "Playwright"],
  },
];
