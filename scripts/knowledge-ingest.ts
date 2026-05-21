/**
 * Local/CI ingest: loads site + optional SA manifest into Postgres pgvector (Neon, etc.).
 *
 * Usage:
 *   npm run knowledge:ingest
 *   npm run knowledge:ingest -- --source cv
 *   SA_KNOWLEDGE_ROOT=C:/BRAINSTORM/SA npm run knowledge:ingest
 *
 * Loads `.env` then `.env.local` from the project root (same idea as Next.js).
 */
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const projectRoot = process.cwd();

function loadEnvFiles() {
  const envPath = path.join(projectRoot, ".env");
  const localPath = path.join(projectRoot, ".env.local");

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
  if (fs.existsSync(localPath)) {
    dotenv.config({ path: localPath, override: true });
  }
}

loadEnvFiles();
import { ingestDocuments } from "../lib/rag/ingest";
import { loadManifestSources, loadSiteSources } from "../lib/rag/sources";
import type { SourceDocument } from "../lib/rag/types";

async function main() {
  const args = process.argv.slice(2);
  const sourceIdx = args.indexOf("--source");
  const sourceFilter = sourceIdx >= 0 ? args[sourceIdx + 1] : undefined;
  const skipEnrich = args.includes("--skip-enrich");

  const site = loadSiteSources();
  console.log(`Site sources: ${site.length}`);

  const saRoot = process.env.SA_KNOWLEDGE_ROOT?.trim();
  let saDocs: SourceDocument[] = [];
  if (saRoot) {
    const manifest = path.join(process.cwd(), "knowledge", "ingest.manifest.json");
    saDocs = loadManifestSources(manifest, saRoot);
    console.log(`SA manifest sources: ${saDocs.length} (root: ${saRoot})`);
  } else {
    console.log("SA_KNOWLEDGE_ROOT not set; skipping private workspace files.");
  }

  const all = [...site, ...saDocs];
  console.log(`Ingesting ${all.length} documents…`);

  const result = await ingestDocuments(all, { skipEnrich, sourceFilter });
  console.log(`Done. Chunks upserted: ${result.chunks}, skipped: ${result.skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
