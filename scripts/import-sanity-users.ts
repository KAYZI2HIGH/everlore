// One-off: copies user documents (accounts, enrollments, cart, wishlist) from
// Sanity into Postgres. Safe to re-run — existing rows are left untouched.
// Target: DATABASE_URL if set, otherwise the local PGlite database.
// Usage: npm run db:import-sanity   (stop `npm run dev` first when using PGlite)
import { config } from "dotenv";
config({ path: ".env.local" });
import path from "node:path";
import { createClient } from "next-sanity";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

type Ref = { _ref: string };
type SanityUser = {
  _id: string;
  email?: string;
  name?: string;
  image?: string;
  passwordHash?: string;
  googleId?: string;
  createdAt?: string;
  _createdAt: string;
  enrolledCourses?: Ref[];
  cart?: Ref[];
  wishlist?: Ref[];
};

async function openDb() {
  if (process.env.DATABASE_URL) {
    const { Pool } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-serverless");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    return { db: drizzle({ client: pool, schema }), close: () => pool.end() };
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(path.join(process.cwd(), ".data"), { recursive: true });
  const client = new PGlite(path.join(process.cwd(), ".data", "pglite"));
  const db = drizzle({ client, schema });
  await migrate(db, { migrationsFolder: "drizzle" });
  return { db, close: () => client.close() };
}

async function main() {
  const sanity = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });
  const people = await sanity.fetch<SanityUser[]>(`*[_type == "user"]`);
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  const { db, close } = await openDb();

  let created = 0;
  for (const p of people) {
    if (!p.email) continue;
    const email = p.email.trim().toLowerCase();
    await db
      .insert(schema.users)
      .values({
        email,
        name: p.name || email.split("@")[0],
        image: p.image ?? null,
        passwordHash: p.passwordHash ?? null,
        googleId: p.googleId ?? null,
        sanityId: p._id,
        role: admins.includes(email) ? "admin" : "student",
        createdAt: new Date(p.createdAt ?? p._createdAt),
      })
      .onConflictDoNothing();
    const [row] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    if (row.sanityId === p._id) created++;

    const ids = (refs?: Ref[]) => [...new Set((refs ?? []).map((r) => r._ref).filter(Boolean))];
    for (const courseId of ids(p.enrolledCourses)) {
      await db
        .insert(schema.enrollments)
        .values({ userId: row.id, courseId, source: "migrated" })
        .onConflictDoNothing();
    }
    for (const courseId of ids(p.cart)) {
      await db.insert(schema.cartItems).values({ userId: row.id, courseId }).onConflictDoNothing();
    }
    for (const courseId of ids(p.wishlist)) {
      await db.insert(schema.wishlistItems).values({ userId: row.id, courseId }).onConflictDoNothing();
    }
  }

  console.log(`Imported ${people.length} Sanity users (${created} linked).`);
  await close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
