"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { addToCart, getMyCart, removeFromCart } from "@/lib/actions/account.actions";
import type { Course } from "@/types/course";

const KEY = ["cart"];

const unwrap = async (p: Promise<{ success: true } | { success: false; error: string }>) => {
  const res = await p;
  if (!res.success) throw new Error(res.error);
};

/** The signed-in user's cart, keyed ["cart"]. */
export const useCart = () => {
  const queryClient = useQueryClient();
  const { status } = useSession();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: KEY,
    enabled: status === "authenticated",
    queryFn: () => getMyCart(),
  });

  const settle = () => {
    queryClient.invalidateQueries({ queryKey: KEY });
    queryClient.invalidateQueries({ queryKey: ["account"] });
  };

  const add = useMutation({
    mutationFn: (courseId: string) => unwrap(addToCart(courseId)),
    onSettled: settle,
  });

  const remove = useMutation({
    mutationFn: (courseId: string) => unwrap(removeFromCart(courseId)),
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const previous = queryClient.getQueryData<Course[]>(KEY);
      queryClient.setQueryData<Course[]>(KEY, (old = []) => old.filter((c) => c._id !== courseId));
      return { previous };
    },
    onError: (_e, _id, ctx) => ctx?.previous && queryClient.setQueryData(KEY, ctx.previous),
    onSettled: settle,
  });

  return {
    cartItems,
    cartCount: cartItems.length,
    isLoading: status === "loading" || (status === "authenticated" && isLoading),
    addToCart: add.mutate,
    addToCartAsync: add.mutateAsync,
    removeFromCart: remove.mutate,
    removeFromCartAsync: remove.mutateAsync,
    isAddingToCart: add.isPending,
    isRemovingFromCart: remove.isPending,
  };
};
