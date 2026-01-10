import { Info } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import SvgIcon from "./svg/svg-icon";

const HeroSection = () => {
  return (
    <div className="w-full relative p-5 md:p-10 py-20! bg-[linear-gradient(180deg,#F3F9EB_0%,#F3F9EB_80%,white_98%)]">
      <div className="max-w-6xl space-y-4 z-10 relative">
        {/* new release info */}
        <div className="flex gap-2 md:gap-3 items-center justify-center rounded-full pr-2 md:pr-4 text-xs md:text-sm border bg-white w-fit">
          <div className="p-1 px-2 text-[10px] md:text-[12px] text-white rounded-full bg-[#8DC63F] flex gap-1 items-center justify-center">
            <Info size={12} /> Update
          </div>{" "}
          Get 50% Discount on first purchases
        </div>

        <h1 className="text-3xl md:text-5xl text-balance tracking-wider leading-snug font-semibold">
          Empowering Growth Through Knowledge & Digital Innovation
        </h1>
        <p className="text-base md:text-lg text-balance tracking-wide">
          Everlore is a knowledge-driven digital platform designed to help you
          build practical skills, deploy real-world strategies, and create
          sustainable income in the digital economy.
        </p>
        <div className="flex flex-row gap-3 md:gap-5 items-center justify-center w-fit mt-8 md:mt-10">
          <Button>Read the Blog</Button>
          <Button variant={"outline"}>Get Started</Button>
        </div>
      </div>
      <SvgIcon className="absolute -top-50 -right-50 max-md:size-90" />
    </div>
  );
};

export default HeroSection;
