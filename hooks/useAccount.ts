"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getMyAccount } from "@/lib/actions/account.actions";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

/** Signed-in user's ownership state, keyed ["account"]. Null when signed out. */
export function useAccount() {
  const { status } = useSession();
  return useQuery({
    queryKey: ["account"],
    queryFn: () => getMyAccount(),
    enabled: status === "authenticated",
  });
}

/** Cart + wishlist actions for course cards, with sign-in redirect and toasts. */
export function useCourseActions() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { data: account } = useAccount();
  const cart = useCart();
  const wishlist = useWishlist();

  const requireAuth = () => {
    if (status !== "authenticated") {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
      return false;
    }
    return true;
  };

  const owned = new Set(account?.enrolledCourseIds ?? []);
  const inCart = new Set(cart.cartItems.map((c) => c._id));

  return {
    isOwned: (id: string) => owned.has(id),
    isInCart: (id: string) => inCart.has(id),
    isWishlisted: (id: string) => wishlist.isInWishlist(id),
    addToCart: async (id: string) => {
      if (!requireAuth()) return false;
      try {
        await cart.addToCartAsync(id);
        toast.success("Added to cart");
        return true;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not add to cart");
        return false;
      }
    },
    toggleWishlist: async (id: string) => {
      if (!requireAuth()) return;
      const was = wishlist.isInWishlist(id);
      try {
        await wishlist.toggleWishlistAsync(id);
        toast.success(was ? "Removed from wishlist" : "Saved to wishlist");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not update wishlist");
      }
    },
  };
}
