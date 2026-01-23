"use server";

import { signIn as authSignIn, signOut as authSignOut } from "@/auth";
import { client } from "@/lib/sanity";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation
    if (!name || !email || !password) {
      return { error: "Missing required fields" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters" };
    }

    // Check if user exists
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email },
    );

    if (existingUser) {
      return { error: "User already exists. Please sign in instead." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Sanity
    await client.create({
      _type: "user",
      name,
      email,
      passwordHash: hashedPassword,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      enrolledCourses: [],
      wishlist: [],
      cart: [],
      createdAt: new Date().toISOString(),
    });

    // Sign in the user
    await authSignIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // Redirect to courses
    redirect("/academy/courses");
  } catch (error) {
    if (error instanceof Error) {
      // Handle redirect (expected behavior)
      if (error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }

      // Check for credential signin error
      if (error.message.includes("CredentialsSignin")) {
        return {
          error: "Account created but sign in failed. Please sign in manually.",
        };
      }

      return { error: error.message };
    }
    return { error: "An error occurred during sign up" };
  }
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Missing email or password" };
  }

  try {
    // Try to sign in with credentials
    const result = await authSignIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("authSignIn result:", result);

    // Check if there's an error in the result
    if (result?.error) {
      console.log("Sign in error from result:", result.error);
      return {
        error: "Invalid email or password. Please check your credentials.",
      };
    }

    // If we get here, redirect
    redirect("/academy/courses");
  } catch (error: any) {
    console.log("Caught error details:", error);
    console.log("Error message:", error?.message);
    console.log("Error name:", error?.name);

    // Handle redirect (expected behavior)
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    // Return a generic error message
    return {
      error: "Invalid email or password. Please check your credentials.",
    };
  }
}

export async function signOutAction() {
  await authSignOut({ redirectTo: "/" });
}

export async function signInWithGoogle() {
  await authSignIn("google", { redirectUrl: "/academy/courses" });
}
