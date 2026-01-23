import Image from "next/image";
import { Star, Users, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  originalPrice: number;
  price: number;
  isNew?: boolean;
  onAddToCart?: (courseId: string) => void;
}

export function CourseCard({
  id,
  title,
  category,
  instructor,
  thumbnail,
  rating,
  students,
  originalPrice,
  price,
  isNew = false,
  onAddToCart,
}: CourseCardProps) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-slate-200">
      {/* Image Container */}
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* New Course Badge */}
        {isNew && (
          <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
            New Course
          </Badge>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
          <span>⭐ {rating}</span>
        </div>

        {/* Wishlist Icon */}
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-slate-100 transition-colors">
          <Star className="w-5 h-5 text-slate-400" />
        </button>

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <div
              className="w-0 h-0 border-l-6 border-l-transparent border-r-0 border-t-3.5 border-t-transparent border-b-3.5 border-b-transparent ml-1"
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "0px solid transparent",
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderLeftColor: "black",
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-3 group-hover:text-green-600 transition-colors">
          {title}
        </h3>

        {/* Category & Students */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700"
          >
            📚 {category}
          </Badge>
          <div className="flex items-center gap-1 text-slate-600">
            <Users className="w-3.5 h-3.5" />
            <span>{students}</span>
          </div>
        </div>

        {/* Instructor */}
        <p className="text-xs text-slate-600 underline mb-3">{instructor}</p>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm line-through text-slate-400">
            ₦{originalPrice.toLocaleString()}
          </span>
          <span className="text-lg font-bold text-slate-900">
            ₦{price.toLocaleString()}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="outline"
          className="w-full border-slate-300 hover:border-slate-400 text-slate-900"
          onClick={() => onAddToCart?.(id)}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
