import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/home/hero";
import { TopicsMarquee } from "@/components/home/topics-marquee";
import { About } from "@/components/home/about";
import { Pathways } from "@/components/home/pathways";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { LearnYourWay } from "@/components/home/learn-your-way";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { CtaBand } from "@/components/home/cta-band";
import { Contact } from "@/components/home/contact";
import { fetchCourses } from "@/lib/content";

export const revalidate = 300;

export default async function Home() {
  const courses = await fetchCourses();
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TopicsMarquee />
        <About />
        <Pathways />
        <FeaturedCourses courses={courses} />
        <LearnYourWay />
        <Services />
        <Testimonials />
        <CtaBand />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
