"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const [couponCode, setCouponCode] = useState("");
  const [togglingWishlist, setTogglingWishlist] = useState<string | null>(null);
  const [removingFromCart, setRemovingFromCart] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { cartItems, isLoading, removeFromCart, removeFromCartAsync } =
    useCart();
  const { isInWishlist, toggleWishlistAsync } = useWishlist();
  const { initializePayment, isProcessing } = usePaystack();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUserEmail(user?.email || null);
    };
    fetchUser();
  }, []);

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
      router.push("/academy/learning");
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error?.message || "Payment failed");
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
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 py-4 border-b border-slate-200">
        <BreadcrumbUI
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/academy/cart" },
          ]}
        />
      </div>

      {/* Header Section */}
      <div className="px-6 md:px-20 py-12 border-b border-slate-200">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="text-slate-600 text-base">
            {cartItems.length} course{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="px-6 md:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ?
              <div className="text-center py-12">
                <p className="text-slate-600">Loading cart...</p>
              </div>
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
                  <p className="text-slate-900 text-lg font-semibold">
                    Your cart is empty
                  </p>
                  <p className="text-slate-600 text-sm max-w-md">
                    Start exploring our courses and add them to your cart to get
                    started on your learning journey.
                  </p>
                </div>
                <Link href="/academy/courses">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            : cartItems.map((item: CartItem) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg p-6 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-32 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-200">
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
                        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-600 mb-2">
                        By {item.instructor}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="text-xs bg-slate-100"
                        >
                          📚 {item.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs bg-slate-100"
                        >
                          {item.level}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-3 text-xs text-slate-600 mb-3">
                        <span>⭐ {item.rating}</span>
                        <span>👥 {item.students} students</span>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm line-through text-slate-400">
                            ₦{(item.price * 1.5).toLocaleString()}
                          </span>
                          <span className="text-lg font-bold text-slate-900">
                            ₦{item.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex gap-4 text-sm">
                          <button
                            onClick={() => handleRemoveFromCart(item._id)}
                            disabled={removingFromCart === item._id}
                            className="text-slate-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            {removingFromCart === item._id ?
                              "Removing..."
                            : "Remove"}
                          </button>
                          <button
                            onClick={() => handleToggleWishlist(item._id)}
                            disabled={togglingWishlist === item._id}
                            className="text-slate-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-slate-200 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-6">Total</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Original price</span>
                  <span className="text-slate-900 line-through">
                    ₦{originalTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Discount offer</span>
                  <span className="text-red-600 font-semibold">
                    -₦{discount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Discount percent</span>
                  <span className="text-slate-900 font-semibold">
                    {discountPercent}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total course</span>
                  <span className="text-slate-900 font-semibold">
                    {cartItems.length}
                  </span>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="text-2xl font-bold text-slate-900">
                  ₦{currentTotal.toLocaleString()}
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 mb-4 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Checkout →"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
