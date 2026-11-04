import "server-only";
import { auth } from "@/auth";
import { findUserById } from "@/lib/db/users";
import type { User } from "@/lib/db/schema";

/** The signed-in user's database row, or null. Always re-reads the role. */
export async function currentUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return findUserById(session.user.id);
}

export class AuthError extends Error {}

export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) throw new AuthError("Please sign in to continue.");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") throw new AuthError("Admins only.");
  return user;
}
