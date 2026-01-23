import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  addToCart,
  removeFromCart,
  addToWishlist,
  removeFromWishlist,
  enrollCourse,
} from "@/lib/actions/sanity.actions";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: () => getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCart() {
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: (courseId: string) => addToCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (courseId: string) => removeFromCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });

  return {
    addToCart: addToCartMutation,
    removeFromCart: removeFromCartMutation,
  };
}

export function useWishlist() {
  const queryClient = useQueryClient();

  const addToWishlistMutation = useMutation({
    mutationFn: (courseId: string) => addToWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (courseId: string) => removeFromWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });

  return {
    addToWishlist: addToWishlistMutation,
    removeFromWishlist: removeFromWishlistMutation,
  };
}

export function useEnrollment() {
  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => enrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });

  return { enroll: enrollMutation };
}
