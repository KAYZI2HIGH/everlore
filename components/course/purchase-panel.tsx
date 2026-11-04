"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Heart, Loader2, PlayCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCourseActions } from "@/hooks/useAccount";
import { enrollInFreeCourse } from "@/lib/actions/account.actions";
import { formatPrice } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

export function PurchasePanel({ course, owned }: { course: Course; owned: boolean }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status } = useSession();
  const actions = useCourseActions();
  const [busy, setBusy] = useState<"buy" | "cart" | "free" | null>(null);
  const inCart = actions.isInCart(course._id);
  const wishlisted = actions.isWishlisted(course._id);

  if (owned) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-success">You own this course</p>
        <Button asChild size="lg" className="h-12 w-full rounded-full text-base">
          <Link href="/academy/learning">
            <PlayCircle /> Go to my learning
          </Link>
        </Button>
      </div>
    );
  }

  const enrollFree = async () => {
    if (status !== "authenticated") {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(`/academy/courses/${course.slug.current}`)}`);
      return;
    }
    setBusy("free");
    const res = await enrollInFreeCourse(course.slug.current);
    setBusy(null);
    if (!res.success) return toast.error(res.error);
    toast.success("You're enrolled!");
    queryClient.invalidateQueries({ queryKey: ["account"] });
    router.refresh();
  };

  const buyNow = async () => {
    if (inCart) return router.push("/academy/cart");
    setBusy("buy");
    const ok = await actions.addToCart(course._id);
    setBusy(null);
    if (ok) router.push("/academy/cart");
  };

  const addToCart = async () => {
    setBusy("cart");
    await actions.addToCart(course._id);
    setBusy(null);
  };

  return (
    <div className="space-y-3">
      <p className="text-4xl font-extrabold tracking-tight">{formatPrice(course.price)}</p>
      {course.price === 0 ? (
        <Button size="lg" className="h-12 w-full rounded-full text-base" onClick={enrollFree} disabled={!!busy}>
          {busy === "free" && <Loader2 className="animate-spin" />} Enroll for free
        </Button>
      ) : (
        <>
          <Button size="lg" className="h-12 w-full rounded-full text-base" onClick={buyNow} disabled={!!busy}>
            {busy === "buy" && <Loader2 className="animate-spin" />} Buy now
          </Button>
          <div className="flex gap-2">
            {inCart ? (
              <Button asChild size="lg" variant="outline" className="h-12 flex-1 rounded-full">
                <Link href="/academy/cart">
                  <ShoppingBag /> View cart
                </Link>
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="h-12 flex-1 rounded-full" onClick={addToCart} disabled={!!busy}>
                {busy === "cart" ? <Loader2 className="animate-spin" /> : <ShoppingBag />} Add to cart
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-12 rounded-full p-0"
              onClick={() => actions.toggleWishlist(course._id)}
              aria-pressed={wishlisted}
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart className={cn("size-5", wishlisted && "fill-rose-500 text-rose-500")} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
