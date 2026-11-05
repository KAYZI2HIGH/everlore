import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { blogCategoryLabel, formatDate, type BlogPostSummary } from "@/lib/blog";

export function PostCover({
  src,
  priority,
  sizes,
  className,
}: {
  src: string | null;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary via-ink to-ink">
          <BookOpenText className="size-10 text-gold/80" />
        </div>
      )}
    </div>
  );
}

export function PostMeta({ post, className }: { post: BlogPostSummary; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground", className)}>
      <span className="font-semibold text-foreground">{post.author}</span>
      <span aria-hidden>·</span>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" /> {post.readingTime} min read
      </span>
    </div>
  );
}

export function PostCard({ post, priority }: { post: BlogPostSummary; priority?: boolean }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(11_42_111/0.35)]">
      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <PostCover
          src={post.image}
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[16/10]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
            {blogCategoryLabel(post.category)}
          </p>
        )}
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug group-hover:text-brand">
          <Link href={href} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <PostMeta post={post} />
          <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
        </div>
      </div>
    </article>
  );
}

export function FeaturedPost({ post }: { post: BlogPostSummary }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:shadow-[0_24px_60px_-24px_rgb(11_42_111/0.4)] lg:grid-cols-[1.25fr_1fr]">
      <PostCover
        src={post.image}
        priority
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="aspect-[16/10] lg:aspect-auto lg:min-h-[420px]"
      />
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-foreground">
            Featured
          </span>
          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">
              {blogCategoryLabel(post.category)}
            </span>
          )}
        </div>
        <h2 className="mt-5 text-3xl font-extrabold leading-tight group-hover:text-brand sm:text-4xl">
          <Link href={href} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 line-clamp-4 text-base leading-relaxed text-muted-foreground">{post.summary}</p>
        <PostMeta post={post} className="mt-6 text-sm" />
        <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Read article
          <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
