"use client";

import { useState } from "react";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const CoursePage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "Cartoon Creation & Animation",
    "Data Analysis",
    "Finance",
    "Freelancing & Marketing",
    "Graphic Design",
    "UI/UX design",
    "Video editing & Production",
    "Web development",
  ];

  // Mock course data
  const mockCourses = [
    {
      id: "1",
      title: "Social Media Management Career Blueprint",
      category: "Social Media Management",
      instructor: "Immaculate Uchechi Enyeribe",
      thumbnail: "/academy.avif",
      rating: 4.6,
      students: 58,
      originalPrice: 11700,
      price: 3500,
      isNew: true,
    },
    {
      id: "2",
      title:
        "Google Automation Masterclass: Build E-commerce Systems with AppSheet & Apps...",
      category: "Google Automation",
      instructor: "Aderogba Segun",
      thumbnail: "/hero-slider-images/study-group-african-people.jpg",
      rating: 4.6,
      students: 385,
      originalPrice: 16500,
      price: 5000,
      isNew: false,
    },
    {
      id: "3",
      title: "Canva Design Mastery",
      category: "Graphic Design",
      instructor: "Adebayo Joseph Adedimeji",
      thumbnail: "/hero-slider-images/young-student-learning-library.jpg",
      rating: 4.8,
      students: 1010,
      originalPrice: 11700,
      price: 3500,
      isNew: false,
    },
    {
      id: "4",
      title: "Social Media Management Career Blueprint",
      category: "Social Media Management",
      instructor: "Immaculate Uchechi Enyeribe",
      thumbnail: "/hero-slider-images/young-student-working-assignment.jpg",
      rating: 4.6,
      students: 58,
      originalPrice: 11700,
      price: 3500,
      isNew: true,
    },
    {
      id: "5",
      title:
        "Google Automation Masterclass: Build E-commerce Systems with AppSheet & Apps...",
      category: "Google Automation",
      instructor: "Aderogba Segun",
      thumbnail: "/hero-slider-images/colleagues-doing-team-work-project.jpg",
      rating: 4.6,
      students: 385,
      originalPrice: 16500,
      price: 5000,
      isNew: false,
    },
    {
      id: "6",
      title: "Canva Design Mastery",
      category: "Graphic Design",
      instructor: "Adebayo Joseph Adedimeji",
      thumbnail: "/digital-service.png",
      rating: 4.8,
      students: 1010,
      originalPrice: 11700,
      price: 3500,
      isNew: false,
    },
    {
      id: "7",
      title: "Social Media Management Career Blueprint",
      category: "Social Media Management",
      instructor: "Immaculate Uchechi Enyeribe",
      thumbnail: "/academy.avif",
      rating: 4.6,
      students: 58,
      originalPrice: 11700,
      price: 3500,
      isNew: true,
    },
    {
      id: "8",
      title:
        "Google Automation Masterclass: Build E-commerce Systems with AppSheet & Apps...",
      category: "Google Automation",
      instructor: "Aderogba Segun",
      thumbnail: "/academy.avif",
      rating: 4.6,
      students: 385,
      originalPrice: 16500,
      price: 5000,
      isNew: false,
    },
    {
      id: "9",
      title: "Canva Design Mastery",
      category: "Graphic Design",
      instructor: "Adebayo Joseph Adedimeji",
      thumbnail: "/academy.avif",
      rating: 4.8,
      students: 1010,
      originalPrice: 11700,
      price: 3500,
      isNew: false,
    },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ?
        prev.filter((c) => c !== category)
      : [...prev, category],
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchTerm);
    console.log("Selected Categories:", selectedCategories);
    // Handle search logic here
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
        <div className="space-y-4 w-full">
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
          Available Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
