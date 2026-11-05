"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { saveHomeStatsConfig } from "@/lib/site-settings";
import { z } from "zod";

export async function setMessageHandled(id: string, handled: boolean) {
  await requireAdmin();
  const db = await getDb();
  await db
    .update(contactMessages)
    .set({ handledAt: handled ? new Date() : null })
    .where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

const statSchema = z.object({
  label: z.string().trim().min(1).max(40),
  value: z.coerce.number().min(0).max(1_000_000_000),
  prefix: z.string().trim().max(4),
  suffix: z.string().trim().max(4),
  source: z.enum(["manual", "students", "enrollments"]),
});

export async function updateHomeStats(input: unknown) {
  await requireAdmin();
  const parsed = z.array(statSchema).min(1).max(4).safeParse(input);
  if (!parsed.success) return { error: "Check each stat: a label, a number, and up to 4 characters before/after." };
  await saveHomeStatsConfig(parsed.data);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/settings");
  return { ok: true as const };
}
