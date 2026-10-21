"use server";

import type { Session } from "next-auth";
import { client, freshClient } from "@/lib/sanity";
import { auth } from "@/lib/auth";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

async function getUserBySession(session: Session | null) {
  if (!session?.user) return null;

  const userId = session.user.id as string | undefined;
  const email = session.user.email as string | undefined;

  if (userId) {
    const byId = await freshClient.fetch(
      `*[_type == "user" && _id == $userId][0] {
        _id,
        name,
        email,
        image,
        enrolledCourses[] -> { _id, title, slug },
        wishlist[] -> { _id, title, slug, instructor, price, rating, students, image, category, level, description },
        cart[] -> { _id, title, price, instructor, image, rating, level, category, students, description },
        createdAt
      }`,
      { userId },
    );

    if (byId) return byId;
  }

  if (email) {
    return getUserByEmail(email);
  }

  return null;
}

export async function getUserByEmail(email: string) {
  try {
    const user = await freshClient.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        name,
        email,
        image,
        enrolledCourses[] -> { _id, title, slug },
        wishlist[] -> { _id, title, slug, instructor, price, rating, students, image, category, level, description },
        cart[] -> { _id, title, price, instructor, image, rating, level, category, students, description },
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
    if (!session?.user) {
      return null;
    }

    return await getUserBySession(session);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function addToCart(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    const user = await freshClient.fetch(
      `*[_type == "user" && (_id == $userId || email == $email)][0] {
        _id,
        "cartRefs": cart[]{_ref}
      }`,
      {
        userId: session.user.id || "",
        email: session.user.email || "",
      },
    );

    if (!user) {
      return { error: "User not found" };
    }

    console.log("[addToCart] before commit:", {
      userId: user._id,
      courseId,
      cartRefs: user.cartRefs || [],
    });

    const isInCart = user.cartRefs?.some(
      (ref: { _ref: string }) => ref._ref === courseId,
    );

    if (isInCart) {
      return { error: "Already in cart" };
    }

    const cartReference = {
      _key: `cart-${courseId}-${Date.now()}`,
      _type: "reference",
      _ref: courseId,
    };

    const cartPatch = freshClient.patch(user._id);

    if (Array.isArray(user.cartRefs)) {
      await cartPatch.append("cart", [cartReference]).commit();
    } else {
      await cartPatch.set({ cart: [cartReference] }).commit();
    }

    const updatedUser = await freshClient.fetch(
      `*[_id == $userId][0] {
        _id,
        "cartRefs": cart[]{_ref}
      }`,
      { userId: user._id },
    );

    console.log("[addToCart] after commit:", {
      userId: user._id,
      courseId,
      cartRefs: updatedUser?.cartRefs || [],
    });

    if (
      !updatedUser?.cartRefs?.some(
        (ref: { _ref: string }) => ref._ref === courseId,
      )
    ) {
      return { error: "Cart update could not be verified" };
    }

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

    const user = await freshClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email },
    );

    if (!user) {
      return { error: "User not found" };
    }

    await freshClient
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
      .append("wishlist", [
        {
          _key: `wishlist-${courseId}-${Date.now()}`,
          _type: "reference",
          _ref: courseId,
        },
      ])
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
      .append("enrolledCourses", [
        {
          _key: `enrolled-${courseId}-${Date.now()}`,
          _type: "reference",
          _ref: courseId,
        },
      ])
      .unset([`cart[_ref == "${courseId}"]`])
      .commit();

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// Course-related actions
export async function getAllCourses() {
  try {
    const courses = await client.fetch(
      `*[_type == "course"] | order(createdAt desc) {
        _id,
        title,
        slug,
        description,
        image,
        price,
        instructor,
        category,
        level,
        duration,
        students,
        rating,
        videoUrl,
        learningPoints,
        "highlights": highlights[]{title},
        "modules": modules[]{title, lessons, duration},
        "faqs": faqs[]{question, answer},
        "reviews": reviews[]{author, rating, text},
        createdAt
      }`,
    );
    return courses.map((course: any) => ({
      ...course,
      image: course.image ? builder.image(course.image).url() : "/academy.avif",
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function getCoursesByCategory(category: string) {
  try {
    const courses = await client.fetch(
      `*[_type == "course" && category == $category] | order(createdAt desc) {
        _id,
        title,
        slug,
        description,
        image,
        price,
        instructor,
        category,
        level,
        duration,
        students,
        rating,
        videoUrl,
        learningPoints,
        "highlights": highlights[]{title},
        "modules": modules[]{title, lessons, duration},
        "faqs": faqs[]{question, answer},
        "reviews": reviews[]{author, rating, text},
        createdAt
      }`,
      { category },
    );
    return courses.map((course: any) => ({
      ...course,
      image: course.image ? builder.image(course.image).url() : "/academy.avif",
    }));
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    return [];
  }
}

export async function searchCourses(searchTerm: string) {
  try {
    const courses = await client.fetch(
      `*[_type == "course" && (title match $searchTerm || description match $searchTerm || instructor match $searchTerm)] | order(createdAt desc) {
        _id,
        title,
        slug,
        description,
        image,
        price,
        instructor,
        category,
        level,
        duration,
        students,
        rating,
        videoUrl,
        learningPoints,
        "highlights": highlights[]{title},
        "modules": modules[]{title, lessons, duration},
        "faqs": faqs[]{question, answer},
        "reviews": reviews[]{author, rating, text},
        createdAt
      }`,
      { searchTerm: `*${searchTerm}*` },
    );
    return courses.map((course: any) => ({
      ...course,
      image: course.image ? builder.image(course.image).url() : "/academy.avif",
    }));
  } catch (error) {
    console.error("Error searching courses:", error);
    return [];
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const course = await client.fetch(
      `*[_type == "course" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        image,
        price,
        instructor,
        category,
        level,
        duration,
        students,
        rating,
        videoUrl,
        learningPoints,
        "highlights": highlights[]{title},
        "modules": modules[]{title, lessons, duration},
        "faqs": faqs[]{question, answer},
        "reviews": reviews[]{author, rating, text},
        createdAt
      }`,
      { slug },
    );
    if (!course) return null;
    return {
      ...course,
      image: course.image ? builder.image(course.image).url() : "/academy.avif",
    };
  } catch (error) {
    console.error("Error fetching course by slug:", error);
    return null;
  }
}

export async function getCourseById(courseId: string) {
  try {
    const course = await client.fetch(
      `*[_type == "course" && _id == $courseId][0] {
        _id,
        title,
        slug,
        description,
        image,
        price,
        instructor,
        category,
        level,
        duration,
        students,
        rating,
        videoUrl,
        learningPoints,
        "highlights": highlights[]{title},
        "modules": modules[]{title, lessons, duration},
        "faqs": faqs[]{question, answer},
        "reviews": reviews[]{author, rating, text},
        createdAt
      }`,
      { courseId },
    );
    if (!course) return null;
    return {
      ...course,
      image: course.image ? builder.image(course.image).url() : "/academy.avif",
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export async function getUniqueCategories() {
  try {
    const categories = await client.fetch(
      `array::unique(*[_type == "course"].category)`,
    );
    return (categories || []).sort();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function enrollUserInCourses(courseIds: string[]) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      console.error("❌ Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    console.log("📝 Fetching user with email:", session.user.email);

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email },
    );

    if (!user) {
      console.error("❌ User not found:", session.user.email);
      return { success: false, error: "User not found" };
    }

    console.log("✓ User found:", user._id);
    console.log("📚 Enrolling user in courses:", courseIds);

    // Add courses to enrolledCourses
    const enrollmentRefs = courseIds.map((id) => ({
      _type: "reference",
      _ref: id,
    }));

    const result = await client
      .patch(user._id)
      .append("enrolledCourses", enrollmentRefs)
      .set({ cart: [] }) // Clear cart after enrollment
      .commit();

    console.log("✓ Enrollment committed to Sanity:", result._id);

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Enrollment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function verifyPaystackPayment(reference: string) {
  try {
    console.log("🔍 Verifying payment with Paystack reference:", reference);

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (!response.ok) {
      console.error(
        "❌ Paystack API error:",
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `HTTP ${response.status}: Failed to verify payment`,
      };
    }

    const data = await response.json();

    console.log("✓ Paystack API response:", {
      status: data.status,
      transactionStatus: data.data?.status,
      reference: data.data?.reference,
      amount: data.data?.amount,
    });

    // IMPORTANT: According to Paystack docs:
    // - response.status indicates if the API call was successful
    // - response.data.status indicates if the transaction was successful
    if (!data.status) {
      console.error("❌ Paystack API call failed");
      return { success: false, error: "Paystack API call was not successful" };
    }

    if (data.data?.status !== "success") {
      console.error("❌ Transaction status is not success:", data.data?.status);
      return {
        success: false,
        error: `Transaction status: ${data.data?.status}`,
      };
    }

    console.log("✓ Payment verified successfully!");
    return { success: true, data: data.data };
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}

export async function getAllBlogPosts() {
  try {
    const posts = await client.fetch(
      `*[_type == "blogPost"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        summary,
        image,
        author,
        category,
        tags,
        publishedAt,
        featured
      }`,
    );
    return posts || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        summary,
        content,
        image,
        author,
        category,
        tags,
        publishedAt,
        featured
      }`,
      { slug },
    );
    return post || null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function getBlogPostsByCategory(category: string) {
  try {
    const posts = await client.fetch(
      `*[_type == "blogPost" && category == $category] | order(publishedAt desc) {
        _id,
        title,
        slug,
        summary,
        image,
        author,
        category,
        tags,
        publishedAt,
        featured
      }`,
      { category },
    );
    return posts || [];
  } catch (error) {
    console.error("Error fetching blog posts by category:", error);
    return [];
  }
}

export async function getFeaturedBlogPosts() {
  try {
    const posts = await client.fetch(
      `*[_type == "blogPost" && featured == true] | order(publishedAt desc) {
        _id,
        title,
        slug,
        summary,
        image,
        author,
        category,
        tags,
        publishedAt,
        featured
      }`,
    );
    return posts || [];
  } catch (error) {
    console.error("Error fetching featured blog posts:", error);
    return [];
  }
}

export async function getAllJobPostings() {
  try {
    const jobs = await client.fetch(
      `*[_type == "jobPosting"] | order(postedAt desc) {
        _id,
        title,
        slug,
        department,
        location,
        type,
        level,
        description,
        salary,
        tags,
        postedAt
      }`,
    );
    return jobs || [];
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return [];
  }
}

export async function getJobPostingBySlug(slug: string) {
  try {
    const job = await client.fetch(
      `*[_type == "jobPosting" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        department,
        location,
        type,
        level,
        description,
        salary,
        tags,
        postedAt
      }`,
      { slug },
    );
    return job || null;
  } catch (error) {
    console.error("Error fetching job posting:", error);
    return null;
  }
}
