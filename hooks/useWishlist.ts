"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { addToWishlist, getMyWishlist, removeFromWishlist } from "@/lib/actions/account.actions";
import type { Course } from "@/types/course";

const KEY = ["wishlist"];

const unwrap = async (p: Promise<{ success: true } | { success: false; error: string }>) => {
  const res = await p;
  if (!res.success) throw new Error(res.error);
};

/**
 * The signed-in user's wishlist, keyed ["wishlist"]. Adding inserts an
 * optimistic `{ _id }` placeholder until the refetch returns the full course,
 * so consumers rendering cards should skip items without a slug.
 */
export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { status } = useSession();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: KEY,
    enabled: status === "authenticated",
    queryFn: () => getMyWishlist(),
  });

  const isInWishlist = (courseId: string) => wishlistItems.some((c) => c._id === courseId);

  const optimistic = (update: (old: Course[], id: string) => Course[]) => ({
    onMutate: async (courseId: string) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const previous = queryClient.getQueryData<Course[]>(KEY);
      queryClient.setQueryData<Course[]>(KEY, (old = []) => update(old, courseId));
      return { previous };
    },
    onError: (_e: Error, _id: string, ctx?: { previous?: Course[] }) =>
      ctx?.previous && queryClient.setQueryData(KEY, ctx.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });

  const add = useMutation({
    mutationFn: (courseId: string) => unwrap(addToWishlist(courseId)),
    ...optimistic((old, id) =>
      old.some((c) => c._id === id) ? old : [...old, { _id: id } as Course],
    ),
  });

  const remove = useMutation({
    mutationFn: (courseId: string) => unwrap(removeFromWishlist(courseId)),
    ...optimistic((old, id) => old.filter((c) => c._id !== id)),
  });

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isLoading: status === "loading" || (status === "authenticated" && isLoading),
    isInWishlist,
    addToWishlistAsync: add.mutateAsync,
    removeFromWishlistAsync: remove.mutateAsync,
    toggleWishlistAsync: (courseId: string) =>
      isInWishlist(courseId) ? remove.mutateAsync(courseId) : add.mutateAsync(courseId),
  };
};
