"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface WishlistItem {
  _id: string;
  title: string;
  slug: { current: string };
  instructor: string;
  price: number;
  rating: number;
  students: number;
  image: string;
  category: string;
  level: string;
  description: string;
}

const WishlistPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingWishlist, setTogglingWishlist] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [addingAllToCart, setAddingAllToCart] = useState(false);
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();
  const { addToCartAsync } = useCart();

  const filteredItems = wishlistItems.filter(
    (item: WishlistItem) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRemoveFromWishlist = async (courseId: string) => {
    setTogglingWishlist(courseId);
    try {
      await removeFromWishlist(courseId);
      toast.success("Removed from wishlist!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove from wishlist");
    } finally {
      setTogglingWishlist(null);
    }
  };

  const handleAddToCart = async (courseId: string) => {
    setAddingToCart(courseId);
    try {
      await addToCartAsync(courseId);
      toast.success("Course added to cart!");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error?.message || "Failed to add course to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleAddAllToCart = async () => {
    if (wishlistItems.length === 0) return;

    setAddingAllToCart(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const item of wishlistItems) {
        try {
          await addToCartAsync(item._id);
          successCount++;
        } catch (error) {
          console.error(`Failed to add ${item.title}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          `Added ${successCount} course${successCount > 1 ? "s" : ""} to cart!`,
        );
      }
      if (errorCount > 0) {
        toast.error(
          `Failed to add ${errorCount} course${errorCount > 1 ? "s" : ""}`,
        );
      }
    } finally {
      setAddingAllToCart(false);
    }
  };

  const totalValue = wishlistItems.reduce(
    (sum: number, item: WishlistItem) => sum + item.price,
    0,
  );
  const savings = wishlistItems.reduce(
    (sum: number, item: WishlistItem) => sum + (item.price * 1.5 - item.price),
    0,
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 py-4 border-b border-slate-200">
        <BreadcrumbUI
          items={[
            { label: "Home", href: "/" },
            { label: "Academy", href: "/academy/courses" },
            { label: "Wishlist", href: "/academy/wishlist" },
          ]}
        />
      </div>

      {/* Header */}
      <div className="px-6 md:px-20 py-8 pb-0">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Wishlist</h1>
        <p className="text-slate-600">
          Manage your wishlist items and add them to your cart when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 md:px-20 py-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3"
              />
            </div>
          </div>

          {isLoading ?
            <div className="py-12 text-center">
              <p className="text-slate-600">Loading your wishlist...</p>
            </div>
          : filteredItems.length === 0 ?
            <div className="py-12 text-center">
              <p className="text-slate-600 text-lg mb-4">
                {searchQuery ?
                  "No courses found in your wishlist"
                : "Your wishlist is empty"}
              </p>
              <Link href="/academy/courses">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Browse Courses
                </Button>
              </Link>
            </div>
          : <div className="space-y-3">
              {filteredItems.map((item: WishlistItem) => (
                <div
                  key={item._id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <Link
                      href={`/academy/courses/${item.slug?.current || item._id}`}
                    >
                      <div className="relative w-24 h-24 rounded overflow-hidden bg-slate-200 shrink-0 hover:opacity-80 transition-opacity">
                        <Image
                          src={item.image || "/academy.avif"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/academy/courses/${item.slug?.current || item._id}`}
                      >
                        <h3 className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-slate-600 mb-2">
                        {item.instructor}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3" />
                          {item.rating}
                        </span>
                        <span>{item.students.toLocaleString()} students</span>
                        <span>{item.level}</span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col items-end justify-between gap-2">
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          disabled={togglingWishlist === item._id}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Button
                          onClick={() => handleAddToCart(item._id)}
                          disabled={addingToCart === item._id}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          {addingToCart === item._id ? "Adding..." : "Add"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Wishlist Summary
            </h3>

            <div className="space-y-4 pb-4 border-b border-slate-200 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Items</span>
                <span className="font-semibold text-slate-900">
                  {wishlistItems.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total value</span>
                <span className="font-semibold text-slate-900">
                  ₦{totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">You save</span>
                <span className="font-semibold text-emerald-600">
                  ₦{savings.toLocaleString()}
                </span>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <Button
                onClick={handleAddAllToCart}
                disabled={addingAllToCart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                {addingAllToCart ? "Adding..." : "Add All to Cart"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
