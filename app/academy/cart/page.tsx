"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Heart } from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  originalPrice: number;
  price: number;
  rating: number;
  reviews: number;
  students: number;
  tags: Array<{ label: string; color: string }>;
  language: string;
}

const CartPage = () => {
  const [couponCode, setCouponCode] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      title: "Video Editing & VFX with CapCut",
      instructor: "Osama Siddiqui",
      thumbnail: "/academy.avif",
      originalPrice: 10000,
      price: 3000,
      rating: 4.5,
      reviews: 57,
      students: 1470,
      tags: [{ label: "Hot & New", color: "bg-red-100 text-red-700" }],
      language: "English",
    },
    {
      id: "2",
      title: "Illustrator for Graphic Designers",
      instructor: "Osapa Michael",
      thumbnail: "/academy.avif",
      originalPrice: 12700,
      price: 2000,
      rating: 4.6,
      reviews: 18,
      students: 618,
      tags: [
        { label: "Popular Course", color: "bg-orange-100 text-orange-700" },
        {
          label: "Ultimate Graphic Design Bundle",
          color: "bg-yellow-100 text-yellow-700",
        },
      ],
      language: "English",
    },
    {
      id: "3",
      title: "Ultimate Adobe Photoshop Training: From Beginner to Pro",
      instructor: "Osapa Michael",
      thumbnail: "/academy.avif",
      originalPrice: 12700,
      price: 2000,
      rating: 4.5,
      reviews: 90,
      students: 3486,
      tags: [
        { label: "Highly Rated", color: "bg-purple-100 text-purple-700" },
        {
          label: "Ultimate Graphic Design Bundle",
          color: "bg-yellow-100 text-yellow-700",
        },
      ],
      language: "English",
    },
  ]);

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateTotals = () => {
    const originalTotal = cartItems.reduce(
      (sum, item) => sum + item.originalPrice,
      0,
    );
    const currentTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const discount = originalTotal - currentTotal;
    const discountPercent = Math.round((discount / originalTotal) * 100);

    return { originalTotal, currentTotal, discount, discountPercent };
  };

  const { originalTotal, currentTotal, discount, discountPercent } =
    calculateTotals();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 md:px-20 py-8">
        <BreadcrumbUI
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/academy/cart" },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-600 mb-8">
            {cartItems.length} course{cartItems.length !== 1 ? "s" : ""} in cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ?
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-slate-600 mb-4">Your cart is empty</p>
                <Link href="/academy/courses">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            : cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-6 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mb-2">
                        By {item.instructor}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className={`text-xs ${tag.color}`}
                          >
                            {tag.label}
                          </Badge>
                        ))}
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {item.language}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-3 text-xs text-slate-600 mb-3">
                        <span>
                          ⭐ {item.rating} ({item.reviews} reviews)
                        </span>
                        <span>👥 {item.students} students</span>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm line-through text-slate-400">
                            ₦{item.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-lg font-bold text-slate-900">
                            ₦{item.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex gap-4 text-sm">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                          <button className="text-slate-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            Wishlist
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
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 mb-4">
                Checkout →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
