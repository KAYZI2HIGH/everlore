import Image from "next/image";
import { CheckCircle, Clock, Clock3, Heart, Star, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";

export interface CourseCardProps {
  id: string;
  slug: string;
  title: string;
  category: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  originalPrice: number;
  price: number;
  isNew?: boolean;
  isInCart?: boolean;
  onAddToCart?: (courseId: string) => void;
}

export interface LearningCourseCardProps {
  slug: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  status: "in-progress" | "completed";
}

export function LearningCourseCard({
  slug,
  title,
  instructor,
  thumbnail,
  rating,
  students,
  status,
}: LearningCourseCardProps) {
  const isCompleted = status === "completed";

  return (
    <article className="group relative min-w-0">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={thumbnail || "/academy.avif"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground">
          {isCompleted ?
            <CheckCircle className="size-3 text-academy-accent" />
          : <Clock className="size-3 text-academy-accent" />}
          {isCompleted ? "Completed" : "In Progress"}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold text-foreground">
          <Star className="size-3 fill-current text-academy-accent" />
          <span>{rating}</span>
        </div>
      </div>

      <div className="mt-2 space-y-2">
        <Link
          href={`/academy/courses/${slug}`}
          className="line-clamp-2 text-lg font-semibold tracking-normal text-brand transition-colors group-hover:text-academy-accent"
        >
          {title}
        </Link>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {instructor}
        </p>
        <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3" /> {rating}
          </span>
          <span className="h-[10px] w-px bg-border" />
          <span className="flex items-center gap-1">
            <Users className="size-3" /> {students}
          </span>
          <span className="h-[10px] w-px bg-border" />
          <span className="flex items-center gap-1">
            <Clock3 className="size-3" /> Self-paced
          </span>
        </div>
        <Button
          asChild
          variant="outline"
          className="w-full rounded-full"
        >
          <Link href={`/academy/courses/${slug}`}>
            {isCompleted ? "Review Course" : "Continue Learning"}
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function CourseCard({
  id,
  slug,
  title,
  category,
  instructor,
  thumbnail,
  rating,
  students,
  originalPrice,
  price,
  isNew = false,
  isInCart = false,
  onAddToCart,
}: CourseCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  return (
    <div className="group relative col-span-1 min-w-0">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* New Course Badge */}
        {isNew && (
          <Badge className="absolute left-3 top-3 bg-academy-accent text-academy-accent-foreground hover:bg-academy-accent/90">
            New Course
          </Badge>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold text-foreground">
          <Star className="size-3 fill-current text-academy-accent" />
          <span>{rating}</span>
        </div>

        {/* Wishlist Icon */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={() => toggleWishlist(id)}
          className="absolute right-3 top-3 z-10 size-8 rounded-3xl"
          aria-label={`Add ${title} to wishlist`}
        >
          <Heart
            className={`size-4 transition-colors ${
              isInWishlist(id) ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </Button>
      </div>

      {/* Content */}
      <div className="mt-2">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/academy/courses/${slug}`}
            className="line-clamp-2 text-lg font-semibold tracking-normal text-brand transition-colors group-hover:text-academy-accent"
          >
            {title}
          </Link>
          <Badge variant="outline" className="shrink-0 whitespace-nowrap px-2">
            {category}
          </Badge>
        </div>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {instructor}
        </p>
      </div>

      <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="size-3" /> {rating}
        </span>
        <span className="h-[10px] w-px bg-border" />
        <span className="flex items-center gap-1">
          <Users className="size-3" /> {students}
        </span>
        <span className="h-[10px] w-px bg-border" />
        <span className="flex items-center gap-1">
          <Clock3 className="size-3" /> {category}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-semibold tracking-normal text-foreground">
          ₦{price.toLocaleString()}
          <span className="ml-2 text-sm font-normal text-muted-foreground line-through">
            ₦{originalPrice.toLocaleString()}
          </span>
        </p>
        {isInCart ?
          <Button disabled variant="outline" size="sm" className="shrink-0">
            In cart
          </Button>
        : <Button
            variant="outline"
            size="sm"
            className="shrink-0 bg-brand text-brand-foreground! hover:bg-brand/90"
            onClick={() => onAddToCart?.(id)}
          >
            Add to cart
          </Button>
        }
      </div>
    </div>
  );
}
