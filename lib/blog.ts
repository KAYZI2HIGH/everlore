import "server-only";
import { cache } from "react";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

// Server-side Sanity fetchers for the blog and careers pages.

const builder = imageUrlBuilder(client);

type SanityImage = { asset?: { _ref?: string; _id?: string }; alt?: string } & Record<string, unknown>;

export function imageUrl(image: unknown, width = 1200): string | null {
  const img = image as SanityImage | undefined;
  if (!img?.asset) return null;
  try {
    return builder.image(img as never).width(width).fit("max").auto("format").quality(80).url();
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export const BLOG_CATEGORIES: Record<string, string> = {
  business: "Business",
  trading: "Trading",
  "digital-services": "Digital Services",
  automation: "Automation",
  freelancing: "Freelancing",
  "content-creation": "Content Creation",
  "tips-tricks": "Tips & Tricks",
};

export const blogCategoryLabel = (value?: string | null) =>
  value ? (BLOG_CATEGORIES[value] ?? value.replace(/-/g, " ")) : "";

export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  image: string | null;
  author: string;
  category: string | null;
  tags: string[];
  publishedAt: string;
  featured: boolean;
  readingTime: number;
}

export interface BlogPost extends BlogPostSummary {
  content: PortableTextBlock[];
}

type RawPost = Omit<BlogPost, "image" | "readingTime" | "content" | "tags" | "featured"> & {
  image?: unknown;
  content?: PortableTextBlock[] | null;
  tags?: string[] | null;
  featured?: boolean | null;
  words?: string | null;
};

const POST_LIST_FIELDS = `{
  _id, title, "slug": slug.current, summary, image, author, category, tags,
  publishedAt, featured, "words": pt::text(content)
}`;

const POST_FIELDS = `{
  _id, title, "slug": slug.current, summary, image, author, category, tags,
  publishedAt, featured, content, "words": pt::text(content)
}`;

const WORDS_PER_MINUTE = 220;

/** Reading time in minutes from portable text (or a pre-flattened string). */
export function readingTime(content: PortableTextBlock[] | string | null | undefined): number {
  let text = "";
  if (typeof content === "string") {
    text = content;
  } else if (Array.isArray(content)) {
    text = content
      .map((block) => {
        const children = (block as { children?: { text?: string }[] }).children;
        return Array.isArray(children) ? children.map((c) => c.text ?? "").join("") : "";
      })
      .join(" ");
  }
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function toSummary(raw: RawPost): BlogPostSummary {
  return {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug,
    summary: raw.summary ?? "",
    image: imageUrl(raw.image, 1400),
    author: raw.author ?? "Everlore",
    category: raw.category ?? null,
    tags: raw.tags ?? [],
    publishedAt: raw.publishedAt,
    featured: Boolean(raw.featured),
    readingTime: readingTime(raw.content ?? raw.words),
  };
}

export const getPosts = cache(async (): Promise<BlogPostSummary[]> => {
  try {
    const rows = await client.fetch<RawPost[]>(
      `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) ${POST_LIST_FIELDS}`,
    );
    return (rows ?? []).map(toSummary);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const raw = await client.fetch<RawPost | null>(
      `*[_type == "blogPost" && slug.current == $slug][0] ${POST_FIELDS}`,
      { slug },
    );
    if (!raw) return null;
    return { ...toSummary(raw), content: raw.content ?? [] };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
});

export async function getRelatedPosts(
  post: Pick<BlogPostSummary, "_id" | "category">,
  limit = 3,
): Promise<BlogPostSummary[]> {
  if (!post.category) return [];
  try {
    const rows = await client.fetch<RawPost[]>(
      `*[_type == "blogPost" && defined(slug.current) && category == $category && _id != $id]
        | order(publishedAt desc)[0...$limit] ${POST_LIST_FIELDS}`,
      { category: post.category, id: post._id, limit },
    );
    return (rows ?? []).map(toSummary);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Careers                                                             */
/* ------------------------------------------------------------------ */

export interface JobPosting {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  salary: string | null;
  tags: string[];
  postedAt: string;
}

type RawJob = Omit<JobPosting, "tags" | "salary"> & { tags?: string[] | null; salary?: string | null };

const JOB_FIELDS = `{
  _id, title, "slug": slug.current, department, location, type, level,
  description, salary, tags, postedAt
}`;

const toJob = (raw: RawJob): JobPosting => ({
  ...raw,
  department: raw.department ?? "General",
  description: raw.description ?? "",
  salary: raw.salary || null,
  tags: raw.tags ?? [],
});

export const getJobs = cache(async (): Promise<JobPosting[]> => {
  try {
    const rows = await client.fetch<RawJob[]>(
      `*[_type == "jobPosting" && defined(slug.current)] | order(postedAt desc) ${JOB_FIELDS}`,
    );
    return (rows ?? []).map(toJob);
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return [];
  }
});

export const getJobBySlug = cache(async (slug: string): Promise<JobPosting | null> => {
  try {
    const raw = await client.fetch<RawJob | null>(
      `*[_type == "jobPosting" && slug.current == $slug][0] ${JOB_FIELDS}`,
      { slug },
    );
    return raw ? toJob(raw) : null;
  } catch (error) {
    console.error("Error fetching job posting:", error);
    return null;
  }
});

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

export function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
