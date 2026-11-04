"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { cartItems, enrollments, users, wishlistItems } from "@/lib/db/schema";
import { currentUser, requireUser } from "@/lib/session";
import { fetchCourseBySlug, fetchCoursesByIds } from "@/lib/content";
import { client } from "@/lib/sanity";

type Result = { success: true } | { success: false; error: string };

const fail = (error: unknown): Result => ({
  success: false,
  error: error instanceof Error ? error.message : "Something went wrong",
});

async function courseExists(courseId: string) {
  const id = await client.fetch<string | null>(
    `*[_type == "course" && _id == $courseId][0]._id`,
    { courseId },
  );
  return !!id;
}

/** Signed-in user summary plus the course ids they own / saved. Null if signed out. */
export async function getMyAccount() {
  const user = await currentUser();
  if (!user) return null;
  const db = await getDb();
  const [enrolled, cart, wishlist] = await Promise.all([
    db.select({ id: enrollments.courseId }).from(enrollments).where(eq(enrollments.userId, user.id)),
    db.select({ id: cartItems.courseId }).from(cartItems).where(eq(cartItems.userId, user.id)),
    db.select({ id: wishlistItems.courseId }).from(wishlistItems).where(eq(wishlistItems.userId, user.id)),
  ]);
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    },
    enrolledCourseIds: enrolled.map((r) => r.id),
    cartCourseIds: cart.map((r) => r.id),
    wishlistCourseIds: wishlist.map((r) => r.id),
  };
}

export async function getMyCart() {
  const user = await currentUser();
  if (!user) return [];
  const db = await getDb();
  const rows = await db
    .select({ id: cartItems.courseId })
    .from(cartItems)
    .where(eq(cartItems.userId, user.id))
    .orderBy(cartItems.createdAt);
  return fetchCoursesByIds(rows.map((r) => r.id));
}

export async function getMyWishlist() {
  const user = await currentUser();
  if (!user) return [];
  const db = await getDb();
  const rows = await db
    .select({ id: wishlistItems.courseId })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, user.id))
    .orderBy(wishlistItems.createdAt);
  return fetchCoursesByIds(rows.map((r) => r.id));
}

export async function getMyLearning() {
  const user = await currentUser();
  if (!user) return [];
  const db = await getDb();
  const rows = await db
    .select({ id: enrollments.courseId, enrolledAt: enrollments.createdAt })
    .from(enrollments)
    .where(eq(enrollments.userId, user.id))
    .orderBy(enrollments.createdAt);
  const courses = await fetchCoursesByIds(rows.map((r) => r.id));
  const dates = new Map(rows.map((r) => [r.id, r.enrolledAt.toISOString()]));
  return courses.map((c) => ({ ...c, enrolledAt: dates.get(c._id)! }));
}

export async function addToCart(courseId: string): Promise<Result> {
  try {
    const user = await requireUser();
    if (!(await courseExists(courseId))) return { success: false, error: "Course not found" };
    const db = await getDb();
    const [owned] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, courseId)));
    if (owned) return { success: false, error: "You already own this course" };
    await db.insert(cartItems).values({ userId: user.id, courseId }).onConflictDoNothing();
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

export async function removeFromCart(courseId: string): Promise<Result> {
  try {
    const user = await requireUser();
    const db = await getDb();
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, user.id), eq(cartItems.courseId, courseId)));
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

export async function addToWishlist(courseId: string): Promise<Result> {
  try {
    const user = await requireUser();
    if (!(await courseExists(courseId))) return { success: false, error: "Course not found" };
    const db = await getDb();
    await db.insert(wishlistItems).values({ userId: user.id, courseId }).onConflictDoNothing();
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

export async function removeFromWishlist(courseId: string): Promise<Result> {
  try {
    const user = await requireUser();
    const db = await getDb();
    await db
      .delete(wishlistItems)
      .where(and(eq(wishlistItems.userId, user.id), eq(wishlistItems.courseId, courseId)));
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

/** Enroll in a course whose price is 0. Paid courses go through checkout. */
export async function enrollInFreeCourse(slug: string): Promise<Result> {
  try {
    const user = await requireUser();
    const course = await fetchCourseBySlug(slug);
    if (!course) return { success: false, error: "Course not found" };
    if (course.price > 0) return { success: false, error: "This course is not free" };
    const db = await getDb();
    await db
      .insert(enrollments)
      .values({ userId: user.id, courseId: course._id, source: "free" })
      .onConflictDoNothing();
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, user.id), eq(cartItems.courseId, course._id)));
    revalidatePath("/academy/learning");
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  bio: z.string().trim().max(500).optional().default(""),
  phone: z.string().trim().max(30).optional().default(""),
});

export async function updateProfile(input: z.input<typeof profileSchema>): Promise<Result> {
  try {
    const user = await requireUser();
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    const db = await getDb();
    await db
      .update(users)
      .set({
        name: parsed.data.name,
        bio: parsed.data.bio || null,
        phone: parsed.data.phone || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));
    return { success: true };
  } catch (error) {
    return fail(error);
  }
}
