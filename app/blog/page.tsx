"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts } from "@/lib/actions/sanity.actions";
import imageUrlBuilder from "@sanity/image-url";

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  image?: {
    asset?: {
      url: string;
    };
  };
  author: string;
  category: string;
  tags?: string[];
  publishedAt: string;
  featured: boolean;
}

export default function BlogPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => getAllBlogPosts(),
  });

  const builder = imageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  });

  const getImageUrl = (image: any) => {
    if (!image) return "/academy.avif";
    if (typeof image === "string") return image;

    try {
      return builder.image(image).width(1000).quality(80).url();
    } catch (error) {
      return "/academy.avif";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-32 pt-18 relative">
      <div className="container flex flex-col items-center gap-10">
        <div className="text-center border-b pb-6">
          <h2 className="mx-auto mb-6 text-pretty text-3xl font-semibold md:text-4xl lg:max-w-3xl">
            Everlore Blogs
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            Discover the latest insights and tutorials about digital
            entrepreneurship, automation, trading, and building successful
            online businesses.
          </p>
        </div>

        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {posts.length === 0 ?
            <div className="sm:col-span-12 flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  No blog posts yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Check back soon for insights and updates
                </p>
              </div>
            </div>
          : <>
              {posts.map((post: BlogPost) => (
                <Card
                  key={post._id}
                  className="order-last border-0 border-b bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
                >
                  <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                    <div className="sm:col-span-5">
                      <div className="mb-4 md:mb-6">
                        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider text-muted-foreground md:gap-5 lg:gap-6">
                          {post.tags?.map((tag: string) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                        <a
                          href={`/blog/${post.slug.current}`}
                          className="hover:underline"
                        >
                          {post.title}
                        </a>
                      </h3>
                      <p className="mt-4 text-muted-foreground md:mt-5">
                        {post.summary}
                      </p>
                      <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                        <span className="text-muted-foreground">
                          {post.author}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <div className="mt-6 flex items-center space-x-2 md:mt-8">
                        <a
                          href={`/blog/${post.slug.current}`}
                          className="inline-flex items-center font-semibold hover:underline md:text-base"
                        >
                          <span>Read more</span>
                          <ArrowRight className="ml-2 size-4 transition-transform" />
                        </a>
                      </div>
                    </div>
                    <div className="order-first sm:order-last sm:col-span-5">
                      <a
                        href={`/blog/${post.slug.current}`}
                        className="block"
                      >
                        <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
                          <img
                            src={getImageUrl(post.image)}
                            alt={post.title}
                            className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70"
                          />
                        </div>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          }
        </div>
      </div>
    </section>
  );
}
