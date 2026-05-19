/** Canonical CV sits in private workspace (`docs/profile/CV.md`). Update this file when the public site copy changes. */

export const profile = {
  name: "CHU NHƯ ĐỨC",
  headline:
    "Independent Solution Architect · MVP & roadmap clarity + hands-on delivery",
  subline: "TypeScript / Node · Enterprise web & distributed systems",
  location: "Hanoi, Vietnam",
  phone: "+84 988 070 102",
  email: "chunhuduc@gmail.com",
  englishNote: "English (TOEIC 900)",
  /** Replace when ready so CTAs render */
  social: {
    github: "",
    linkedin: "",
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
