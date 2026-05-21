/** Canonical CV sits in private workspace (`docs/profile/CV.md`). Update this file when the public site copy changes. */

export const profile = {
  name: "CHU NHƯ ĐỨC",
  title: "Solution Architect and hands-on engineer",
  headline:
    "Independent Solution Architect · MVP & roadmap clarity + hands-on delivery",
  subline: "TypeScript / Node · Enterprise web & distributed systems",
  location: "Hanoi, Vietnam",
  phone: "+84 988 070 102",
  /** Public contact; delivered to Gmail via Cloudflare Email Routing */
  email: "contact@chunhuduc.com",
  englishNote: "English (TOEIC 900)",
  /**
   * Public contact URLs (hero “Contact me” chips, footer, CTAs). Leave "" to hide a chip.
   * Order on hero: GitHub, LinkedIn, Upwork, Facebook, Discord, Telegram, WhatsApp, Zalo, then phone + email.
   * WhatsApp / Zalo: empty string uses wa.me / zalo.me from `phone`.
   */
  social: {
    upwork: "https://www.upwork.com/freelancers/chunhuduc",
    linkedin: "https://www.linkedin.com/in/chunhuduc/",
    github: "https://github.com/chunhuduc",
    facebook: "https://www.facebook.com/ducchu90",
    discord: "",
    telegram: "",
    whatsapp: "",
    zalo: "",
  },
  siteUrl: "https://chunhuduc.com",
  /** Full-viewport hero background (`public/`) */
  heroBackground: "/hero-bg.png",
  /** Hero portrait layer (`public/`). Solid black in source uses CSS screen blend over the photo bg. */
  heroPortrait: "/hero-portrait.png",
  aboutLead:
    "Senior full-stack engineer and technical leader with 13+ years of experience building scalable backend architectures, cloud-native systems, and high-volume distributed services. Strong background in Node.js, TypeScript, Python automation, and Google Cloud Platform, delivering end-to-end software solutions in both startup and enterprise environments.",
  aboutFocus:
    "Currently Solution Architect at FPT Software, shaping composable web platforms (Sitecore XM Cloud, Next.js, Vercel/CDN) and secure media delivery patterns (Akamai, real-time token enforcement). Combines stakeholder-facing architecture with hands-on engineering for enterprise delivery.",
} as const;
