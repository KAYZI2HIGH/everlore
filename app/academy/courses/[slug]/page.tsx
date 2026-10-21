"use client";

import { AcademyBreadcrumbBar } from "@/components/academy/AcademyBreadcrumbBar";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { CourseDetailsSkeleton } from "@/components/skeletons/CourseDetailsSkeleton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { usePaystack } from "@/hooks/usePaystack";
import { useWishlist } from "@/hooks/useWishlist";
import { getCourseBySlug, getCurrentUser } from "@/lib/actions/sanity.actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { academyQueryKeys, userQueryKeys } from "@/lib/query-keys";
import {
  Award,
  CheckCircle,
  ChevronDown,
  Clock,
  Heart,
  Lock,
  Play,
  Star,
  Users,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  image: string;
  price: number;
  instructor: string;
  category: string;
  level: string;
  duration: number;
  students: number;
  rating: number;
  videoUrl?: string;
  learningPoints?: string[];
  highlights?: { title?: string }[];
  modules?: { title?: string; lessons?: number; duration?: string }[];
  faqs?: { question?: string; answer?: string }[];
  reviews?: { author?: string; rating?: number; text?: string }[];
  createdAt: string;
}

interface CourseModule {
  id?: string;
  title: string;
  lessons?: number;
  duration?: string;
}

interface CourseReview {
  id?: string;
  author?: string;
  rating?: number;
  text?: string;
  avatar?: string;
}

interface FAQItem {
  id?: string;
  question?: string;
  answer?: string;
}

const CourseDetailsPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const queryClient = useQueryClient();

  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState(45);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const { addToCartAsync } = useCart();
  const { isInWishlist, toggleWishlistAsync } = useWishlist();
  const { initializePayment, isProcessing } = usePaystack(queryClient);

  // Fetch course by slug
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: academyQueryKeys.course(slug),
    queryFn: () => getCourseBySlug(slug),
    enabled: !!slug,
  });

  // Fetch current user to check enrollment
  const { data: user } = useQuery({
    queryKey: userQueryKeys.current(),
    queryFn: () => getCurrentUser(),
  });

  // Check if course is purchased
  const isPurchased =
    course && user?.enrolledCourses ?
      user.enrolledCourses.some(
        (enrolled: any) =>
          enrolled._ref === course._id || enrolled._id === course._id,
      )
    : false;

  const isLoading = courseLoading;

  const handleAddToCart = async () => {
    if (!course) return;
    setAddingToCart(true);
    try {
      await addToCartAsync(course._id);
      toast.success("Course added to cart!");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error?.message || "Failed to add course to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!course) return;
    setAddingToWishlist(true);
    try {
      const wasInWishlist = isInWishlist(course._id);
      await toggleWishlistAsync(course._id);
      toast.success(
        wasInWishlist ? "Removed from wishlist!" : "Added to wishlist!",
      );
    } catch (error: any) {
      console.error("Error toggling wishlist:", error);
      toast.error(error?.message || "Failed to update wishlist");
    } finally {
      setAddingToWishlist(false);
    }
  };

  const learningPoints = course?.learningPoints || [];
  const modules: CourseModule[] =
    course?.modules?.map((m: any, idx: number) => ({
      id: String(idx + 1),
      title: m.title || `Module ${idx + 1}`,
      lessons: m.lessons,
      duration: m.duration,
    })) || [];

  const faqs: FAQItem[] =
    course?.faqs
      ?.map((f: any, idx: number) => ({
        id: String(idx + 1),
        question: f.question || "",
        answer: f.answer || "",
      }))
      .filter((f: any) => f.question) || [];

  const reviews: CourseReview[] =
    course?.reviews
      ?.map((r: any, idx: number) => ({
        id: String(idx + 1),
        author: r.author || "",
        rating: r.rating || 0,
        text: r.text || "",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.author || "anon")}`,
      }))
      .filter((r: any) => r.author) || [];

  const highlights = course?.highlights || [];

  if (isLoading) {
    return <CourseDetailsSkeleton />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600 mb-4">Course not found</p>
          <Link href="/academy/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <AcademyBreadcrumbBar
        items={[
          { label: "Home", href: "/" },
          { label: "Academy", href: "/academy/courses" },
          { label: course.title, href: "#" },
        ]}
      />

      {/* Hero Section */}
      <div className="grid grid-cols-1 gap-6 px-4 py-8 mx-auto max-w-6xl pt-4 lg:grid-cols-3 lg:gap-8">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2 lg:space-y-8">
          {/* Course Image */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden bg-slate-200">
            {isPurchased && course.videoUrl ?
              <div className="w-full h-full bg-black flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  src={course.videoUrl}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            : <>
                <Image
                  src={course.image || "/academy.avif"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {!isPurchased && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="rounded-full w-24 h-24 flex items-center justify-center">
                        <Lock className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            }
          </div>

          {/* Course Title & Meta */}
          <div>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              {course.title}
            </h1>
            <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-slate-900">
                  {course.rating}
                </span>
                <span className="text-slate-600">(342 reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Users className="size-4" />
                <span>{course.students?.toLocaleString() || "0"} students</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="size-4" />
                <span>{course.duration} hours</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor"
                alt={course.instructor}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-slate-900">
                  {course.instructor}
                </p>
                <p className="text-sm text-slate-600">Course Instructor</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">
              About this course
            </h2>
            <p className="mb-3 text-sm leading-7 text-slate-600">
              {course.description}
            </p>
            <p className="text-sm leading-7 text-slate-600">
              Learn practical skills and gain hands-on experience with
              real-world projects. This comprehensive course covers everything
              you need to master this subject.
            </p>
          </div>

          {/* What You'll Learn */}
          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900">
              What you'll learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningPoints.map((point: string, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-brand shrink-0 mt-1" />
                  <span className="text-sm leading-6 text-slate-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Highlights */}
          <div className="rounded-lg bg-slate-50 p-5">
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">
              Course highlights
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {highlights.map((highlight: any, idx: number) => {
                const Icons = [Clock, Play, Zap, Award];
                const Icon = Icons[idx] || Zap;
                const text =
                  typeof highlight === "string" ? highlight : highlight?.title;
                return (
                  <div
                    key={idx}
                    className="flex gap-3"
                  >
                    <Icon className="size-5 shrink-0 text-brand" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Curriculum */}
          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900">
              Course curriculum
            </h2>
            <div className="space-y-2">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {module.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {module.lessons} lessons • {module.duration}
                      </p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900">
              Frequently asked questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(
                        expandedFAQ === faq.id ? null : faq.id || null,
                      )
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 text-left">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedFAQ === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 py-4 bg-slate-50 border-t border-slate-200">
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900">
              Student reviews
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex gap-4 mb-3">
                    <Image
                      src={review.avatar || ""}
                      alt={review.author || ""}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {review.author}
                      </p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (review.rating || 0) ?
                                "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-slate-200 bg-brand p-5">
            {!isPurchased ?
              <>
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-white">
                      ₦{course.price?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <p className="text-sm text-brand font-semibold mt-2">
                    Special price
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full bg-white hover:bg-white/90 text-black py-3 disabled:opacity-50"
                  >
                    {addingToCart ? "Adding to cart..." : "Add to cart"}
                  </Button>
                  <Button
                    onClick={handleToggleWishlist}
                    disabled={addingToWishlist}
                    variant="ghost"
                    className="w-full py-3 border-slate-300 text-white! border! hover:bg-transparent disabled:opacity-50"
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isInWishlist(course._id) ?
                          "fill-red-500 text-red-500"
                        : ""
                      }`}
                    />
                    {addingToWishlist ?
                      "Updating..."
                    : isInWishlist(course._id) ?
                      "Remove from wishlist"
                    : "Add to wishlist"}
                  </Button>
                </div>
              </>
            : <>
                {/* Purchased Badge */}
                <div className="mb-6 p-4 bg-brand/10 border border-brand/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <p className="font-semibold text-white">
                      Course Purchased
                    </p>
                  </div>
                  <p className="text-sm text-white">
                    You have full access to this course
                  </p>
                </div>

                {/* Access Course Button */}
                <Link href="/academy/learning">
                  <Button className="w-full bg-brand hover:bg-brand/90 text-white py-3 mb-3">
                    Continue Learning →
                  </Button>
                </Link>
                {/* Download Resources */}
                <Button
                  variant="outline"
                  className="w-full mb-3"
                >
                  Download Resources
                </Button>

                {/* Certificate Button */}
                {courseProgress === 100 && (
                  <Button
                    variant="outline"
                    className="w-full mb-3 border-brand/40 text-white hover:bg-brand/10"
                  >
                    Download Certificate
                  </Button>
                )}
              </>
            }

            {/* Course Info */}
            <div className="space-y-4 border-t border-slate-200 pt-6">
              <div>
                <p className="text-sm text-white/70 mb-1">Language</p>
                <p className="font-semibold text-white">English</p>
              </div>
              <div>
                <p className="text-sm text-white/70 mb-1">Level</p>
                <p className="font-semibold text-white">{course.level}</p>
              </div>
              <div>
                <p className="text-sm text-white/70 mb-1">Duration</p>
                <p className="font-semibold text-white">
                  {course.duration} hours
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70 mb-1">Category</p>
                <p className="font-semibold text-white">
                  {course.category}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
