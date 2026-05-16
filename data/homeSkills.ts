/** Homepage skill grid (trimmed from CV themes; expand in `data/` as needed). */
export type SkillGroup = {
  title: string;
  blurb: string;
  tags: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend & architecture",
    blurb: "Service boundaries, APIs, and dependable delivery patterns.",
    tags: ["Node.js", "TypeScript", "NestJS", "Microservices", "Event-driven"],
  },
  {
    title: "Composable web",
    blurb: "Editorial platforms, CDN-backed front ends, integration-ready CMS.",
    tags: ["Next.js", "Sitecore XM Cloud", "Vercel", "REST"],
  },
  {
    title: "Streaming & edge security",
    blurb: "Token enforcement, CDN delivery, high-throughput validation paths.",
    tags: ["Akamai", "HarperDB", "Token logic", "Performance"],
  },
  {
    title: "Cloud & DevOps",
    blurb: "Containers, pipelines, and observable production systems.",
    tags: ["GCP", "GKE", "Docker", "CI/CD", "Pub/Sub"],
  },
  {
    title: "AI & automation",
    blurb: "LLM-assisted workflows and reliable browser automation.",
    tags: ["Python", "OpenAI", "Whisper", "Playwright"],
  },
  {
    title: "Data stores",
    blurb: "Operational databases and caching where latency matters.",
    tags: ["PostgreSQL", "Redis", "MongoDB", "Cloud SQL"],
  },
];
