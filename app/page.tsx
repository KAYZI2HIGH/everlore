import AboutSection from "@/components/about";
import { Feature } from "@/components/features";
import { Header } from "@/components/header";
import HeroSection from "@/components/hero-section";
import WhyEverloreSection from "@/components/why-everlore";
import Testimonial from "@/components/tesimonial-section";

export default function Home() {
  return (
    <main className="font-sans dark:bg-black relative h-screen w-full bg-[#F3F9EB]">
      <Header />
      <div className="overflow-x-hidden z-10">
        <HeroSection />
        <AboutSection />
        <WhyEverloreSection />
        <Feature />
        <Testimonial />
      </div>
    </main>
  );
}
