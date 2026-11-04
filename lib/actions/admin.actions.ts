"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";

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
