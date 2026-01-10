import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  Briefcase,
  Layout,
  Pointer,
  Ratio,
  VideoIcon,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Academy } from "./academy";
import { cn } from "@/lib/utils";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  list?: string[];
  buttonText: string;
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
        imageSrc: "/resources.webp",
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
        buttonText: "See Tools",
        imageSrc: "/digital-service.png",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-3",
      icon: <VideoIcon className="h-auto w-4 shrink-0" />,
      label: "MULTIMEDIA & PUBLISHING (Coming Soon)",
      content: {
        badge: "Multimedia & Publising",
        title: "Professional Printing & Publishing Solutions",
        description:
          "Everlore Multimedia will provide reliable printing and publishing services for individuals and businesses-designed for quality, efficiency, and scale.",
        buttonText: "Learn More",
        imageSrc: "/multimedia.jpg",
        imageAlt: "placeholder",
      },
    },
  ],
}: FeatureProps) => {
  return (
    <section
      className="py-32 px-4 md:px-0"
      id="features"
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge
            variant="outline"
            className="text-xs md:text-sm"
          >
            {badge}
          </Badge>
          <h1 className="max-w-2xl text-2xl md:text-3xl lg:text-4xl font-semibold">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-balance text-sm md:text-base">
            {description}
          </p>
        </div>
        <Tabs
          defaultValue={tabs[0].value}
          className="mt-6 md:mt-8"
        >
          <TabsList className="container flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-10 sm:flex-row overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary whitespace-nowrap"
              >
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-6 md:mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-4 md:p-6 lg:p-16">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className={cn(
                  typeof tab.content === "object" &&
                    tab.content &&
                    "title" in tab?.content
                    ? "grid place-items-center gap-20 lg:grid-cols-2 lg:gap-10"
                    : ""
                )}
              >
                {typeof tab.content === "object" &&
                tab.content &&
                "title" in tab?.content ? (
                  <>
                    <div className="flex flex-col gap-5">
                      <Badge
                        variant="outline"
                        className="w-fit bg-background text-xs md:text-sm"
                      >
                        {tab.content.badge}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl lg:text-5xl font-medium">
                        {tab.content.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground lg:text-lg">
                        {tab.content.description}
                      </p>
                      {tab.content.list && (
                        <div>
                          <p className="text-sm md:text-base">We focus on:</p>
                          <ul className="mt-2 divide-y border-y border-t-0 *:flex *:items-center *:gap-3 *:py-2 md:*:py-3">
                            {tab.content.list.map((li) => (
                              <li>
                                <p className="max-w-62.5 truncate text-xs md:text-sm">
                                  {li}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Button
                        className="mt-2.5 w-fit gap-2 text-xs md:text-sm"
                        size="lg"
                      >
                        {tab.content.buttonText}
                      </Button>
                    </div>
                    <img
                      src={tab.content.imageSrc}
                      alt={tab.content.imageAlt}
                      className="rounded-xl w-full max-w-sm md:max-w-none"
                    />
                  </>
                ) : (
                  tab.content
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature };
