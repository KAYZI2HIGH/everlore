import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const AboutSection = () => {
  return (
    <div className="w-full relative p-10 py-26 bg-white flex max-sm:flex-col gap-10">
      <Image
        src={"/about-image-illustrator.png"}
        alt="about image"
        width={800}
        height={800}
        className="max-w-md"
      />
      <div className="max-w-xl space-y-4 flex flex-col justify-center">
        <h2 className="text-4xl font-semibold leading-snug max-sm:text-center text-balance">
          Built on Knowledge. Designed for Growth.
        </h2>
        <p className="max-sm:text-center">
          Everlore Digital Services Limited is a modern digital services company
          focused on education, innovation, and execution. We exist to bridge
          the gap between learning and real-world application, helping
          individuals and businesses grow through intelligent digital solutions
        </p>
        <Button className="max-sm:self-center">Explore Services</Button>
        <div className="flex gap-5 items-center justify-between mt-8">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl text-[#8DC63F] font-semibold">200+</h1>
            <p className="text-sm">Students Accepted</p>
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-4xl text-[#00AEEF] font-semibold">50+</h1>
            <p className="text-sm">Dreams Realized</p>
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-4xl text-[#F15A29] font-semibold">2M+</h1>
            <p className="text-sm">Revenue Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
