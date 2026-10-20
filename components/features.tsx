import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Briefcase, Pointer, Ratio, VideoIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Academy } from "./academy";
import Link from "next/link";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  list?: string[];
  buttonText?: string;
  buttonHref?: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode | TabContent;
}

interface FeatureProps {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature = ({
  badge = "OUR OFFERINGS",
  heading = "Everything You Need to Succeed",
  description = "From education and digital services to multimedia solutions and valuable insights, Everlore is your complete ecosystem for growth.",
  tabs = [
    {
      value: "tab-1",
      icon: <Briefcase className="h-auto w-4 shrink-0" />,
      label: "EVERLORE ACADEMY",
      content: <Academy />,
    },
    {
      value: "tab-4",
      icon: <Ratio className="h-auto w-4 shrink-0" />,
      label: "INSIGHTS & RESOURCES",
      content: {
        badge: "Insights & Resources",
        title: "Learn. Apply. Grow.",
        description: "Our blog delivers practical insights on:",
        list: [
          "Making money online",
          "Digital skills that pay",
          "Online business strategies",
          "Tools, systems, and growth frameworks",
        ],
        buttonText: "Read the Blog",
        buttonHref: "/blog",
        imageSrc: "/hero-slider-images/young-student-working-assignment.jpg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "DIGITAL SERVICES",
      content: {
        badge: "Digital Services",
        title: "Practical Skills. Real-World Application.",
        description:
          "Beyond learning, Everlore supports digital services and professional skill development through structured training and service-oriented learning.",
        list: [
          "Digital productivity",
          "Creative and technical skills",
          "Knowledge-based services",
        ],
        imageSrc: "/hero-slider-images/study-group-african-people.jpg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-3",
      icon: <VideoIcon className="h-auto w-4 shrink-0" />,
      label: "MULTIMEDIA & PUBLISHING",
      content: {
        badge: "Multimedia & Publising",
        title: "Professional Printing & Publishing Solutions",
        description:
          "Everlore Multimedia will provide reliable printing and publishing services for individuals and businesses-designed for quality, efficiency, and scale.",
        buttonText: "Learn More",
        buttonHref: "/multimedia",
        imageSrc: "/multimedia.png",
        imageAlt: "placeholder",
      },
    },
  ],
}: FeatureProps) => {
  return (
    <section className="bg-[#F3F9EB] px-4 py-16 md:py-24" id="features">
      <div className="mx-auto max-w-[75rem]">
        <Tabs
          defaultValue={tabs[0].value}
          className="mt-6 md:mt-8"
        >
          <TabsList className="mx-auto flex max-w-6xl items-center justify-start gap-1 overflow-x-auto border-b border-[#e5e0d8] px-1 md:grid md:grid-cols-4 md:gap-2 md:overflow-visible">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative flex min-h-11 shrink-0 items-center justify-center gap-2 border-b-2 border-transparent px-3 py-2 text-center text-xs font-medium text-[#777169] transition-colors hover:text-[#292621] data-[state=active]:border-[#292621] data-[state=active]:text-[#292621] md:px-4 md:text-sm"
              >
                {tab.icon}{" "}
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-6 max-w-screen-xl rounded-xl border border-[#e5e0d8] bg-[#faf9f6] p-4 md:mt-8 md:p-8 lg:p-12">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className={cn(
                  (
                    typeof tab.content === "object" &&
                      tab.content &&
                      "title" in tab?.content
                  ) ?
                    "grid place-items-center gap-20 lg:grid-cols-2 lg:gap-10"
                  : "",
                )}
              >
                {(
                  typeof tab.content === "object" &&
                  tab.content &&
                  "title" in tab?.content
                ) ?
                  <>
                    <div className="flex flex-col gap-5">
                      <Badge
                        variant="outline"
                        className="w-fit border-[#d8d1c7] bg-white text-xs font-medium text-[#6d675f] md:text-sm"
                      >
                        {tab.content.badge}
                      </Badge>
                      <h3 className="text-balance text-2xl font-medium md:text-3xl">
                        {tab.content.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#6d675f] md:text-base lg:text-lg">
                        {tab.content.description}
                      </p>
                      {tab.content.list && (
                        <div>
                          <p className="text-sm md:text-base">We focus on:</p>
                          <ul className="mt-3 divide-y border-y border-[#e5e0d8] *:flex *:items-center *:gap-3 *:py-2.5 md:*:py-3">
                            {tab.content.list.map((li) => (
                              <li key={li}>
                                <p className="max-w-62.5 truncate text-xs md:text-sm">
                                  {li}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {tab.content.buttonText && tab.content.buttonHref && (
                        <Button
                          className="mt-2.5 w-fit gap-2 text-xs md:text-sm"
                          size="lg"
                          asChild
                        >
                          <Link href={tab.content.buttonHref}>
                            {tab.content.buttonText}
                          </Link>
                        </Button>
                      )}
                    </div>
                    <img
                      src={tab.content.imageSrc}
                      alt={tab.content.imageAlt === "placeholder" ? tab.content.title : tab.content.imageAlt}
                      className="w-full max-w-sm rounded-lg md:max-w-none"
                    />
                  </>
                : tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature };
