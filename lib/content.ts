import "server-only";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { courseFallbackImage } from "@/lib/config";
import type { Course } from "@/types/course";

// Read-only Sanity content queries. Import from server components directly;
// client components go through the wrappers in `lib/actions/sanity.actions.ts`.

const builder = imageUrlBuilder(client);

const COURSE_FIELDS = `{
  _id, title, slug, description, image, price, instructor, category, level,
  duration, students, rating, learningPoints,
  "highlights": highlights[]{title},
  "modules": modules[]{title, lessons, duration},
  "faqs": faqs[]{question, answer},
  "reviews": reviews[]{author, rating, text},
  createdAt
}`;

type RawCourse = Omit<Course, "image"> & { image?: unknown };

function withImage(course: RawCourse): Course {
  return {
    ...course,
    price: Number(course.price ?? 0),
    image: course.image
      ? builder.image(course.image as never).width(1200).auto("format").url()
      : courseFallbackImage(course.category),
  };
}

export async function fetchCourses(): Promise<Course[]> {
  try {
    const rows = await client.fetch<RawCourse[]>(
      `*[_type == "course" && defined(slug.current)] | order(createdAt desc) ${COURSE_FIELDS}`,
    );
    return rows.map(withImage);
  } catch (error) {
    console.error("fetchCourses failed:", error);
    return [];
  }
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const row = await client.fetch<RawCourse | null>(
      `*[_type == "course" && slug.current == $slug][0] ${COURSE_FIELDS}`,
      { slug },
    );
    return row ? withImage(row) : null;
  } catch (error) {
    console.error("fetchCourseBySlug failed:", error);
    return null;
  }
}

export async function fetchCoursesByIds(ids: string[]): Promise<Course[]> {
  if (ids.length === 0) return [];
  try {
    const rows = await client.fetch<RawCourse[]>(
      `*[_type == "course" && _id in $ids] ${COURSE_FIELDS}`,
      { ids },
    );
    const byId = new Map(rows.map((r) => [r._id, withImage(r)]));
    return ids.map((id) => byId.get(id)).filter((c): c is Course => !!c);
  } catch (error) {
    console.error("fetchCoursesByIds failed:", error);
    return [];
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const cats = await client.fetch<(string | null)[]>(
      `array::unique(*[_type == "course"].category)`,
    );
    return cats.filter((c): c is string => !!c).sort();
  } catch {
    return [];
  }
}

/** Paid content. Only call after confirming the viewer is enrolled. */
export async function fetchCourseVideoUrl(courseId: string): Promise<string | null> {
  try {
    return await client.fetch<string | null>(
      `*[_type == "course" && _id == $courseId][0].videoUrl`,
      { courseId },
    );
  } catch {
    return null;
  }
}
