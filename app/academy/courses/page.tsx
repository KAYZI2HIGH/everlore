"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import {
  getAllCourses,
  searchCourses,
  getCoursesByCategory,
  getUniqueCategories,
  getCurrentUser,
} from "@/lib/actions/sanity.actions";
import { CourseListSkeleton } from "@/components/skeletons/CourseCardSkeleton";
import { CategoryFilterSkeleton } from "@/components/skeletons/CategoryFilterSkeleton";
import { useCart } from "@/hooks/useCart";

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
  createdAt: string;
}

const CoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const { addToCart, isAddingToCart, cartItems } = useCart();

  // Get cart item IDs
  const cartItemIds = cartItems?.map((item: any) => item._id) || [];

  // Fetch categories, courses, and user enrollment data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [courseData, categoryData, userData] = await Promise.all([
          getAllCourses(),
          getUniqueCategories(),
          getCurrentUser(),
        ]);
        setCourses(courseData);
        setFilteredCourses(courseData);
        setCategories(categoryData);

        // Get enrolled course IDs
        if (userData?.enrolledCourses) {
          const enrolled = userData.enrolledCourses.map(
            (course: any) => course._ref || course._id,
          );
          setEnrolledCourseIds(enrolled);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter courses based on categories, search, and enrollment status
  useEffect(() => {
    let filtered = courses;

    // Filter out purchased courses
    filtered = filtered.filter(
      (course) => !enrolledCourseIds.includes(course._id),
    );

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((course) =>
        selectedCategories.includes(course.category),
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredCourses(filtered);
  }, [selectedCategories, searchTerm, courses, enrolledCourseIds]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ?
        prev.filter((c) => c !== category)
      : [...prev, category],
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter is already done by useEffect
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setFilteredCourses(courses);
  };

  const handleAddToCart = async (courseId: string) => {
    try {
      await new Promise((resolve) => {
        addToCart(courseId, {
          onSuccess: () => {
            toast.success("Course added to cart!");
            resolve(null);
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to add course to cart");
            resolve(null);
          },
        });
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 py-4 border-b border-slate-200">
        <BreadcrumbUI
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/academy/courses" },
          ]}
        />
      </div>

      {/* Header Section */}
      <div className="px-6 md:px-20 py-12 border-b border-slate-200">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            Browse Our Courses
          </h1>
          <p className="text-slate-600 text-base max-w-2xl">
            Explore our comprehensive course catalog to find the perfect course
            that suits your goals and career aspirations.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-6 md:px-20 py-8 border-b border-slate-200">
        <div className="space-y-6">
          {/* Category Filter */}
          {isLoading ?
            <CategoryFilterSkeleton />
          : <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Filter by Category
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                      selectedCategories.includes(category) ?
                        "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{category}</span>
                      {selectedCategories.includes(category) && (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          }

          {/* Search Section */}
          <form
            onSubmit={handleSearch}
            className="space-y-4"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              Search Courses
            </h2>
            <div className="flex flex-col md:flex-row gap-3 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter keyword to search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-3 bg-white border-2 border-slate-300 focus:border-emerald-600 focus:ring-0"
                />
              </div>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Active Filters Display */}
          {(selectedCategories.length > 0 || searchTerm) && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-sm font-medium text-slate-600">
                Active filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    {category}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="ml-1 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="px-6 md:px-20 py-12">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {isLoading ?
              "Loading courses..."
            : `Available Courses (${filteredCourses.length})`}
          </h2>
          {isLoading ?
            <CourseListSkeleton />
          : filteredCourses.length > 0 ?
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isInCart = cartItemIds.includes(course._id);
                return (
                  <div
                    key={course._id}
                    className="relative"
                  >
                    <CourseCard
                      id={course._id}
                      slug={course.slug.current}
                      title={course.title}
                      category={course.category}
                      instructor={course.instructor}
                      thumbnail={course.image}
                      rating={course.rating}
                      students={course.students}
                      price={course.price}
                      originalPrice={course.price * 1.5}
                      isNew={false}
                      isInCart={isInCart}
                      onAddToCart={() => handleAddToCart(course._id)}
                    />
                  </div>
                );
              })}
            </div>
          : <div className="flex flex-col items-center justify-center py-12 gap-6">
              <div className="relative w-64 h-44">
                <Image
                  src="/empty-courses.svg"
                  alt="No courses found illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-slate-900 text-lg font-semibold">
                  No courses match your filters
                </p>
                <p className="text-slate-600 text-sm max-w-md">
                  Try clearing your filters or search to explore all available
                  courses.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-slate-300"
                >
                  Clear filters
                </Button>
                <Button onClick={() => setSearchTerm("")}>Reset search</Button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
