"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbUI } from "@/components/BreadcrumbUi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  Clock,
  Zap,
  CheckCircle,
  Play,
  MessageSquare,
  ThumbsUp,
  ChevronDown,
  Award,
} from "lucide-react";

interface CourseModule {
  id: string;
  title: string;
  lessons: number;
  duration: string;
}

interface CourseReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  avatar: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const CourseDetailsPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [cartAdded, setCartAdded] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false); // Track if user has bought course
  const [courseProgress, setCourseProgress] = useState(45); // Course completion percentage

  // Mock course data
  const course = {
    id: "1",
    title:
      "Google Automation Masterclass: Build E-commerce Systems with AppSheet & Apps Script",
    slug: "google-automation-masterclass",
    price: 5000,
    originalPrice: 8000,
    rating: 4.8,
    reviews: 342,
    students: 4200,
    thumbnail: "/academy.avif",
    instructor: {
      name: "Sarah Anderson",
      bio: "Senior Developer & Google Automation Expert",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    description:
      "Learn to build powerful e-commerce systems without coding. Master AppSheet and Google Apps Script to automate business processes and scale your operations.",
    language: "English",
    level: "Beginner to Intermediate",
    duration: "12 hours",
    lastUpdated: "January 2025",
    tags: ["Google Apps", "No-Code", "E-commerce", "Automation"],
  };

  const learningPoints = [
    "Build fully functional e-commerce systems with AppSheet",
    "Master Google Apps Script for advanced automation",
    "Create automated workflows and integrations",
    "Implement payment processing and order management",
    "Deploy production-ready applications",
    "Scale your application to handle thousands of users",
  ];

  const highlights = [
    { icon: Clock, text: "12 hours of on-demand video" },
    { icon: Play, text: "24 downloadable resources" },
    { icon: Zap, text: "Lifetime access" },
    { icon: Award, text: "Certificate of completion" },
  ];

  const modules: CourseModule[] = [
    {
      id: "1",
      title: "1. Getting Started with AppSheet",
      lessons: 8,
      duration: "1.5 hours",
    },
    {
      id: "2",
      title: "2. Building Your First App",
      lessons: 12,
      duration: "2.5 hours",
    },
    {
      id: "3",
      title: "3. Google Apps Script Fundamentals",
      lessons: 10,
      duration: "2 hours",
    },
    {
      id: "4",
      title: "4. E-commerce Integration",
      lessons: 15,
      duration: "3 hours",
    },
    {
      id: "5",
      title: "5. Advanced Automation & Deployment",
      lessons: 10,
      duration: "2.5 hours",
    },
  ];

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "Do I need any coding experience?",
      answer:
        "No! This course is designed for beginners. We start from the basics and gradually move to advanced concepts. All you need is curiosity and willingness to learn.",
    },
    {
      id: "2",
      question: "How do I access the course materials?",
      answer:
        "Once enrolled, you'll get lifetime access to all video lectures, code files, and resources. You can download resources and watch videos anytime.",
    },
    {
      id: "3",
      question: "Is there a certificate upon completion?",
      answer:
        "Yes! You'll receive a Certificate of Completion that you can share on LinkedIn and other professional platforms.",
    },
    {
      id: "4",
      question: "What if I don't like the course?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied, simply request a refund and we'll process it immediately.",
    },
  ];

  const reviews: CourseReview[] = [
    {
      id: "1",
      author: "Ahmed Hassan",
      rating: 5,
      text: "Excellent course! Very comprehensive and well-structured. The instructor explains everything clearly.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    },
    {
      id: "2",
      author: "Grace Okonkwo",
      rating: 5,
      text: "This course completely changed how I approach business automation. Highly recommended!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
    },
    {
      id: "3",
      author: "David Chen",
      rating: 4,
      text: "Great content and practical examples. Could use more real-world case studies.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
  ];

  const handleAddToCart = () => {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 py-4 border-b border-slate-200">
        <BreadcrumbUI
          items={[
            { label: "Home", href: "/" },
            { label: "Academy", href: "/academy/courses" },
            { label: course.title, href: "#" },
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-20 py-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Image */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden bg-slate-200">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
            />
            {isPurchased ?
              <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                <Play className="w-16 h-16 text-white fill-white" />
              </button>
            : <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="bg-slate-900/80 rounded-lg p-8 max-w-sm">
                    <p className="text-white text-lg font-semibold mb-2">
                      This course is locked
                    </p>
                    <p className="text-slate-300 text-sm">
                      Purchase the course to access the video content
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>

          {/* Course Title & Meta */}
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {course.title}
            </h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-slate-900">
                  {course.rating}
                </span>
                <span className="text-slate-600">
                  ({course.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-5 h-5" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-5 h-5" />
                <span>{course.duration}</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
              <Image
                src={course.instructor.avatar}
                alt={course.instructor.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-slate-900">
                  {course.instructor.name}
                </p>
                <p className="text-sm text-slate-600">
                  {course.instructor.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              About this course
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              {course.description}
            </p>
            <p className="text-slate-600 leading-relaxed">
              This comprehensive course covers everything you need to know about
              building scalable e-commerce systems using AppSheet and Google
              Apps Script. From basic concepts to advanced implementation,
              you'll gain hands-on experience with real-world projects.
            </p>
          </div>

          {/* What You'll Learn */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              What you'll learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Highlights */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Course highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((highlight, idx) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={idx}
                    className="flex gap-3"
                  >
                    <Icon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {highlight.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Curriculum */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
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
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
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
                      setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                    }
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
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
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
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
                      src={review.avatar}
                      alt={review.author}
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
                              i < review.rating ?
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
          <div className="sticky top-24 bg-white border border-slate-200 rounded-lg p-6">
            {!isPurchased ?
              <>
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">
                      ₦{course.price.toLocaleString()}
                    </span>
                    <span className="text-lg line-through text-slate-400">
                      ₦{course.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-600 font-semibold mt-2">
                    Save ₦
                    {(course.originalPrice - course.price).toLocaleString()}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                  >
                    {cartAdded ? "Added to cart ✓" : "Add to cart"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-3 border-slate-300"
                  >
                    Add to wishlist
                  </Button>
                </div>
              </>
            : <>
                {/* Purchased Badge */}
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="font-semibold text-emerald-900">
                      Course Purchased
                    </p>
                  </div>
                  <p className="text-sm text-emerald-700">
                    You have full access to this course
                  </p>
                </div>

                {/* Access Course Button */}
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 mb-3">
                  Continue Learning →
                </Button>

                {/* Progress */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Your Progress
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600">
                    {courseProgress}% complete
                  </p>
                </div>

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
                    className="w-full mb-3 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    Download Certificate
                  </Button>
                )}
              </>
            }

            {/* Course Info */}
            <div className="space-y-4 border-t border-slate-200 pt-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Language</p>
                <p className="font-semibold text-slate-900">
                  {course.language}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Level</p>
                <p className="font-semibold text-slate-900">{course.level}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Duration</p>
                <p className="font-semibold text-slate-900">
                  {course.duration}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Last updated</p>
                <p className="font-semibold text-slate-900">
                  {course.lastUpdated}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">Skills you'll gain</p>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
