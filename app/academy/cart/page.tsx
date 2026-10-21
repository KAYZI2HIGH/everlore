"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { usePaystack } from "@/hooks/usePaystack";
import { getCurrentUser } from "@/lib/actions/sanity.actions";
import { toast } from "sonner";

interface CartItem {
  _id: string;
  title: string;
  instructor: string;
  image: string;
  price: number;
  rating: number;
  level: string;
  category: string;
  students: number;
  description: string;
}

const CartPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");
  const [togglingWishlist, setTogglingWishlist] = useState<string | null>(null);
  const [removingFromCart, setRemovingFromCart] = useState<string | null>(null);
  const { cartItems, isLoading, removeFromCart, removeFromCartAsync } =
    useCart();
  const { isInWishlist, toggleWishlistAsync } = useWishlist();
  const { initializePayment, isProcessing } = usePaystack(queryClient);

  // Fetch user data with React Query
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
  });

  const userEmail = user?.email || null;

  const handleRemoveFromCart = async (courseId: string) => {
    setRemovingFromCart(courseId);
    try {
      await removeFromCartAsync(courseId);
    } finally {
      setRemovingFromCart(null);
    }
  };

  const handleToggleWishlist = async (courseId: string) => {
    setTogglingWishlist(courseId);
    try {
      await toggleWishlistAsync(courseId);
    } finally {
      setTogglingWishlist(null);
    }
  };

  const handleCheckout = async () => {
    if (!userEmail) {
      toast.error("Please log in to checkout");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const courseIds = cartItems.map((item: CartItem) => item._id);
      const total = cartItems.reduce(
        (sum: number, item: CartItem) => sum + item.price,
        0,
      );

      console.log("Starting checkout with:", { courseIds, total, userEmail });

      await initializePayment({
        email: userEmail,
        amount: total,
        courseIds,
      });

      console.log("Payment completed successfully");
      toast.success("Payment successful! Courses added to your learning");
      router.push("/profile?my-learning");
    } catch (error: unknown) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
    }
  };

  const calculateTotals = () => {
    const originalTotal = cartItems.reduce((sum: number, item: CartItem) => {
      // Assuming original price is 1.5x the current price
      return sum + item.price * 1.5;
    }, 0);
    const currentTotal = cartItems.reduce(
      (sum: number, item: CartItem) => sum + item.price,
      0,
    );
    const discount = originalTotal - currentTotal;
    const discountPercent = Math.round((discount / originalTotal) * 100);

    return { originalTotal, currentTotal, discount, discountPercent };
  };

  const { originalTotal, currentTotal, discount, discountPercent } =
    calculateTotals();

  return (
    <div className="bg-background">

      {/* Cart Content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-4 space-y-6">
            {isLoading ?
              <Card className="border-border p-12 text-center shadow-none">
                <Skeleton className="mx-auto h-5 w-40" />
                <Skeleton className="mx-auto mt-3 h-4 w-56" />
              </Card>
            : cartItems.length === 0 ?
              <div className="flex flex-col items-center justify-center py-16 gap-6">
                <div className="relative w-64 h-48">
                  <Image
                    src="/empty-cart.svg"
                    alt="Empty cart illustration"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-lg font-semibold text-foreground">
                    Your cart is empty
                  </p>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Start exploring our courses and add them to your cart to get
                    started on your learning journey.
                  </p>
                </div>
                <Link href="/academy/courses">
                  <Button className="bg-academy-accent text-academy-accent-foreground hover:bg-academy-accent/90">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            : cartItems.map((item: CartItem) => (
                <div
                  key={item._id}
                  className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-academy-accent/50"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.image || "/academy.avif"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/academy/courses`}>
                        <h3 className="mb-1 line-clamp-2 font-semibold text-brand transition-colors hover:text-academy-accent">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="mb-2 text-xs text-muted-foreground">
                        By {item.instructor}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="bg-muted text-xs"
                        >
                          📚 {item.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-muted text-xs"
                        >
                          {item.level}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="mb-3 flex gap-3 text-xs text-muted-foreground">
                        <span>⭐ {item.rating}</span>
                        <span>👥 {item.students} students</span>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground line-through">
                            ₦{(item.price * 1.5).toLocaleString()}
                          </span>
                          <span className="text-lg font-bold text-foreground">
                            ₦{item.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex gap-4 text-sm">
                          <button
                            onClick={() => handleRemoveFromCart(item._id)}
                            disabled={removingFromCart === item._id}
                            className="flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            {removingFromCart === item._id ?
                              "Removing..."
                            : "Remove"}
                          </button>
                          <button
                            onClick={() => handleToggleWishlist(item._id)}
                            disabled={togglingWishlist === item._id}
                            className="flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                isInWishlist(item._id) ?
                                  "fill-red-500 text-red-500"
                                : ""
                              }`}
                            />
                            {isInWishlist(item._id) ?
                              "Remove from wishlist"
                            : "Wishlist"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 border-border bg-brand p-6 shadow-none">
              <h2 className="mb-6 font-semibold text-white">Total</h2>

              <div className="mb-2 space-y-4 border-b border-border pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white">Original price</span>
                  <span className="text-white line-through">
                    ₦{originalTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white">Discount offer</span>
                  <span className="text-red-600 font-semibold">
                    -₦{discount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white">Discount percent</span>
                  <span className="font-semibold text-white">
                    {discountPercent}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white">Total course</span>
                  <span className="font-semibold text-white">
                    {cartItems.length}
                  </span>
                </div>
              </div>

              <div className="mb-2 border-b border-border pb-6">
                <div className="text-2xl font-bold text-white">
                  ₦{currentTotal.toLocaleString()}
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0}
                className="mb-4 w-full font-semibold disabled:opacity-50 bg-white text-black"
              >
                {isProcessing ? "Processing..." : "Checkout →"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
