"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { AcademyBreadcrumbBar } from "@/components/academy/AcademyBreadcrumbBar";
import { AcademyFilterSelect } from "@/components/academy/AcademyFilterSelect";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getAllCourses,
  getUniqueCategories,
  getCurrentUser,
} from "@/lib/actions/sanity.actions";
import { CourseListSkeleton } from "@/components/skeletons/CourseCardSkeleton";
import { useCart } from "@/hooks/useCart";
import { useQuery } from "@tanstack/react-query";
import { academyQueryKeys, userQueryKeys } from "@/lib/query-keys";
import { SlidersHorizontal } from "lucide-react";

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

type EnrollmentRef = string | { _ref?: string; _id?: string };

const CoursePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const { addToCartAsync, cartItems } = useCart();

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: academyQueryKeys.courses(),
    queryFn: getAllCourses,
  });
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<string[]>({
    queryKey: academyQueryKeys.categories(),
    queryFn: getUniqueCategories,
  });
  const { data: user } = useQuery({
    queryKey: userQueryKeys.current(),
    queryFn: getCurrentUser,
  });

  const enrolledCourseIds = useMemo(
    () =>
      (user?.enrolledCourses || [])
        .map((course: EnrollmentRef) =>
          typeof course === "object" && course !== null
            ? "_ref" in course
              ? String(course._ref)
              : "_id" in course
                ? String(course._id)
                : ""
            : String(course),
        )
        .filter(Boolean),
    [user?.enrolledCourses],
  );

  // Get cart item IDs
  const cartItemIds =
    cartItems?.map((item: { _id: string }) => item._id) || [];

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(
      (course) => !enrolledCourseIds.includes(course._id),
    );

    if (selectedCategory) {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }

    if (selectedLevel) {
      filtered = filtered.filter((course) => course.level === selectedLevel);
    }

    if (selectedDuration) {
      filtered = filtered.filter((course) => {
        if (selectedDuration === "short") return course.duration <= 4;
        if (selectedDuration === "medium") {
          return course.duration > 4 && course.duration <= 12;
        }
        return course.duration > 12;
      });
    }

    return filtered;
  }, [courses, enrolledCourseIds, selectedCategory, selectedLevel, selectedDuration]);

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedLevel("");
    setSelectedDuration("");
  };

  const isLoading = coursesLoading || categoriesLoading;

  const renderFilterControls = (idSuffix: string) => (
    <>
      <AcademyFilterSelect
        id={`course-category-${idSuffix}`}
        label="Course category"
        placeholder="All categories"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        options={(categories.length > 0 ?
          categories
        : ["Design", "Development", "Business", "Marketing"]
        ).map((category: string) => ({ label: category, value: category }))}
      />
      <AcademyFilterSelect
        id={`course-level-${idSuffix}`}
        label="Course level"
        placeholder="All levels"
        value={selectedLevel}
        onValueChange={setSelectedLevel}
        options={[
          { label: "Beginner", value: "Beginner" },
          { label: "Intermediate", value: "Intermediate" },
          { label: "Advanced", value: "Advanced" },
        ]}
      />
      <AcademyFilterSelect
        id={`course-duration-${idSuffix}`}
        label="Course duration"
        placeholder="Any duration"
        value={selectedDuration}
        onValueChange={setSelectedDuration}
        options={[
          { label: "Up to 4 hours", value: "short" },
          { label: "5–12 hours", value: "medium" },
          { label: "More than 12 hours", value: "long" },
        ]}
      />
    </>
  );

  const handleAddToCart = async (courseId: string) => {
    try {
      await addToCartAsync(courseId);
      toast.success("Course added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add course to cart",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <AcademyBreadcrumbBar
        items={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/academy/courses" },
        ]}
      />
      {/* Filters Section */}
      <div className="max-w-6xl mx-auto pt-2">
          <div className="hidden gap-6 p-6 md:grid md:grid-cols-2 lg:grid-cols-4">
            {renderFilterControls("desktop")}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full rounded-3xl bg-brand text-white hover:bg-brand/90 hover:text-white"
              >
                Reset Filter
              </Button>
            </div>
          </div>
          <div className="px-4 md:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2 rounded-lg"
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                  {(selectedCategory || selectedLevel || selectedDuration) && (
                    <span className="text-xs text-muted-foreground">
                      (active)
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto z-10000">
                <DialogHeader>
                  <DialogTitle>Filter courses</DialogTitle>
                  <DialogDescription>
                    Choose a category, level, or duration to narrow the course
                    list.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-2">
                  {renderFilterControls("mobile")}
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearFilters}
                  >
                    Reset filters
                  </Button>
                  <DialogClose asChild>
                    <Button type="button">Show courses</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

      {/* Courses Grid */}
      <div className="min-h-[calc(100vh-20rem)] px-4 pb-12 max-w-6xl mx-auto">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            {(selectedCategory || selectedLevel || selectedDuration) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
              >
                Reset filters
              </Button>
            )}
          </div>
          {isLoading ?
            <CourseListSkeleton />
          : filteredCourses.length > 0 ?
            <div className="grid gap-x-6 gap-y-8 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
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
          : <Card className="flex flex-col items-center justify-center gap-6 border-border py-12 shadow-none">
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
                <p className="text-lg font-semibold text-foreground">
                  No courses match your filters
                </p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Try clearing your filters or search to explore all available
                  courses.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-input"
                >
                  Clear filters
                </Button>
              </div>
            </Card>
          }
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
