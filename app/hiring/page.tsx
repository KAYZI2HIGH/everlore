"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Briefcase, DollarSign, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getAllJobPostings } from "@/lib/actions/sanity.actions";

interface JobPosting {
  _id: string;
  title: string;
  slug: { current: string };
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  salary?: string;
  tags?: string[];
  postedAt: string;
}

export default function HiringPage() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => getAllJobPostings(),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "junior":
        return "bg-blue-100 text-blue-800";
      case "mid":
        return "bg-green-100 text-green-800";
      case "senior":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-slate-600">Loading job postings...</p>
          </div>
        </div>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <section className="py-18 px-4! relative">
        <div className="container flex flex-col items-center gap-10">
          <div className="text-center border-b pb-6">
            <h2 className="mx-auto mb-6 text-pretty text-3xl font-semibold md:text-4xl lg:max-w-3xl">
              Join Our Team
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
              We're building the future of digital education and
              entrepreneurship. Explore opportunities to grow with Everlore and
              make an impact.
            </p>
          </div>

          <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20 w-full">
            {jobs.length === 0 ?
              <div className="sm:col-span-12 flex flex-col items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-lg text-muted-foreground mb-4">
                    No job postings available
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check back soon for new opportunities
                  </p>
                </div>
              </div>
            : jobs.map((job: JobPosting) => (
                <Card
                  key={job._id}
                  className="order-last border-0 border-b bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
                >
                  <div className="flex flex-col gap-6">
                    {/* Job Header */}
                    <div>
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${getLevelColor(
                            job.level,
                          )}`}
                        >
                          {job.level}
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                          {job.type}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl mb-2">
                        {job.title}
                      </h3>

                      <p className="text-muted-foreground">{job.department}</p>
                    </div>

                    {/* Job Details */}
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{formatDate(job.postedAt)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-700 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-4 border-t">
                      <Button
                        className="w-full"
                        asChild
                      >
                        <a
                          href={`mailto:hiring@everlore.com?subject=Application: ${job.title}`}
                        >
                          <Mail className="mr-2 size-4" />
                          Apply via Email
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
