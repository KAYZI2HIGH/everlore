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
    <section className="py-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline">{badge}</Badge>
          <h1 className="max-w-2xl text-3xl font-semibold md:text-4xl">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-balance">
            {description}
          </p>
        </div>
        <Tabs
          defaultValue={tabs[0].value}
          className="mt-8"
        >
          <TabsList className="container flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
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
                        className="w-fit bg-background"
                      >
                        {tab.content.badge}
                      </Badge>
                      <h3 className="text-3xl font-medium lg:text-5xl">
                        {tab.content.title}
                      </h3>
                      <p className="text-muted-foreground lg:text-lg">
                        {tab.content.description}
                      </p>
                      {tab.content.list && (
                        <div>
                          <p>We focus on:</p>
                          <ul className="mt-2 divide-y border-y border-t-0 *:flex *:items-center *:gap-3 *:py-3">
                            {tab.content.list.map((li) => (
                              <li>
                                <p className="max-w-62.5 truncate">{li}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Button
                        className="mt-2.5 w-fit gap-2"
                        size="lg"
                      >
                        {tab.content.buttonText}
                      </Button>
                    </div>
                    <img
                      src={tab.content.imageSrc}
                      alt={tab.content.imageAlt}
                      className="rounded-xl"
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
