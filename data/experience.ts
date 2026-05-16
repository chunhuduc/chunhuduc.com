export type ExperienceEntry = {
  role: string;
  company: string;
  period: string;
  location?: string;
  highlights: string[];
};

/** Mirrors employment facts from canonical CV (private workspace). NDA-safe public wording. */
export const experience: ExperienceEntry[] = [
  {
    role: "Solution Architect",
    company: "FPT Software",
    period: "May 2025 to Present",
    location: "Hanoi, Vietnam",
    highlights: [
      "Led solution design for the Middle-East Philanthropy initiative (ongoing): bilingual EN/AR digital experience with RTL, Sitecore XM Cloud + Next.js, Vercel/CDN-backed deployment; reusable components, editorial scalability, security and performance; roadmap alignment with customer Product Owner and cross-functional squad (BA, UX, FE, BE, QA, DevOps).",
      "Architected multi-region access-token enforcement for premium streaming: Akamai media delivery + HarperDB for high-throughput token state; mitigation of shared/reused tokens and abuse vectors (for example VPN scenarios); flows for legitimate vs blocked playback (for example 403 / alternate content where applicable).",
      "Drove architecture alignment, integration boundaries, and technical risk reviews across stakeholder groups.",
    ],
  },
  {
    role: "Freelance Developer: Python & TikTok automation systems",
    company: "Self-employed / freelance",
    period: "2023 to 2025",
    location: "Remote",
    highlights: [
      "Built automation pipelines for TikTok creators: auto-editing, auto-captioning, trend detection, script generation, batch rendering, and scheduled posting.",
      "Automated TikTok uploads via Playwright/Selenium with support for captions, hashtags, covers, and posting timeline.",
      "Integrated OpenAI + Whisper to automate voiceovers, scripts, captions, and content variations.",
    ],
  },
  {
    role: "CTO / Team & Technical Leader",
    company: "TTC Technology Solutions",
    period: "May 2018 to May 2022",
    highlights: [
      "Architecture ownership across Node.js, TypeScript, NestJS, Express.js, and event-driven microservices.",
      "GCP infrastructure (GKE, Cloud SQL, Pub/Sub, Cloud Run, IAM, Cloud Storage), CI/CD, observability.",
      "Led teams across hiring, delivery, and stakeholder alignment.",
    ],
  },
  {
    role: "Full-stack Developer & Solution Architect",
    company: "HOTTAB",
    period: "May 2017 to May 2018",
    highlights: [
      "Architected Report Engine Ecosystem (Core, API, Email Scheduler) using Node.js and MongoDB.",
      "Distributed Queue Management System processing millions of jobs/day with Redis Queue and Node.js.",
    ],
  },
  {
    role: "Full-stack Developer & Data Analyst",
    company: "Appota Inc.",
    period: "Oct 2016 to May 2017",
    highlights: [
      "Analytics dashboards, CMS systems, backend services, ETL scripts, internal automation tools.",
    ],
  },
  {
    role: "Full-stack Developer",
    company: "FPT Software",
    period: "Apr 2016 to Oct 2016",
    highlights: [
      "Stakeholder communication, requirements analysis, delivery through coding, tests, and deployment.",
    ],
  },
  {
    role: "Founder / Manager / Game Developer",
    company: "OwlGaming Community",
    period: "Jan 2012 to Apr 2016",
    highlights: [
      "Scaled online multiplayer community with LUA, PHP, Node.js, MySQL, MongoDB backends.",
    ],
  },
];
