"use server";

import { client } from "@/lib/sanity";
import { auth } from "@/lib/auth";

export async function getUserByEmail(email: string) {
  try {
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        name,
        email,
        image,
        enrolledCourses[] -> { _id, title, slug },
        wishlist[] -> { _id, title },
        cart[] -> { _id, title, price },
        createdAt
      }`,
      { email },
    );
    return user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return null;
    }

    return await getUserByEmail(session.user.email);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function addToCart(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email },
    );

    if (!user) {
      return { error: "User not found" };
    }

    const isInCart = user.cart?.some(
      (ref: { _ref: string }) => ref._ref === courseId,
    );

    if (isInCart) {
      return { error: "Already in cart" };
    }

    await client
      .patch(user._id)
      .append("cart", [{ _type: "reference", _ref: courseId }])
      .commit();

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function removeFromCart(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email },
    );

    if (!user) {
      return { error: "User not found" };
    }

    await client
      .patch(user._id)
      .unset([`cart[_ref == "${courseId}"]`])
      .commit();

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function addToWishlist(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email },
    );

    if (!user) {
      return { error: "User not found" };
    }

    const isInWishlist = user.wishlist?.some(
      (ref: { _ref: string }) => ref._ref === courseId,
    );

    if (isInWishlist) {
      return { error: "Already in wishlist" };
    }

    await client
      .patch(user._id)
      .append("wishlist", [{ _type: "reference", _ref: courseId }])
      .commit();

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function removeFromWishlist(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email },
    );

    if (!user) {
      return { error: "User not found" };
    }

    await client
      .patch(user._id)
      .unset([`wishlist[_ref == "${courseId}"]`])
      .commit();

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function enrollCourse(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email },
    );

    if (!user) {
      return { error: "User not found" };
    }

    const isEnrolled = user.enrolledCourses?.some(
      (ref: { _ref: string }) => ref._ref === courseId,
    );

    if (isEnrolled) {
      return { error: "Already enrolled" };
    }

    // Add to enrolled and remove from cart
    await client
      .patch(user._id)
      .append("enrolledCourses", [{ _type: "reference", _ref: courseId }])
      .unset([`cart[_ref == "${courseId}"]`])
      .commit();

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
