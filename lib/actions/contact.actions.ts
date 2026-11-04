"use server";

import { z } from "zod";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  interest: z.string().trim().max(60).optional(),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(4000),
  // Honeypot: real people never fill this hidden field.
  company: z.string().max(0).optional(),
});

export async function submitContactMessage(
  input: z.input<typeof schema>,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  try {
    const db = await getDb();
    const { name, email, interest, message } = parsed.data;
    await db.insert(contactMessages).values({ name, email, interest: interest || null, message });
    return { success: true };
  } catch (error) {
    console.error("submitContactMessage failed", error);
    return { success: false, error: "Could not send your message. Please email us instead." };
  }
}
