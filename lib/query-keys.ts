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
