/**
 * Regenerates data/projects.ts from each public-repo project's showcase
 * block (see docs/projects/SHOWCASE-FORMAT.md in the SA workspace), merged
 * with the hand-authored NDA-only entries in data/projects-nda.ts.
 *
 * Showcase blocks are written into repo READMEs by the `/inspect-project`
 * skill (SA workspace) — this script only reads them back.
 *
 * Usage:
 *   npm run projects:sync
 *   GITHUB_TOKEN=ghp_xxx npm run projects:sync   (raises GitHub API rate limit)
 *
 * Loads `.env` then `.env.local` from the project root (same idea as Next.js).
 */
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import yaml from "js-yaml";
import { z } from "zod";

const projectRoot = process.cwd();

function loadEnvFiles() {
  const envPath = path.join(projectRoot, ".env");
  const localPath = path.join(projectRoot, ".env.local");
  if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
  if (fs.existsSync(localPath)) dotenv.config({ path: localPath, override: true });
}

loadEnvFiles();

const BLOCK_START = "<!-- chunhuduc.com:showcase:start -->";
const BLOCK_END = "<!-- chunhuduc.com:showcase:end -->";

const archNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  x: z.number(),
  y: z.number(),
  kind: z.enum(["primary", "default", "store"]).optional(),
});

const archEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  flow: z.boolean().optional(),
  curve: z.number().optional(),
});

const motifSchema = z.object({
  from: z.string(),
  to: z.string(),
  icon: z.enum(["automation", "web", "streaming", "creator"]),
});

const showcaseSchema = z.object({
  summary: z.string().min(1),
  tags: z.array(z.string()).min(1),
  demoUrl: z.string().url().optional(),
  outcome: z.string().optional(),
  complexityScore: z.number().int(),
  motif: motifSchema,
  architecture: z
    .object({
      from: z.string(),
      to: z.string(),
      nodes: z.array(archNodeSchema).min(1),
      edges: z.array(archEdgeSchema),
    })
    .optional(),
});

type Showcase = z.infer<typeof showcaseSchema>;

type RepoTarget = {
  title: string;
  owner: string;
  repo: string;
};

/** Repos to sync, derived from public GitHub project links already on the site. */
const REPO_TARGETS: RepoTarget[] = [
  { title: "TikTok fleet automation system", owner: "chunhuduc", repo: "tiktok-multi-account-management-geelark" },
  { title: "PyloMarket", owner: "chunhuduc", repo: "pylomarket" },
  { title: "CheaterCheck.ai", owner: "chunhuduc", repo: "CheaterCheck.ai" },
  { title: "stripe-global-payout", owner: "chunhuduc", repo: "stripe-global-payout" },
  { title: "Chợ Xuân Mai", owner: "chunhuduc", repo: "choxuanmai.app" },
  { title: "ConOi", owner: "chunhuduc", repo: "conoi.app" },
];

async function fetchReadme(owner: string, repo: string): Promise<string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw+json",
    "User-Agent": "chunhuduc.com-projects-sync",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${owner}/${repo}/readme: ${await res.text()}`);
  }
  return res.text();
}

function extractShowcaseBlock(readme: string): string | null {
  const startIdx = readme.indexOf(BLOCK_START);
  const endIdx = readme.indexOf(BLOCK_END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return null;

  const between = readme.slice(startIdx + BLOCK_START.length, endIdx);
  const fenceMatch = between.match(/```ya?ml\s*([\s\S]*?)```/);
  if (!fenceMatch) return null;
  return fenceMatch[1];
}

function parseShowcase(yamlText: string, context: string): Showcase {
  const raw = yaml.load(yamlText);
  const result = showcaseSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid showcase block for ${context}:\n${result.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")}`);
  }
  return result.data;
}

function tsString(value: string): string {
  return JSON.stringify(value);
}

function tsStringArray(values: string[]): string {
  return `[${values.map(tsString).join(", ")}]`;
}

