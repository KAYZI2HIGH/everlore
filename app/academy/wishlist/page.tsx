"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, ShoppingCart, Star } from "lucide-react";

interface WishlistItem {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  students: number;
  thumbnail: string;
  addedDate: string;
}

const WishlistPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: "1",
      title: "Google Automation Masterclass: Build E-commerce Systems",
      slug: "google-automation-masterclass",
      instructor: "Sarah Anderson",
      price: 5000,
      originalPrice: 8000,
      rating: 4.8,
      reviews: 342,
      students: 4200,
      thumbnail: "/academy.avif",
      addedDate: "Jan 15, 2026",
    },
    {
      id: "2",
      title: "Advanced React & Next.js Development",
      slug: "advanced-react-nextjs",
      instructor: "John Developer",
      price: 3500,
      originalPrice: 6000,
      rating: 4.9,
      reviews: 528,
      students: 5100,
      thumbnail: "/academy.avif",
      addedDate: "Jan 12, 2026",
    },
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      slug: "ui-ux-design-fundamentals",
      instructor: "Emma Design",
      price: 2500,
      originalPrice: 4500,
      rating: 4.7,
      reviews: 215,
      students: 1800,
      thumbnail: "/academy.avif",
      addedDate: "Jan 10, 2026",
    },
    {
      id: "4",
      title: "Python for Data Science",
      slug: "python-data-science",
      instructor: "Dr. Alex Smith",
      price: 4000,
      originalPrice: 7000,
      rating: 4.8,
      reviews: 412,
      students: 3400,
      thumbnail: "/academy.avif",
      addedDate: "Jan 8, 2026",
    },
  ]);

  const filteredItems = wishlistItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRemove = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const handleAddToCart = (id: string) => {
    console.log("Added to cart:", id);
    handleRemove(id);
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const savings = wishlistItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price),
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

          {filteredItems.length === 0 ?
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
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <Link href={`/academy/courses/${item.slug}`}>
                      <div className="relative w-24 h-24 rounded overflow-hidden bg-slate-200 flex-shrink-0 hover:opacity-80 transition-opacity">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/academy/courses/${item.slug}`}>
                        <h3 className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-slate-600 mb-2">
                        {item.instructor}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {item.rating} ({item.reviews})
                        </span>
                        <span>{item.students.toLocaleString()} students</span>
                        <span className="text-slate-400">
                          Added {item.addedDate}
                        </span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col items-end justify-between gap-2">
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">
                          ₦{item.price.toLocaleString()}
                        </p>
                        <p className="text-sm line-through text-slate-400">
                          ₦{item.originalPrice.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Button
                          onClick={() => handleAddToCart(item.id)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add
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
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Add All to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
