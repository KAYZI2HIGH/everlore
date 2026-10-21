export const academyQueryKeys = {
  all: ["academy"] as const,
  courses: () => [...academyQueryKeys.all, "courses"] as const,
  course: (slug: string) =>
    [...academyQueryKeys.courses(), "detail", slug] as const,
  categories: () => [...academyQueryKeys.all, "categories"] as const,
  cart: () => [...academyQueryKeys.all, "cart"] as const,
  wishlist: () => [...academyQueryKeys.all, "wishlist"] as const,
  learning: () => [...academyQueryKeys.all, "learning"] as const,
};

export const userQueryKeys = {
  current: () => ["user", "current"] as const,
};

export const contentQueryKeys = {
  blog: {
    all: () => ["content", "blog"] as const,
    list: () => [...contentQueryKeys.blog.all(), "list"] as const,
    detail: (slug: string) =>
      [...contentQueryKeys.blog.all(), "detail", slug] as const,
  },
  jobs: {
    all: () => ["content", "jobs"] as const,
    list: () => [...contentQueryKeys.jobs.all(), "list"] as const,
    detail: (slug: string) =>
      [...contentQueryKeys.jobs.all(), "detail", slug] as const,
  },
};
