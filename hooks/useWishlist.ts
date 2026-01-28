import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  addToWishlist,
  removeFromWishlist,
} from "@/lib/actions/sanity.actions";

export const useWishlist = () => {
  const queryClient = useQueryClient();

  // Fetch wishlist items
  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const user = await getCurrentUser();
      return user?.wishlist || [];
    },
  });

  // Check if a specific course is in wishlist
  const isInWishlist = (courseId: string) => {
    return wishlistItems.some((item: any) => item._id === courseId);
  };

  // Add to wishlist mutation with optimistic update
  const addToWishlistMutation = useMutation({
    mutationFn: (courseId: string) => addToWishlist(courseId),
    onMutate: async (courseId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Get previous data
      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      // Optimistically update the cache - add a placeholder item
      queryClient.setQueryData(["wishlist"], (old: any) => {
        if (!Array.isArray(old)) return old;
        // Check if already in wishlist
        if (old.some((item: any) => item._id === courseId)) {
          return old;
        }
        // Add optimistic item
        return [...old, { _id: courseId, _optimistic: true }];
      });

      return { previousWishlist };
    },
    onError: (error, courseId, context: any) => {
      // Rollback on error
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
    },
    onSuccess: () => {
      // Refetch wishlist to get updated data with all fields
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  // Remove from wishlist mutation with optimistic update
  const removeFromWishlistMutation = useMutation({
    mutationFn: (courseId: string) => removeFromWishlist(courseId),
    onMutate: async (courseId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Get previous data
      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      // Optimistically update the cache - remove the item
      queryClient.setQueryData(["wishlist"], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.filter((item: any) => item._id !== courseId);
      });

      return { previousWishlist };
    },
    onError: (error, courseId, context: any) => {
      // Rollback on error
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
    },
    onSuccess: () => {
      // Refetch wishlist to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
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
