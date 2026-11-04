"use server";

// Public, read-only content actions for client components.
// Account data (cart, wishlist, enrollments) lives in `account.actions.ts`;
// payments in `checkout.actions.ts`.

import { client } from "@/lib/sanity";
import {
  fetchCourses,
  fetchCourseBySlug,
  fetchCategories,
} from "@/lib/content";

export async function getAllCourses() {
  return fetchCourses();
}

export async function getCourseBySlug(slug: string) {
  return fetchCourseBySlug(slug);
}

export async function getUniqueCategories() {
  return fetchCategories();
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
