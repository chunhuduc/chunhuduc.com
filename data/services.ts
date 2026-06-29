export type ServiceIcon = "architecture" | "delivery" | "web" | "security";

export type Service = {
  title: string;
  description: string;
  tags: string[];
  icon: ServiceIcon;
};

/** Hireable offerings for the homepage "How I can help" section. Outcome-framed, not a tech dump. */
export const services: Service[] = [
  {
    title: "Solution architecture & system design",
    description:
      "Service boundaries, integration contracts, and technical risk reviews — a roadmap your team can build against.",
    tags: ["Architecture review", "API design", "Roadmaps"],
    icon: "architecture",
  },
  {
    title: "MVP & product delivery",
    description:
      "From whiteboard to production: scoped milestones, hands-on engineering, and dependable delivery you can stand behind.",
    tags: ["Scoping", "Hands-on build", "Milestones"],
    icon: "delivery",
  },
  {
    title: "Composable web platforms",
    description:
      "Sitecore XM Cloud, Next.js, and Vercel/CDN editorial platforms built for enterprise scale and multilingual reach.",
    tags: ["Sitecore XM Cloud", "Next.js", "CDN"],
    icon: "web",
  },
  {
    title: "Streaming security & automation",
    description:
      "High-throughput token enforcement, edge abuse mitigation, and Python/AI automation pipelines.",
    tags: ["Edge security", "Token logic", "AI automation"],
    icon: "security",
  },
];
