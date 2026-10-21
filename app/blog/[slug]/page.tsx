"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBlogPostBySlug } from "@/lib/actions/sanity.actions";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { use } from "react";
import { contentQueryKeys } from "@/lib/query-keys";

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  content: any[];
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

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      const builder = imageUrlBuilder({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
      });
      const imageUrl = builder.image(value).width(800).quality(80).url();
      return (
        <img
          src={imageUrl}
          alt={value.alt || "Blog image"}
          className="w-full rounded-lg my-8 border border-border"
        />
      );
    },
    code: ({ value }: any) => (
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-6">
        <code className="text-sm font-mono">{value.code}</code>
      </pre>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 text-slate-900">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold mt-8 mb-4 text-slate-900">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold mt-6 mb-3 text-slate-900">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-bold mt-6 mb-3 text-slate-900">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-base text-slate-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 italic text-slate-700 bg-blue-50 rounded-r">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside space-y-2 mb-4 text-slate-700 ml-6">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside space-y-2 mb-4 text-slate-700 ml-6">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="ml-2">{children}</li>,
    number: ({ children }: any) => <li className="ml-2">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-slate-900">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-slate-800">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-red-600">
        {children}
      </code>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        className="text-blue-600 hover:underline hover:text-blue-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <BlogDetailContent slug={slug} />;
}

function BlogDetailContent({ slug }: { slug: string }) {
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: contentQueryKeys.blog.detail(slug),
    queryFn: () => getBlogPostBySlug(slug),
    staleTime: 10 * 60 * 1000,
  });

  // Debug logging
  console.log("Blog slug:", slug);
  console.log("Post data:", post);
  console.log("Error:", error);
  console.log("isLoading:", isLoading);

  const builder = imageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  });

  const getImageUrl = (image: any) => {
    if (!image) return "/academy.avif";
    if (typeof image === "string") return image;

    try {
      return builder.image(image).width(1200).quality(80).url();
    } catch (error) {
      return "/academy.avif";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Post not found</h2>
          <p className="text-muted-foreground mb-2">
            Slug: <code className="bg-slate-100 px-2 py-1 rounded">{slug}</code>
          </p>
          <p className="text-muted-foreground mb-6">
            No blog posts match this slug. Make sure you've created a blog post
            in Sanity with this exact slug.
          </p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 relative">
      <div className="container max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            asChild
          >
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Hero Image */}
        {post.image && (
          <div className="mb-8 md:mb-12 rounded-lg overflow-hidden border border-border h-80 md:h-96">
            <img
              src={getImageUrl(post.image)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="mb-4 flex flex-wrap gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            {post.tags?.map((tag: string) => (
              <span
                key={tag}
                className="flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8">{post.summary}</p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground border-b pb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{post.category}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-16">
          {post.content && post.content.length > 0 ?
            <div className="space-y-4 text-slate-700">
              <PortableText
                value={post.content}
                components={portableTextComponents}
              />
            </div>
          : <p className="text-muted-foreground">No content available</p>}
        </div>

        {/* Footer */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">
                Category
              </h3>
              <p className="text-lg font-medium">{post.category}</p>
            </div>
            <Button
              asChild
              variant="outline"
            >
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Posts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
