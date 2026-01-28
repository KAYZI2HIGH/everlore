import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  addToCart,
  removeFromCart,
} from "@/lib/actions/sanity.actions";

export const useCart = () => {
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const user = await getCurrentUser();
      return user?.cart || [];
    },
  });

  // Add to cart mutation with optimistic update
  const addToCartMutation = useMutation({
    mutationFn: (courseId: string) => addToCart(courseId),
    onMutate: async (courseId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Get previous data
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistically update the cache
      queryClient.setQueryData(["cart"], (old: any) => {
        // Just increment the count - we'll refetch full data on success
        return old;
      });

      return { previousCart };
    },
    onError: (error, courseId, context: any) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: () => {
      // Refetch cart to get updated data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Remove from cart mutation with optimistic update
  const removeFromCartMutation = useMutation({
    mutationFn: (courseId: string) => removeFromCart(courseId),
    onMutate: async (courseId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Get previous data
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistically update the cache
      queryClient.setQueryData(["cart"], (old: any) => {
        return old?.filter((item: any) => item._id !== courseId) || [];
      });

      return { previousCart };
    },
    onError: (error, courseId, context: any) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: () => {
      // Refetch cart to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    cartItems,
    cartCount: cartItems.length,
    isLoading,
    addToCart: addToCartMutation.mutate,
    addToCartAsync: addToCartMutation.mutateAsync,
    removeFromCart: removeFromCartMutation.mutate,
    removeFromCartAsync: removeFromCartMutation.mutateAsync,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
  };
};
