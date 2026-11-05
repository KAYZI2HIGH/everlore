import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { site } from "@/lib/config";
import { blogCategoryLabel, formatDate, getPostBySlug, getPosts, getRelatedPosts } from "@/lib/blog";
import { PortableBody } from "@/components/blog/portable-body";
import { PostCard, PostCover } from "@/components/blog/post-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const url = `${site.url.replace(/\/$/, "")}/blog/${post.slug}`;

  return (
    <article>
      <header className="container-page pt-10 sm:pt-14">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/blog">Insights</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {post.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>
                      {blogCategoryLabel(post.category)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbPage className="line-clamp-1 max-w-[28ch]">{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mx-auto mt-10 max-w-3xl text-center">
          {post.category && (
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink hover:underline"
            >
              {blogCategoryLabel(post.category)}
            </Link>
          )}
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-5xl">{post.title}</h1>
          {post.summary && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{post.summary}</p>}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 font-semibold text-foreground">
              <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold text-primary dark:text-brand">
                {post.author.charAt(0).toUpperCase()}
              </span>
              {post.author}
            </span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" /> {post.readingTime} min read
            </span>
          </div>
        </div>

        <PostCover
          src={post.image}
          priority
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="mt-10 aspect-[16/9] rounded-3xl border border-border sm:mt-12"
        />
      </header>

      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-[68ch]">
          {post.content.length > 0 ? (
            <PortableBody value={post.content} />
          ) : (
            <p className="text-muted-foreground">This article has no content yet.</p>
          )}

          <footer className="mt-14 space-y-8 border-t border-border pt-8">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-sm font-semibold text-muted-foreground">Tags</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-semibold">Share this article</p>
              <ShareButtons url={url} title={post.title} />
            </div>
          </footer>

          <aside className="relative mt-14 overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-10">
            <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-brand/40 blur-3xl" />
            <div className="relative">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-gold">
                <GraduationCap className="size-6" />
              </span>
              <h2 className="mt-6 text-2xl font-extrabold leading-tight sm:text-3xl">
                Ready to put this <span className="text-gold">into practice?</span>
              </h2>
              <p className="mt-3 max-w-lg text-white/70">
                Everlore Academy courses turn ideas like these into step-by-step skills you can earn from.
              </p>
              <Link
                href="/academy"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground transition hover:opacity-90"
              >
                Explore the Academy <ArrowRight className="size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-muted/40 py-16">
          <div className="container-page">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">Keep reading</p>
            <h2 className="mt-3 text-3xl font-extrabold">
              More on <span className="text-gold-ink">{blogCategoryLabel(post.category)}</span>
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