function renderProjectCard(title: string, href: string, showcase: Showcase): string {
  const lines: string[] = [];
  lines.push("  {");
  lines.push(`    title: ${tsString(title)},`);
  lines.push(`    summary: ${tsString(showcase.summary)},`);
  lines.push(`    tags: ${tsStringArray(showcase.tags)},`);
  lines.push(`    href: ${tsString(href)},`);
  if (showcase.demoUrl) lines.push(`    demoUrl: ${tsString(showcase.demoUrl)},`);
  if (showcase.outcome) lines.push(`    outcome: ${tsString(showcase.outcome)},`);
  lines.push(`    complexityScore: ${showcase.complexityScore},`);
  lines.push(
    `    motif: { from: ${tsString(showcase.motif.from)}, to: ${tsString(showcase.motif.to)}, icon: ${tsString(showcase.motif.icon)} },`
  );
  if (showcase.architecture) {
    const a = showcase.architecture;
    lines.push(`    architecture: {`);
    lines.push(`      from: ${tsString(a.from)},`);
    lines.push(`      to: ${tsString(a.to)},`);
    lines.push(`      nodes: [`);
    for (const n of a.nodes) {
      const kind = n.kind ? `, kind: ${tsString(n.kind)}` : "";
      lines.push(`        { id: ${tsString(n.id)}, label: ${tsString(n.label)}, x: ${n.x}, y: ${n.y}${kind} },`);
    }
    lines.push(`      ],`);
    lines.push(`      edges: [`);
    for (const e of a.edges) {
      const flow = e.flow ? ", flow: true" : "";
      const curve = e.curve !== undefined ? `, curve: ${e.curve}` : "";
      lines.push(`        { from: ${tsString(e.from)}, to: ${tsString(e.to)}${flow}${curve} },`);
    }
    lines.push(`      ],`);
    lines.push(`    },`);
  }
  lines.push("  },");
  return lines.join("\n");
}

async function main() {
  const cards: { title: string; complexityScore: number; code: string }[] = [];
  const errors: string[] = [];

  for (const target of REPO_TARGETS) {
    try {
      const readme = await fetchReadme(target.owner, target.repo);
      const block = extractShowcaseBlock(readme);
      if (!block) {
        errors.push(`${target.title} (${target.owner}/${target.repo}): no showcase block found in README. Run /inspect-project first.`);
        continue;
      }
      const showcase = parseShowcase(block, `${target.owner}/${target.repo}`);
      const href = `https://github.com/${target.owner}/${target.repo}`;
      cards.push({
        title: target.title,
        complexityScore: showcase.complexityScore,
        code: renderProjectCard(target.title, href, showcase),
      });
      console.log(`OK   ${target.title} (complexityScore: ${showcase.complexityScore})`);
    } catch (e) {
      errors.push(`${target.title} (${target.owner}/${target.repo}): ${(e as Error).message}`);
    }
  }

  if (errors.length > 0) {
    console.warn(`\n${errors.length} repo(s) skipped:\n${errors.map((e) => `  - ${e}`).join("\n")}\n`);
  }

  if (cards.length === 0) {
    console.error("No showcase blocks found across any target repo. Aborting (not overwriting data/projects.ts).");
    process.exit(1);
  }

  cards.sort((a, b) => b.complexityScore - a.complexityScore);

  const header = `// GENERATED FILE — do not hand-edit.
// Regenerate with \`npm run projects:sync\` (scripts/sync-projects.ts), which
// pulls each public-repo project's showcase block from its own README (see
// docs/projects/SHOWCASE-FORMAT.md in the SA workspace) and merges it with
// the hand-authored NDA-only entries in \`data/projects-nda.ts\`.
// Sorted by complexityScore descending; index 0 is the homepage hero card.
import type { ProjectCard } from "./projectCard";
import { projectsNda } from "./projects-nda";

const projectsFromRepos: ProjectCard[] = [
${cards.map((c) => c.code).join("\n")}
];

export const projects: ProjectCard[] = [...projectsFromRepos, ...projectsNda].sort(
  (a, b) => b.complexityScore - a.complexityScore
);

export type { ProjectCard } from "./projectCard";
`;

  fs.writeFileSync(path.join(projectRoot, "data", "projects.ts"), header, "utf8");
  console.log(`\nWrote data/projects.ts (${cards.length} repo project(s) + ${"projectsNda"} merged at runtime).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
