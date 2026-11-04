"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, CheckCircle, Star, MoreVertical } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/sanity.actions";

interface EnrolledCourse {
  _id: string;
  title: string;
  slug: { current: string };
  instructor: string;
  image: string;
  rating: number;
  students: number;
  status: "in-progress" | "completed";
}

const MyLearningPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "in-progress" | "completed"
  >("all");

  // Fetch user with enrolled courses using React Query
  const { data: user, isLoading } = useQuery({
    queryKey: ["learning"],
    queryFn: async () => {
      const userData = await getCurrentUser();
      return {
        ...userData,
        enrolledCourses: (userData?.enrolledCourses || []).map(
          (course: EnrolledCourse) => ({
            ...course,
            status: (course.status || "in-progress") as
              | "in-progress"
              | "completed",
          }),
        ),
      };
    },
  });

  const enrolledCourses = user?.enrolledCourses || [];

  // Filter courses
  const filteredCourses = useMemo(
    () =>
      enrolledCourses
        .filter((course: EnrolledCourse) => {
          if (selectedFilter !== "all") {
            return course.status === selectedFilter;
          }
          return true;
        })
        .filter(
          (course: EnrolledCourse) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    [enrolledCourses, selectedFilter, searchQuery],
  );

  const stats = {
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter(
      (c: EnrolledCourse) => c.status === "in-progress",
    ).length,
    completed: enrolledCourses.filter(
      (c: EnrolledCourse) => c.status === "completed",
    ).length,
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 py-4 bg-background border-b border-border">
        <BreadcrumbUI
          items={[
            { label: "Home", href: "/" },
            { label: "Academy", href: "/academy/courses" },
            { label: "My Learning", href: "/academy/learning" },
          ]}
        />
      </div>

      {/* Header and Filters Container */}
      <div className="px-6 md:px-20 py-8 bg-background">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-6">
          {/* Header */}
          <div className="shrink-0">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Learning
            </h1>
            <p className="text-muted-foreground">
              Continue learning with your enrolled courses
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex-1 lg:max-w-sm space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                All ({stats.total})
              </Button>
              <Button
                onClick={() => setSelectedFilter("in-progress")}
                className={`text-sm ${
                  selectedFilter === "in-progress" ?
                    "bg-emerald-600 text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                In Progress ({stats.inProgress})
              </Button>
              <Button
                onClick={() => setSelectedFilter("completed")}
                className={`text-sm ${
                  selectedFilter === "completed" ?
                    "bg-emerald-600 text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
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
        {isLoading ?
          <div className="bg-card rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Loading your courses...</p>
          </div>
        : filteredCourses.length === 0 ?
          <div className="bg-card rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              {enrolledCourses.length === 0 ?
                "You haven't enrolled in any courses yet"
              : "No courses found matching your criteria"}
            </p>
            <Link href="/academy/courses">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Browse Courses
              </Button>
            </Link>
          </div>
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: EnrolledCourse) => (
              <Link
                key={course._id}
                href={`/academy/courses/${course.slug.current}`}
                className="group"
              >
                <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative w-full h-40 bg-secondary overflow-hidden">
                    <Image
                      src={course.image || "/academy.avif"}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end">
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
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {course.title}
                    </h3>

                    {/* Instructor & Rating */}
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-muted-foreground">{course.instructor}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-foreground">
                          {course.rating}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full mt-2 bg-secondary text-foreground hover:bg-secondary/80">
                      Continue Learning
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
