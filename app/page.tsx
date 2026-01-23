import AboutSection from "@/components/about";
import CallToAction from "@/components/call-to-action";
import { ContactSection } from "@/components/contact";
import { CTASection } from "@/components/cta-with-rectangle";
import { Feature } from "@/components/features";
import { Header } from "@/components/header";
import HeroSection from "@/components/hero-section";
import { MinimalFooter } from "@/components/minimal-footer";
import Testimonial from "@/components/tesimonial-section";
import WhyEverloreSection from "@/components/why-everlore";

export default function Home() {
  return (
    <main className="font-sans dark:bg-black relative w-full bg-[#031c5812]">
      <Header />
      <div className="overflow-x-hidden z-10">
        <HeroSection />
        <AboutSection />
        <WhyEverloreSection />
        <Feature />
        <Testimonial />
        <CTASection withGlow={true} />
        <ContactSection />
        <MinimalFooter />
      </div>
    </main>
  );
}
