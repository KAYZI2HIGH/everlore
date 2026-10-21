import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  addToCart,
  removeFromCart,
} from "@/lib/actions/sanity.actions";

interface CartCacheItem {
  _id: string;
}

interface CartMutationContext {
  previousCart?: CartCacheItem[];
}

export const useCart = () => {
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const user = await getCurrentUser();
      const cart = user?.cart || [];

      console.log("[useCart] fetched cart:", {
        count: cart.length,
        ids: cart.map((item: { _id: string }) => item._id),
      });

      return cart;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  // Add to cart mutation with optimistic update
  const addToCartMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const result = await addToCart(courseId);

      console.log("[useCart] addToCart result:", {
        courseId,
        result,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Get previous data
      const previousCart = queryClient.getQueryData<CartCacheItem[]>(["cart"]);

      // Optimistically update the cache
      queryClient.setQueryData<CartCacheItem[]>(["cart"], (old) => {
        // Just increment the count - we'll refetch full data on success
        return old;
      });

      return { previousCart };
    },
    onError: (_error, _courseId, context: CartMutationContext | undefined) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: async () => {
      console.log("[useCart] addToCart mutation succeeded; refreshing cart");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["user"] }),
        queryClient.invalidateQueries({ queryKey: ["learning"] }),
      ]);
      await queryClient.refetchQueries({ queryKey: ["cart"], type: "all" });
    },
  });

  // Remove from cart mutation with optimistic update
  const removeFromCartMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const result = await removeFromCart(courseId);

      console.log("[useCart] removeFromCart result:", {
        courseId,
        result,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onMutate: async (courseId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Get previous data
      const previousCart = queryClient.getQueryData<CartCacheItem[]>(["cart"]);

      // Optimistically update the cache
      queryClient.setQueryData<CartCacheItem[]>(["cart"], (old) => {
        return old?.filter((item) => item._id !== courseId) || [];
      });

      return { previousCart };
    },
    onError: (_error, _courseId, context: CartMutationContext | undefined) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: async () => {
      console.log("[useCart] removeFromCart mutation succeeded; refreshing cart");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["user"] }),
      ]);
      await queryClient.refetchQueries({ queryKey: ["cart"], type: "all" });
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
