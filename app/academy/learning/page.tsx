"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/actions/sanity.actions";
import { LearningCourseCard } from "@/components/CourseCard";

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

  const enrolledCourses = useMemo(
    () => user?.enrolledCourses || [],
    [user?.enrolledCourses],
  );

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
    <div className="min-h-screen bg-background">
      {/* Course Grid */}
      <div className="mx-auto max-w-6xl px-4">
        {isLoading ?
          <Card className="border-border p-12 text-center shadow-none">
            <Skeleton className="mx-auto h-5 w-48" />
            <Skeleton className="mx-auto mt-3 h-4 w-64" />
          </Card>
        : filteredCourses.length === 0 ?
          <Card className="border-border p-12 text-center shadow-none">
            <p className="mb-4 text-lg text-muted-foreground">
              {enrolledCourses.length === 0 ?
                "You haven't enrolled in any courses yet"
              : "No courses found matching your criteria"}
            </p>
            <Link href="/academy/courses">
              <Button className="bg-academy-accent text-academy-accent-foreground hover:bg-academy-accent/90">
                Browse Courses
              </Button>
            </Link>
          </Card>
        : <div className="grid gap-x-4 gap-y-8 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {filteredCourses.map((course: EnrolledCourse) => (
              <LearningCourseCard
                key={course._id}
                slug={course.slug.current}
                title={course.title}
                instructor={course.instructor}
                thumbnail={course.image}
                rating={course.rating}
                students={course.students}
                status={course.status}
              />
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default MyLearningPage;
