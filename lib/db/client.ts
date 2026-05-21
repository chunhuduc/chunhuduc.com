import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let sql: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  if (!sql) {
    sql = postgres(url, { prepare: false, max: 10 });
  }
  return sql;
}

export function getDb() {
  if (!db) {
    db = drizzle(getSql(), { schema });
  }
  return db;
}

/** Format embedding array for pgvector literal */
export function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}
