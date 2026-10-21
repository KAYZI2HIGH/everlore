"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove from wishlist",
      );
    } finally {
      setTogglingWishlist(null);
    }
  };

  const handleAddToCart = async (courseId: string) => {
    setAddingToCart(courseId);
    try {
      await addToCartAsync(courseId);
      toast.success("Course added to cart!");
    } catch (error: unknown) {
      console.error("Error adding to cart:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add course to cart",
      );
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
    <div className="min-h-screen bg-background">

      <div className="grid grid-cols-1 gap-6 px-1 sm:gap-8 sm:px-6 lg:grid-cols-6">
        {/* Main Content */}
        <div className="lg:col-span-4">

          {isLoading ?
            <Card className="border-border p-12 text-center shadow-none">
              <Skeleton className="mx-auto h-5 w-48" />
              <Skeleton className="mx-auto mt-3 h-4 w-64" />
            </Card>
          : filteredItems.length === 0 ?
            <Card className="border-border py-12 text-center shadow-none">
              <p className="mb-4 text-lg text-muted-foreground">
                {searchQuery ?
                  "No courses found in your wishlist"
                : "Your wishlist is empty"}
              </p>
              <Link href="/academy/courses">
                <Button className="bg-academy-accent text-academy-accent-foreground hover:bg-academy-accent/90">
                  Browse Courses
                </Button>
              </Link>
            </Card>
          : <div className="space-y-3">
              {filteredItems.map((item: WishlistItem) => (
                <div
                  key={item._id}
                  className="rounded-lg border border-border p-4 transition-colors hover:border-academy-accent/50"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Thumbnail */}
                    <Link
                      href={`/academy/courses/${item.slug?.current || item._id}`}
                    >
                      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded bg-muted transition-opacity hover:opacity-80 sm:h-24 sm:w-24">
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
                        <h3 className="mb-1 line-clamp-2 font-semibold text-brand transition-colors hover:text-academy-accent">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {item.instructor}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3" />
                          {item.rating}
                        </span>
                        <span>{item.students.toLocaleString()} students</span>
                        <span>{item.level}</span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between gap-3 border-t border-border pt-3 sm:flex-col sm:items-end sm:justify-between sm:border-t-0 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-lg font-bold text-foreground sm:text-xl">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          disabled={togglingWishlist === item._id}
                          className="rounded p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Button
                          onClick={() => handleAddToCart(item._id)}
                          disabled={addingToCart === item._id}
                          size="sm"
                          className="bg-academy-accent text-academy-accent-foreground hover:bg-academy-accent/90 disabled:opacity-50"
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
        <div className="lg:col-span-2">
          <Card className="sticky top-24 border-border bg-brand p-6 shadow-none">
            <h3 className="mb-4 font-semibold text-white">
              Wishlist Summary
            </h3>

            <div className="mb-1 space-y-4 border-b border-border pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white">Items</span>
                <span className="font-semibold text-white">
                  {wishlistItems.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white">Total value</span>
                <span className="font-semibold text-white">
                  ₦{totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white">You save</span>
                <span className="font-semibold text-white">
                  ₦{savings.toLocaleString()}
                </span>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <Button
                onClick={handleAddAllToCart}
                disabled={addingAllToCart}
                className="w-full bg-white text-black hover:bg-academy-accent/90 disabled:opacity-50"
              >
                {addingAllToCart ? "Adding..." : "Add All to Cart"}
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
