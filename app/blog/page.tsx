import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";
import { BLOG_CATEGORIES, blogCategoryLabel, getPosts } from "@/lib/blog";
import { FeaturedPost, PostCard } from "@/components/blog/post-card";
import { PageHero } from "@/components/blog/page-hero";

export const metadata: Metadata = {
  title: "Insights & Resources",
  description:
    "Guides, breakdowns and research on digital entrepreneurship, automation, trading and building online income — from the Everlore team.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 300;

type SearchParams = Promise<{ category?: string | string[] }>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { category: rawCategory } = await searchParams;
  const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;

  const posts = await getPosts();

  // Only show chips for categories that actually have posts (in schema order).
  const used = new Set(posts.map((p) => p.category).filter(Boolean));
  const chips = [
    ...Object.keys(BLOG_CATEGORIES).filter((c) => used.has(c)),
    ...[...used].filter((c): c is string => !!c && !(c in BLOG_CATEGORIES)),
  ];

  const active = category && used.has(category) ? category : undefined;
  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  const featured = active ? undefined : (posts.find((p) => p.featured) ?? posts[0]);
  const grid = featured ? filtered.filter((p) => p._id !== featured._id) : filtered;

  return (
    <>
      <PageHero
        eyebrow="Insights & Resources"
        title={
          <>
            Ideas for building <span className="text-gold">in the digital economy.</span>
          </>
        }
        description="Guides, breakdowns and research on automation, trading, freelancing and building online income — what's working right now."
      />

      <div className="container-page py-12 sm:py-16">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {featured && (
              <div className="mb-14">
                <FeaturedPost post={featured} />
              </div>
            )}

            {chips.length > 0 && (
              <nav aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
                <Chip href="/blog" active={!active}>
                  All
                </Chip>
                {chips.map((c) => (
                  <Chip key={c} href={`/blog?category=${encodeURIComponent(c)}`} active={active === c}>
                    {blogCategoryLabel(c)}
                  </Chip>
                ))}
              </nav>
            )}

            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                {active ? (
                  <>
                    <span className="text-gold-ink">{blogCategoryLabel(active)}</span> articles
                  </>
                ) : (
                  <>
                    Latest <span className="text-gold-ink">articles</span>
                  </>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "post" : "posts"}
              </p>
            </div>

            {grid.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
                That&apos;s everything for now — check back soon for more.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-secondary text-primary dark:text-brand">
        <BookOpenText className="size-7" />
      </span>
      <h2 className="mt-6 text-2xl font-extrabold">No articles yet</h2>
      <p className="mt-2 text-muted-foreground">
        We&apos;re writing our first pieces. Check back soon for insights and guides.
      </p>
      <Link
        href="/academy"
        className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Browse the Academy
      </Link>
    </div>
  );
}
