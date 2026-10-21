import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  addToCart,
  removeFromCart,
} from "@/lib/actions/sanity.actions";
import { userQueryKeys } from "@/lib/query-keys";

interface CartCacheItem {
  _id: string;
}

interface CartMutationContext {
  previousUser?: { cart?: CartCacheItem[] } | null;
}

interface UserCache {
  cart?: CartCacheItem[];
}

export const useCart = () => {
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: userQueryKeys.current(),
    queryFn: getCurrentUser,
    select: (user) => user?.cart || [],
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
    onMutate: async (courseId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userQueryKeys.current() });

      // Get previous data
      const previousUser = queryClient.getQueryData<{ cart?: CartCacheItem[] }>(
        userQueryKeys.current(),
      );

      // Optimistically update the cache
      queryClient.setQueryData<UserCache>(
        userQueryKeys.current(),
        (user) =>
          user
            ? { ...user, cart: [...(user.cart || []), { _id: courseId }] }
            : user,
      );

      return { previousUser };
    },
    onError: (_error, _courseId, context: CartMutationContext | undefined) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(userQueryKeys.current(), context.previousUser);
      }
    },
    onSuccess: async () => {
      console.log("[useCart] addToCart mutation succeeded; refreshing cart");
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.current() });
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
      await queryClient.cancelQueries({ queryKey: userQueryKeys.current() });

      // Get previous data
      const previousUser = queryClient.getQueryData<{ cart?: CartCacheItem[] }>(
        userQueryKeys.current(),
      );

      // Optimistically update the cache
      queryClient.setQueryData<UserCache>(
        userQueryKeys.current(),
        (user) => {
          if (!user) return user;
          return {
            ...user,
            cart: (user.cart || []).filter(
              (item: CartCacheItem) => item._id !== courseId,
            ),
          };
        },
      );

      return { previousUser };
    },
    onError: (_error, _courseId, context: CartMutationContext | undefined) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(userQueryKeys.current(), context.previousUser);
      }
    },
    onSuccess: async () => {
      console.log("[useCart] removeFromCart mutation succeeded; refreshing cart");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userQueryKeys.current() }),
      ]);
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
