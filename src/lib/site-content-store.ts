import "server-only";

import { unstable_cache, revalidateTag } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { defaultSiteContent, type SiteContent } from "./site-content-defaults";

export type { SiteContent };
export { defaultSiteContent };

// ─── DB helpers ───────────────────────────────────────────────────────────────

function database() {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString)
    throw new Error("DATABASE_URL não foi configurada.");
  connectionString = connectionString
    .replace(/[?&]channel_binding=[^&]*/g, "")
    .replace(/[?&]sslmode=[^&]*/g, "");
  return neon(connectionString);
}

async function ensureTable() {
  const sql = database();
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

// ─── Cache tag ────────────────────────────────────────────────────────────────

const CACHE_TAG = "site-content";

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns merged content: defaults overridden by DB values (cached 60s) */
export const getSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    try {
      await ensureTable();
      const sql = database();
      const rows = (await sql`SELECT key, value FROM site_content`) as {
        key: string;
        value: string;
      }[];
      const dbContent: SiteContent = {};
      for (const row of rows) dbContent[row.key] = row.value;
      return { ...defaultSiteContent, ...dbContent };
    } catch (error) {
      console.warn("getSiteContent failed, using defaults:", error);
      return { ...defaultSiteContent };
    }
  },
  [CACHE_TAG],
  { revalidate: 60, tags: [CACHE_TAG] }
);

/** Upsert a batch of key/value pairs and invalidate the cache */
export async function updateSiteContentBatch(
  updates: Record<string, string>
): Promise<void> {
  await ensureTable();
  const sql = database();
  for (const [key, value] of Object.entries(updates)) {
    await sql`
      INSERT INTO site_content (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
  }
  // Invalida o cache imediatamente após salvar
  revalidateTag(CACHE_TAG, "max");
}

