import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const AboutSection = () => {
  return (
    <div
      id="about"
      className="relative w-full bg-white px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto flex max-w-[75rem] flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <Image
          src={"/about-image-illustrator.png"}
          alt="Illustration representing Everlore's digital services"
          width={800}
          height={800}
          className="w-full max-w-md"
        />
        <div className="w-full max-w-xl space-y-5">
          <h2 className="text-balance text-center text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-tight md:text-left">
            Built on Knowledge. Designed for Growth.
          </h2>
          <p className="text-center text-sm leading-relaxed md:text-left md:text-base">
            Everlore Digital Services Limited is a modern digital services company
            focused on education, innovation, and execution. We exist to bridge
            the gap between learning and real-world application, helping
            individuals and businesses grow through intelligent digital solutions
          </p>
          <Button className="self-center md:self-start" asChild>
            <Link href="#features">Explore Services</Link>
          </Button>
          <div className="grid grid-cols-3 gap-4 pt-4 md:gap-6">
            <div className="space-y-2 text-center">
              <p className="text-3xl font-semibold text-[#5E8B20] md:text-4xl">200+</p>
              <p className="text-xs md:text-sm">Students Accepted</p>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-3xl font-semibold text-[#08799A] md:text-4xl">50+</p>
              <p className="text-xs md:text-sm">Dreams Realized</p>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-3xl font-semibold text-[#B8431D] md:text-4xl">2M+</p>
              <p className="text-xs md:text-sm">Revenue Generated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
