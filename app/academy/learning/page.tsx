"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, CheckCircle, Star, MoreVertical } from "lucide-react";

interface EnrolledCourse {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviews: number;
  progress: number;
  lastAccessed: string;
  totalLessons: number;
  completedLessons: number;
  status: "in-progress" | "completed";
}

const MyLearningPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "in-progress" | "completed"
  >("all");

  // Mock enrolled courses data
  const enrolledCourses: EnrolledCourse[] = [
    {
      id: "1",
      title: "Google Automation Masterclass: Build E-commerce Systems",
      slug: "google-automation-masterclass",
      instructor: "Sarah Anderson",
      thumbnail: "/academy.avif",
      rating: 4.8,
      reviews: 342,
      progress: 65,
      lastAccessed: "2 hours ago",
      totalLessons: 55,
      completedLessons: 36,
      status: "in-progress",
    },
    {
      id: "2",
      title: "Advanced React & Next.js Development",
      slug: "advanced-react-nextjs",
      instructor: "John Developer",
      thumbnail: "/academy.avif",
      rating: 4.9,
      reviews: 528,
      progress: 100,
      lastAccessed: "1 week ago",
      totalLessons: 48,
      completedLessons: 48,
      status: "completed",
    },
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      slug: "ui-ux-design-fundamentals",
      instructor: "Emma Design",
      thumbnail: "/academy.avif",
      rating: 4.7,
      reviews: 215,
      progress: 40,
      lastAccessed: "3 days ago",
      totalLessons: 42,
      completedLessons: 17,
      status: "in-progress",
    },
    {
      id: "4",
      title: "Python for Data Science",
      slug: "python-data-science",
      instructor: "Dr. Alex Smith",
      thumbnail: "/academy.avif",
      rating: 4.8,
      reviews: 412,
      progress: 25,
      lastAccessed: "1 week ago",
      totalLessons: 60,
      completedLessons: 15,
      status: "in-progress",
    },
    {
      id: "5",
      title: "Digital Marketing Masterclass",
      slug: "digital-marketing",
      instructor: "Mark Marketing",
      thumbnail: "/academy.avif",
      rating: 4.6,
      reviews: 189,
      progress: 100,
      lastAccessed: "2 weeks ago",
      totalLessons: 38,
      completedLessons: 38,
      status: "completed",
    },
    {
      id: "6",
      title: "Web Design with Figma",
      slug: "web-design-figma",
      instructor: "Lisa Creative",
      thumbnail: "/academy.avif",
      rating: 4.9,
      reviews: 356,
      progress: 55,
      lastAccessed: "Yesterday",
      totalLessons: 44,
      completedLessons: 24,
      status: "in-progress",
    },
  ];

  // Filter courses
  const filteredCourses = enrolledCourses
    .filter((course) => {
      if (selectedFilter !== "all") {
        return course.status === selectedFilter;
      }
      return true;
    })
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const stats = {
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter((c) => c.status === "in-progress")
      .length,
    completed: enrolledCourses.filter((c) => c.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 py-4 bg-white border-b border-slate-200">
        <BreadcrumbUI
          items={[
            { label: "Home", href: "/" },
            { label: "Academy", href: "/academy/courses" },
            { label: "My Learning", href: "/academy/learning" },
          ]}
        />
      </div>

      {/* Header and Filters Container */}
      <div className="px-6 md:px-20 py-8 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-6">
          {/* Header */}
          <div className="flex-shrink-0">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              My Learning
            </h1>
            <p className="text-slate-600">
              Continue learning with your enrolled courses
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex-1 lg:max-w-sm space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search courses or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-base"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedFilter("all")}
                className={`text-sm ${
                  selectedFilter === "all" ?
                    "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                All ({stats.total})
              </Button>
              <Button
                onClick={() => setSelectedFilter("in-progress")}
                className={`text-sm ${
                  selectedFilter === "in-progress" ?
                    "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                In Progress ({stats.inProgress})
              </Button>
              <Button
                onClick={() => setSelectedFilter("completed")}
                className={`text-sm ${
                  selectedFilter === "completed" ?
                    "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                Completed ({stats.completed})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="px-6 md:px-20 py-8">
        {filteredCourses.length === 0 ?
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-slate-600 text-lg mb-4">
              No courses found matching your criteria
            </p>
            <Link href="/academy/courses">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Browse Courses
              </Button>
            </Link>
          </div>
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/academy/courses/${course.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative w-full h-40 bg-slate-200 overflow-hidden">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-3 w-full">
                        <Badge
                          className={`${
                            course.status === "completed" ?
                              "bg-blue-600 hover:bg-blue-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                          } text-white`}
                        >
                          {course.status === "completed" ?
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </>
                          : <>
                              <Clock className="w-3 h-3 mr-1" />
                              In Progress
                            </>
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {course.title}
                    </h3>

                    {/* Instructor & Rating */}
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-slate-600">{course.instructor}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-slate-900">
                          {course.rating}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-600">
                          {course.completedLessons} of {course.totalLessons}{" "}
                          lessons
                        </p>
                        <p className="text-xs font-semibold text-slate-900">
                          {course.progress}%
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            course.progress === 100 ?
                              "bg-blue-600"
                            : "bg-emerald-600"
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Last Accessed */}
                    <p className="text-xs text-slate-500">
                      Last accessed: {course.lastAccessed}
                    </p>

                    {/* Action Button */}
                    <Button className="w-full mt-2 bg-slate-100 text-slate-900 hover:bg-slate-200">
                      {course.progress === 100 ?
                        "View Certificate"
                      : "Continue Learning"}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default MyLearningPage;
