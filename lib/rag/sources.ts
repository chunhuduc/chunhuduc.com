import fs from "fs";
import path from "path";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/homeSkills";
import { repos } from "@/data/repos";
import { getAllPosts } from "@/lib/posts";
import type { SourceDocument } from "./types";

function serializeProfile(): string {
  const lines = [
    `Name: ${profile.name}`,
    `Title: ${profile.title}`,
    `Headline: ${profile.headline}`,
    `Subline: ${profile.subline}`,
    `Location: ${profile.location}`,
    `English: ${profile.englishNote}`,
    `About lead: ${profile.aboutLead}`,
    `About focus: ${profile.aboutFocus}`,
    `Email: ${profile.email}`,
    `Upwork: ${profile.social.upwork || "(not listed)"}`,
    `LinkedIn: ${profile.social.linkedin || "(not listed)"}`,
    `GitHub: ${profile.social.github || "(not listed)"}`,
  ];
  return lines.join("\n");
}

function serializeExperience(): string {
  return experience
    .map((job) => {
      const head = `${job.role} at ${job.company} (${job.period}${job.location ? `, ${job.location}` : ""})`;
      const bullets = job.highlights.map((h) => `- ${h}`).join("\n");
      return `${head}\n${bullets}`;
    })
    .join("\n\n");
}

function serializeProjects(): string {
  return projects
    .map((p) => {
      const tags = p.tags.join(", ");
      return `### ${p.title}\n${p.summary}\nTags: ${tags}`;
    })
    .join("\n\n");
}

function serializeSkills(): string {
  return skillGroups
    .map((g) => `### ${g.title}\n${g.blurb}\nTags: ${g.tags.join(", ")}`)
    .join("\n\n");
}

function serializeRepos(): string {
  if (repos.length === 0) {
    return "No public GitHub repos listed on the site yet.";
  }
  return repos
    .map((r) => `### ${r.title}\n${r.summary}\nTags: ${r.tags.join(", ")}`)
    .join("\n\n");
}

export function loadSiteSources(): SourceDocument[] {
  const docs: SourceDocument[] = [
    {
      title: "Profile",
      source: "data/profile.ts",
      sourceUri: "/#about",
      text: serializeProfile(),
    },
    {
      title: "Experience",
      source: "data/experience.ts",
      sourceUri: "/experience",
      text: serializeExperience(),
    },
    {
      title: "Projects",
      source: "data/projects.ts",
      sourceUri: "/projects",
      text: serializeProjects(),
    },
    {
      title: "Skills",
      source: "data/homeSkills.ts",
      sourceUri: "/#about",
      text: serializeSkills(),
    },
    {
      title: "GitHub showcase",
      source: "data/repos.ts",
      sourceUri: "/projects",
      text: serializeRepos(),
    },
  ];

  for (const post of getAllPosts()) {
    const body = [post.summary, post.content].filter(Boolean).join("\n\n");
    docs.push({
      title: post.title,
      source: `blog:${post.slug}`,
      sourceUri: `/blog/${post.slug}`,
      text: body,
    });
  }

  const knowledgeDir = path.join(process.cwd(), "knowledge");
  if (fs.existsSync(knowledgeDir)) {
    walkMarkdown(knowledgeDir, knowledgeDir, docs);
  }

  return docs;
}

function walkMarkdown(root: string, dir: string, docs: SourceDocument[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "approved") {
        walkMarkdown(root, full, docs);
      } else if (ent.name !== "node_modules") {
        walkMarkdown(root, full, docs);
      }
      continue;
    }
    if (!ent.name.endsWith(".md")) continue;
    const rel = path.relative(root, full).replace(/\\/g, "/");
    const raw = fs.readFileSync(full, "utf8");
    docs.push({
      title: ent.name.replace(/\.md$/, ""),
      source: `knowledge:${rel}`,
      sourceUri: "/ask",
      text: raw,
    });
  }
}

export type ManifestEntry = { path: string; title?: string; sourceUri?: string };

export function loadManifestSources(manifestPath: string, saRoot: string): SourceDocument[] {
  if (!fs.existsSync(manifestPath)) return [];

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    include?: ManifestEntry[];
  };

  const docs: SourceDocument[] = [];
  for (const entry of manifest.include ?? []) {
    const full = path.join(saRoot, entry.path);
    if (!fs.existsSync(full)) {
      console.warn(`Skip missing manifest path: ${entry.path}`);
      continue;
    }
    const text = fs.readFileSync(full, "utf8");
    docs.push({
      title: entry.title ?? path.basename(entry.path),
      source: `sa:${entry.path.replace(/\\/g, "/")}`,
      sourceUri: entry.sourceUri ?? null,
      text,
    });
  }
  return docs;
}
