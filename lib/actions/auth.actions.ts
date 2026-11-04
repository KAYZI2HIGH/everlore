"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn as authSignIn, signOut as authSignOut } from "@/auth";
import { createPasswordUser, findUserByEmail } from "@/lib/db/users";

const safeRedirect = (value: FormDataEntryValue | null) => {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/academy";
};

const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name").max(80),
    email: z.string().trim().toLowerCase().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) return { error: "An account with this email already exists. Please sign in." };

  await createPasswordUser({ name, email, passwordHash: await bcrypt.hash(password, 10) });

  try {
    await authSignIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign in failed. Please sign in." };
    }
    throw error;
  }
  // The client does a full navigation so SessionProvider picks up the new session.
  return { redirectTo: safeRedirect(formData.get("callbackUrl")) };
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Please enter your email and password" };

  try {
    await authSignIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      const user = await findUserByEmail(email);
      if (user && !user.passwordHash && user.googleId) {
        return { error: "This account uses Google sign-in. Continue with Google instead." };
      }
      return { error: "Invalid email or password." };
    }
    throw error;
  }
  return { redirectTo: safeRedirect(formData.get("callbackUrl")) };
}

export async function signOutAction() {
  await authSignOut({ redirectTo: "/" });
}

export async function signInWithGoogle(callbackUrl?: string) {
  await authSignIn("google", {
    redirectTo: callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/academy",
  });
}
