import Image from "next/image";
import React from "react";

const WhyEverloreSection = () => {
  return (
    <div className="w-full relative p-10 py-26 bg-white space-y-5">
      <h2 className="text-4xl font-semibold leading-snug text-center text-balance">
        Why Choose Everlore?
      </h2>
      <p className="text-center max-w-lg mx-auto">
        At Everlore, we believe in the transformative power of knowledge and
        digital innovation. We Don’t Teach Courses, We Build Outcomes.
      </p>
      <div className="w-full grid grid-cols-4 gap-5 mt-12">
        <div className="p-5 border rounded-lg space-y-3 h-100 relative">
          <h3 className="text-xl font-semibold">Skill-to-Income Pathways™</h3>
          <p className="text-sm">
            Structured learning paths designed to move you from skill
            acquisition to monetization—step by step.
          </p>
          <Image
            src={"/ribbon-one.avif"}
            alt="ribbon"
            width={500}
            height={500}
            className="absolute bottom-0 right-0 "
          />
        </div>
        <div className="p-5 border rounded-lg space-y-3 h-100 relative">
          <h3 className="text-xl font-semibold">Everlore Digital Lab™</h3>
          <p className="text-sm">
            A members-only environment where strategies are tested, updated, and
            refined before they are taught.
          </p>{" "}
          <Image
            src={"/ribon-two.avif"}
            alt="ribbon"
            width={500}
            height={500}
            className="absolute bottom-0 right-0 "
          />
        </div>
        <div className="p-5 border rounded-lg space-y-3 h-100 relative">
          <h3 className="text-xl font-semibold">Outcome-Backed Learning™</h3>
          <p className="text-sm">
            Every course is built around a defined, measurable outcome, not just
            lessons.
          </p>
          <Image
            src={"/ribon-three.avif"}
            alt="ribbon"
            width={500}
            height={500}
            className="absolute bottom-0 right-0 "
          />
        </div>
        <div className="p-5 border rounded-lg space-y-3 h-100 relative">
          <h3 className="text-xl font-semibold">Everlore Growth Ledger™</h3>
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
  );
};

export default WhyEverloreSection;
