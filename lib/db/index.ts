import "server-only";
import path from "node:path";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export type Db = NeonDatabase<typeof schema>;

// Production / preview: Neon Postgres via DATABASE_URL.
// Local development without DATABASE_URL: an embedded Postgres (PGlite)
// stored in ./.data/pglite, migrated automatically on first use.

const globalForDb = globalThis as unknown as { __everloreDb?: Promise<Db> };

async function createDb(): Promise<Db> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const { Pool, neonConfig } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-serverless");
    if (typeof WebSocket !== "undefined") {
      neonConfig.webSocketConstructor = WebSocket;
    }
    return drizzle({ client: new Pool({ connectionString: url }), schema });
  }

  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_PGLITE) {
    throw new Error("DATABASE_URL is not set");
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(path.join(process.cwd(), ".data"), { recursive: true });
  const client = new PGlite(path.join(process.cwd(), ".data", "pglite"));
  const db = drizzle({ client, schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  return db as unknown as Db;
}

export function getDb(): Promise<Db> {
  if (!globalForDb.__everloreDb) {
    globalForDb.__everloreDb = createDb().catch((err) => {
      globalForDb.__everloreDb = undefined;
      throw err;
    });
  }
  return globalForDb.__everloreDb;
}

export { schema };
