import Image from "next/image";
import React from "react";

const WhyEverloreSection = () => {
  return (
    <section className="relative w-full bg-white px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[75rem]">
      <h2 className="text-balance text-center text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-tight">
        Why Choose Everlore?
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed md:text-base">
        At Everlore, we believe in the transformative power of knowledge and
        digital innovation. We Don&apos;t Teach Courses, We Build Outcomes.
      </p>
      <div className="mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative h-[25rem] overflow-hidden rounded-xl border p-5">
          <h3 className="text-lg font-semibold">Skill-to-Income Pathways™</h3>
          <p className="text-sm">
            Structured learning paths designed to move you from skill
            acquisition to monetization—step by step.
          </p>
          <Image
            src={"/ribbon-one.avif"}
            alt="ribbon"
            width={500}
            height={500}
            className="absolute bottom-0 max-md:-bottom-7 right-0 max-md:size-100"
          />
        </div>
        <div className="relative h-[25rem] overflow-hidden rounded-xl border p-5">
          <h3 className="text-lg font-semibold">Everlore Digital Lab™</h3>
          <p className="text-sm">
            A members-only environment where strategies are tested, updated, and
            refined before they are taught.
          </p>{" "}
          <Image
            src={"/ribon-two.avif"}
            alt="ribbon"
            width={500}
            height={500}
            className="absolute bottom-0 max-md:-bottom-20 right-0 max-md:size-120"
          />
        </div>
        <div className="relative h-[25rem] overflow-hidden rounded-xl border p-5">
          <h3 className="text-lg font-semibold">Outcome-Backed Learning™</h3>
          <p className="text-sm">
            Every course is built around a defined, measurable outcome, not just
            lessons.
          </p>
          <Image
            src={"/ribon-three.avif"}
            alt="ribbon"
            width={500}
            height={500}
            className="absolute bottom-0 right-0 max-md:-bottom-7 max-md:w-full max-md:h-80"
          />
        </div>
        <div className="relative h-[25rem] overflow-hidden rounded-xl border p-5">
          <h3 className="text-lg font-semibold">Everlore Growth Ledger™</h3>
          <p className="text-sm">
            Your personal progress vault that tracks skills learned, paths
            completed, and growth milestones.
          </p>
          <Image
            src={"/ribon-four.avif"}
            alt="ribbon"
            width={500}
            height={500}
            className="absolute bottom-0 right-0 "
          />
        </div>
      </div>
      </div>
    </section>
  );
};

export default WhyEverloreSection;
