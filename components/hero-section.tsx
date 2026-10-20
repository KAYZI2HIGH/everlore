"use client";

import { Info } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import SvgIcon from "./svg/svg-icon";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const sliderImages = [
    {
      src: "/hero-slider-images/colleagues-doing-team-work-project.jpg",
      title: "Collaborative Learning",
      subtitle: "Learn together, grow together",
    },
    {
      src: "/hero-slider-images/sleepy-young-girl-sleeping-dealing-with-burnout-while-she-studies.jpg",
      title: "Study Smart",
      subtitle: "Avoid burnout with effective strategies",
    },
    {
      src: "/hero-slider-images/study-group-african-people.jpg",
      title: "Global Community",
      subtitle: "Connect with learners worldwide",
    },
    {
      src: "/hero-slider-images/young-colleagues-studying-from-notebook-laptop-study-session.jpg",
      title: "Digital Learning",
      subtitle: "Master skills for the modern world",
    },
    {
      src: "/hero-slider-images/young-student-learning-library.jpg",
      title: "Knowledge Base",
      subtitle: "Expand your horizons",
    },
    {
      src: "/hero-slider-images/young-student-working-assignment.jpg",
      title: "Practical Application",
      subtitle: "Apply what you learn immediately",
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, sliderImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? sliderImages.length - 1 : prev - 1,
    );
    setAutoPlay(false);
  };

  return (
    <div className="w-full relative overflow-hidden bg-[linear-gradient(180deg,#F3F9EB_0%,#F3F9EB_80%,white_98%)] px-2">
      {/* Image Slider */}
      <div className="relative w-full h-100 md:h-[calc(100vh-7rem)] overflow-hidden rounded-lg md:rounded-xl">
        {/* Slides */}
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src}
              alt={image.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 md:p-10 text-center">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
                {image.title}
              </h2>
              <p className="text-sm md:text-lg text-gray-100">
                {image.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full transition-all duration-300"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide ?
                  "bg-white w-8 h-2.5 md:w-10 md:h-3"
                : "bg-white/40 w-2.5 h-2.5 md:w-3 md:h-3 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 md:p-10 py-12 md:py-20">
        <div className="max-w-6xl space-y-4 z-10 relative mx-auto">
          {/* new release info */}
          <div className="flex gap-2 md:gap-3 items-center justify-center rounded-full pr-2 md:pr-4 text-xs md:text-sm border bg-white w-fit mx-auto">
            <div className="p-1 px-2 text-[10px] md:text-[12px] text-white rounded-full bg-[#8DC63F] flex gap-1 items-center justify-center">
              <Info size={12} /> Update
            </div>{" "}
            Get 50% Discount on first purchases
          </div>

          <h1 className="text-3xl md:text-5xl text-balance tracking-wider leading-snug font-semibold text-center">
            Empowering Growth Through Knowledge & Digital Innovation
          </h1>
          <p className="text-base md:text-lg text-balance tracking-wide text-center">
            Everlore is a knowledge-driven digital platform designed to help you
            build practical skills, deploy real-world strategies, and create
            sustainable income in the digital economy.
          </p>
          <div className="flex flex-row gap-3 md:gap-5 items-center justify-center w-fit mt-8 md:mt-10 mx-auto">
            <Button asChild>
              <Link href="/blog">Read the Blog</Link>
            </Button>
            <Button
              variant={"outline"}
              asChild
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
