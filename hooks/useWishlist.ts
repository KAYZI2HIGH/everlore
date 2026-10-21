import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  addToWishlist,
  removeFromWishlist,
} from "@/lib/actions/sanity.actions";
import { userQueryKeys } from "@/lib/query-keys";

export const useWishlist = () => {
  const queryClient = useQueryClient();

  // Fetch wishlist items
  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: userQueryKeys.current(),
    queryFn: getCurrentUser,
    select: (user) => user?.wishlist || [],
  });

  // Check if a specific course is in wishlist
  const isInWishlist = (courseId: string) => {
    return wishlistItems.some((item: any) => item._id === courseId);
  };

  // Add to wishlist mutation with optimistic update
  const addToWishlistMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const result = await addToWishlist(courseId);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onMutate: async (courseId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userQueryKeys.current() });

      // Get previous data
      const previousUser = queryClient.getQueryData(
        userQueryKeys.current(),
      );

      // Optimistically update the cache - add a placeholder item
      queryClient.setQueryData(userQueryKeys.current(), (user: any) => {
        if (!user) return user;
        // Check if already in wishlist
        if ((user.wishlist || []).some((item: any) => item._id === courseId)) {
          return user;
        }
        // Add optimistic item
        return {
          ...user,
          wishlist: [...(user.wishlist || []), { _id: courseId, _optimistic: true }],
        };
      });

      return { previousUser };
    },
    onError: (error, courseId, context: any) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          userQueryKeys.current(),
          context.previousUser,
        );
      }
    },
    onSuccess: async () => {
      // Refetch wishlist to get updated data with all fields
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.current() });
    },
  });

  // Remove from wishlist mutation with optimistic update
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const result = await removeFromWishlist(courseId);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onMutate: async (courseId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userQueryKeys.current() });

      // Get previous data
      const previousUser = queryClient.getQueryData(
        userQueryKeys.current(),
      );

      // Optimistically update the cache - remove the item
      queryClient.setQueryData(userQueryKeys.current(), (user: any) => {
        if (!user) return user;
        return {
          ...user,
          wishlist: (user.wishlist || []).filter(
            (item: any) => item._id !== courseId,
          ),
        };
      });

      return { previousUser };
    },
    onError: (error, courseId, context: any) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          userQueryKeys.current(),
          context.previousUser,
        );
      }
    },
    onSuccess: async () => {
      // Refetch wishlist to ensure consistency
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.current() });
    },
  });

  const toggleWishlist = (courseId: string) => {
    if (isInWishlist(courseId)) {
      removeFromWishlistMutation.mutate(courseId);
    } else {
      addToWishlistMutation.mutate(courseId);
    }
  };

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isLoading,
    addToWishlist: addToWishlistMutation.mutate,
    addToWishlistAsync: addToWishlistMutation.mutateAsync,
    removeFromWishlist: removeFromWishlistMutation.mutateAsync,
    removeFromWishlistAsync: removeFromWishlistMutation.mutateAsync,
    toggleWishlist,
    toggleWishlistAsync: async (courseId: string) => {
      if (isInWishlist(courseId)) {
        return removeFromWishlistMutation.mutateAsync(courseId);
      } else {
        return addToWishlistMutation.mutateAsync(courseId);
      }
    },
    isInWishlist,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
  };
};
