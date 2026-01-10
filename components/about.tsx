import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const AboutSection = () => {
  return (
    <div
      id="about"
      className="w-full relative p-5 md:p-10 py-26! bg-white flex flex-col md:flex-row gap-5 md:gap-10"
    >
      <Image
        src={"/about-image-illustrator.png"}
        alt="about image"
        width={800}
        height={800}
        className="w-full max-w-md"
      />
      <div className="w-full max-w-xl space-y-4 flex flex-col justify-center">
        <h2 className="text-2xl md:text-4xl font-semibold leading-snug text-center md:text-left text-balance">
          Built on Knowledge. Designed for Growth.
        </h2>
        <p className="text-sm md:text-base text-center md:text-left">
          Everlore Digital Services Limited is a modern digital services company
          focused on education, innovation, and execution. We exist to bridge
          the gap between learning and real-world application, helping
          individuals and businesses grow through intelligent digital solutions
        </p>
        <Button className="self-center md:self-start">Explore Services</Button>
        <div className="grid grid-cols-6 gap-3 md:gap-5 items-center md:items-start justify-between mt-8">
          <div className="space-y-2 text-center col-span-3">
            <h1 className="text-4xl text-[#8DC63F] font-semibold">200+</h1>
            <p className="text-sm">Students Accepted</p>
          </div>
          <div className="space-y-2 text-center col-span-3">
            <h1 className="text-4xl text-[#00AEEF] font-semibold">50+</h1>
            <p className="text-sm">Dreams Realized</p>
          </div>
          <div className="space-y-2 text-center col-start-3 col-end-5">
            <h1 className="text-4xl text-[#F15A29] font-semibold">2M+</h1>
            <p className="text-sm">Revenue Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
