/** Homepage skill grid (trimmed from CV themes; expand in `data/` as needed). */
export type SkillGroup = {
  title: string;
  blurb: string;
  tags: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend & architecture",
    blurb: "Service design, event-driven patterns, and API contracts that hold under enterprise load.",
    tags: ["Node.js", "TypeScript", "NestJS", "Microservices", "Event-driven"],
  },
  {
    title: "Composable web",
    blurb: "CDN-backed composable platforms — Sitecore XM Cloud, Next.js, and Vercel for scalable editorial delivery.",
    tags: ["Next.js", "Sitecore XM Cloud", "Vercel", "REST"],
  },
  {
    title: "Streaming & edge security",
    blurb: "High-throughput token enforcement at CDN edge — abuse mitigation, legitimate-playback flows, and Akamai delivery.",
    tags: ["Akamai", "HarperDB", "Token logic", "Performance"],
  },
  {
    title: "Cloud & DevOps",
    blurb: "GCP-native infrastructure: GKE, Cloud SQL, Pub/Sub, CI/CD pipelines, and observable rollouts.",
    tags: ["GCP", "GKE", "Docker", "CI/CD", "Pub/Sub"],
  },
  {
    title: "AI & automation",
    blurb: "Python-first: LLM-augmented pipelines, browser automation at scale, and content processing.",
    tags: ["Python", "OpenAI", "Whisper", "Playwright"],
  },
  {
    title: "Data stores",
    blurb: "Operational and caching layers — PostgreSQL, Redis, MongoDB, and Cloud SQL for latency-sensitive workloads.",
    tags: ["PostgreSQL", "Redis", "MongoDB", "Cloud SQL"],
  },
];
