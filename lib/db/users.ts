import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { enrollments, users, type User } from "@/lib/db/schema";

const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isBootstrapAdmin = (email: string) =>
  adminEmails().includes(email.toLowerCase());

export const avatarFor = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0b2a6f,1e4fd8,c8892b&textColor=ffffff`;

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  if (user && user.role !== "admin" && isBootstrapAdmin(user.email)) {
    await db.update(users).set({ role: "admin" }).where(eq(users.id, user.id));
    return { ...user, role: "admin" };
  }
  return user ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await getDb();
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

export async function createPasswordUser(input: {
  email: string;
  name: string;
  passwordHash: string;
}) {
  const db = await getDb();
  const email = input.email.toLowerCase();
  const [user] = await db
    .insert(users)
    .values({
      email,
      name: input.name,
      passwordHash: input.passwordHash,
      image: avatarFor(input.name),
      role: isBootstrapAdmin(email) ? "admin" : "student",
    })
    .returning();
  return user;
}

export async function upsertOAuthUser(input: {
  email: string;
  name: string;
  image: string | null;
  googleId: string;
}) {
  const db = await getDb();
  const email = input.email.toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    if (!existing.googleId || (!existing.image && input.image)) {
      await db
        .update(users)
        .set({
          googleId: existing.googleId ?? input.googleId,
          image: existing.image ?? input.image,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id));
    }
    return existing;
  }
  const [user] = await db
    .insert(users)
    .values({
      email,
      name: input.name,
      image: input.image ?? avatarFor(input.name),
      googleId: input.googleId,
      role: isBootstrapAdmin(email) ? "admin" : "student",
    })
    .returning();
  return user;
}

export async function isEnrolled(userId: string, courseId: string) {
  const db = await getDb();
  const [row] = await db
    .select({ id: enrollments.courseId })
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .limit(1);
  return !!row;
}
