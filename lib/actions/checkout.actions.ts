"use server";

import { randomBytes } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { cartItems, enrollments, payments } from "@/lib/db/schema";
import { requireUser } from "@/lib/session";
import { fetchCoursesByIds } from "@/lib/content";
import { site } from "@/lib/config";

type StartResult =
  | { success: true; reference: string; amount: number; currency: string; email: string }
  | { success: false; error: string };

/**
 * Prices the signed-in user's cart on the server and records a pending payment.
 * The client opens Paystack with exactly the returned reference and amount.
 */
export async function startCheckout(): Promise<StartResult> {
  try {
    const user = await requireUser();
    const db = await getDb();

    const cart = await db
      .select({ id: cartItems.courseId })
      .from(cartItems)
      .where(eq(cartItems.userId, user.id));
    const owned = await db
      .select({ id: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.userId, user.id));
    const ownedIds = new Set(owned.map((r) => r.id));

    const courses = (await fetchCoursesByIds(cart.map((r) => r.id))).filter(
      (c) => !ownedIds.has(c._id),
    );
    if (courses.length === 0) return { success: false, error: "Your cart is empty" };

    const amount = Math.round(courses.reduce((sum, c) => sum + c.price, 0) * 100);
    if (amount <= 0) return { success: false, error: "Nothing to pay for" };

    const reference = `evl_${Date.now()}_${randomBytes(6).toString("hex")}`;
    await db.insert(payments).values({
      userId: user.id,
      reference,
      amount,
      currency: site.currency,
      courseIds: courses.map((c) => c._id),
    });

    return { success: true, reference, amount, currency: site.currency, email: user.email };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Checkout failed" };
  }
}

/**
 * Verifies a Paystack transaction server-side and, only if it matches the
 * pending payment we recorded, enrolls the user. Safe to call more than once.
 */
export async function completeCheckout(
  reference: string,
): Promise<{ success: true; courseIds: string[] } | { success: false; error: string }> {
  try {
    const user = await requireUser();
    const db = await getDb();

    const [payment] = await db
      .select()
      .from(payments)
      .where(and(eq(payments.reference, reference), eq(payments.userId, user.id)));
    if (!payment) return { success: false, error: "Payment not found" };
    if (payment.status === "success") return { success: true, courseIds: payment.courseIds };

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return { success: false, error: "Payments are not configured" };

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" },
    );
    const body = await res.json().catch(() => null);
    const tx = body?.data;

    const valid =
      res.ok &&
      body?.status === true &&
      tx?.status === "success" &&
      tx?.reference === reference &&
      Number(tx?.amount) >= payment.amount &&
      String(tx?.currency).toUpperCase() === payment.currency;

    if (!valid) {
      if (tx?.status && tx.status !== "success" && tx.status !== "ongoing" && tx.status !== "pending") {
        await db
          .update(payments)
          .set({ status: "failed", providerResponse: tx })
          .where(eq(payments.id, payment.id));
      }
      return { success: false, error: "We could not confirm this payment yet" };
    }

    await db.transaction(async (trx) => {
      const updated = await trx
        .update(payments)
        .set({ status: "success", paidAt: new Date(), providerResponse: tx })
        .where(and(eq(payments.id, payment.id), eq(payments.status, "pending")))
        .returning({ id: payments.id });
      if (updated.length === 0) return; // processed concurrently

      await trx
        .insert(enrollments)
        .values(
          payment.courseIds.map((courseId) => ({
            userId: user.id,
            courseId,
            source: "purchase" as const,
            paymentId: payment.id,
          })),
        )
        .onConflictDoNothing();
      await trx
        .delete(cartItems)
        .where(and(eq(cartItems.userId, user.id), inArray(cartItems.courseId, payment.courseIds)));
    });

    revalidatePath("/academy/learning");
    return { success: true, courseIds: payment.courseIds };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Verification failed" };
  }
}
