"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
} from "@/lib/actions/sanity.actions";
import { CourseListSkeleton } from "@/components/skeletons/CourseCardSkeleton";
import { CategoryFilterSkeleton } from "@/components/skeletons/CategoryFilterSkeleton";

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

  // Fetch categories and courses on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [courseData, categoryData] = await Promise.all([
        getAllCourses(),
        getUniqueCategories(),
      ]);
      setCourses(courseData);
      setFilteredCourses(courseData);
      setCategories(categoryData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Filter courses based on categories and search
  useEffect(() => {
    let filtered = courses;

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
  }, [selectedCategories, searchTerm, courses]);

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

  const handleAddToCart = (courseId: string) => {
    console.log("Added to cart:", courseId);
    // Handle add to cart logic here
  };

  return (
    <div className="px-6 md:px-20 py-8 md:pb-14 min-h-screen bg-slate-50">
      <BreadcrumbUI
        items={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/academy/courses" },
        ]}
      />

      <div className="mt-8 flex max-md:flex-col gap-10 justify-between w-full">
        <div className="space-y-4 min-w-md">
          <h1 className="text-4xl font-medium tracking-wide text-pretty">
            Browse Our Course Categories
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            Explore our course categories to find the perfect course that suits
            your goals and career.
          </p>
        </div>

        {/* Category Filter Section */}
        {isLoading ?
          <CategoryFilterSkeleton />
        : <div className="space-y-4 w-full">
            <h2 className="text-sm font-semibold text-foreground">
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
      </div>

      {/* Search Section */}
      <form
        onSubmit={handleSearch}
        className="space-y-4 pt-4"
      >
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
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <span className="text-sm font-medium text-muted-foreground">
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

      {/* Courses Grid */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          {isLoading ?
            "Loading courses..."
          : `Available Courses (${filteredCourses.length})`}
        </h2>
        {isLoading ?
          <CourseListSkeleton />
        : filteredCourses.length > 0 ?
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
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
                onAddToCart={handleAddToCart}
              />
            ))}
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
  );
};

export default CoursePage;
