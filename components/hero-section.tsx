import { Info } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import SvgIcon from "./svg-icon";

const HeroSection = () => {
  return (
    <div className="w-full py-20 relative p-10 bg-[linear-gradient(180deg,#F3F9EB_0%,#F3F9EB_80%,white_98%)]">
      <div className="max-w-6xl space-y-4 z-100 relative">
        {/* new release info */}
        <div className="flex gap-3 items-center justify-center rounded-full pr-4 text-sm border bg-white w-fit">
          <div className="p-1 px-2 text-[12px] text-white rounded-full bg-[#8DC63F] flex gap-1 items-center justify-center">
            <Info size={15} /> Update
          </div>{" "}
          Applications for 2025-2026 term is now open!
        </div>

        <h1 className="text-5xl text-balance tracking-wider leading-snug font-semibold">
          Empowering Growth Through Knowledge & Digital Innovation
        </h1>
        <p className="text-lg text-balance tracking-wide">
          Everlore is a knowledge-driven digital platform designed to help you
          build practical skills, deploy real-world strategies, and create
          sustainable income in the digital economy.
        </p>
        <div className="flex gap-5 items-center justify-center w-fit mt-10">
          <Button>Read the Blog</Button>
          <Button variant={"outline"}>Get Started</Button>
        </div>
      </div>
      <SvgIcon className="absolute -top-50 -right-50 z-10" />
    </div>
  );
};

export default HeroSection;
