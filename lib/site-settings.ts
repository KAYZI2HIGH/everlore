import "server-only";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { enrollments, siteSettings, users } from "@/lib/db/schema";

export type StatSource = "manual" | "students" | "enrollments";
export type HomeStat = {
  label: string;
  /** Used when source is "manual". */
  value: number;
  prefix: string;
  suffix: string;
  /** "students"/"enrollments" read the live count from the database. */
  source: StatSource;
};

export const DEFAULT_HOME_STATS: HomeStat[] = [
  { label: "Students enrolled", value: 200, prefix: "", suffix: "+", source: "manual" },
  { label: "Dreams realised", value: 50, prefix: "", suffix: "+", source: "manual" },
  { label: "Revenue generated", value: 2, prefix: "", suffix: "M+", source: "manual" },
];

const KEY = "home_stats";

/** The stats exactly as saved (for the admin form). */
export async function getHomeStatsConfig(): Promise<HomeStat[]> {
  const db = await getDb();
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, KEY));
  return (row?.value as HomeStat[] | undefined) ?? DEFAULT_HOME_STATS;
}

export async function saveHomeStatsConfig(stats: HomeStat[]) {
  const db = await getDb();
  await db
    .insert(siteSettings)
    .values({ key: KEY, value: stats })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: stats, updatedAt: new Date() } });
}

/** The stats with live sources resolved to numbers (for the public site). */
export async function getHomeStats(): Promise<HomeStat[]> {
  try {
    const stats = await getHomeStatsConfig();
    if (!stats.some((s) => s.source !== "manual")) return stats;
    const db = await getDb();
    const [[u], [e]] = await Promise.all([
      db.select({ n: count() }).from(users),
      db.select({ n: count() }).from(enrollments),
    ]);
    return stats.map((s) =>
      s.source === "students" ? { ...s, value: u.n } : s.source === "enrollments" ? { ...s, value: e.n } : s,
    );
  } catch (err) {
    // The marketing pages must render even if the database is unreachable.
    console.error("getHomeStats failed", err);
    return DEFAULT_HOME_STATS;
  }
}
