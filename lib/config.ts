export const site = {
  name: "Everlore",
  legalName: "Everlore Digital Services Limited",
  tagline: "Insight for the future",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.everloreltd.com",
  email: "info@everloreltd.com",
  currency: "NGN",
} as const;

/** Course price: 0 reads as "Free". */
export function formatPrice(amount: number, currency: string = site.currency) {
  if (!amount) return "Free";
  return formatMoney(amount, currency);
}

/** Plain money amount, e.g. revenue totals. */
export function formatMoney(amount: number, currency: string = site.currency) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** Academy categories, in menu order. Keep in sync with sanity/schemaTypes/course.ts. */
export const categories = [
  { value: "youtube", label: "YouTube Growth", blurb: "Grow and monetise a channel" },
  { value: "youtube-automation", label: "YouTube Automation", blurb: "Faceless channels and systems" },
  { value: "amazon-kdp", label: "Amazon KDP", blurb: "Self-publish books on Amazon" },
  { value: "book-publishing", label: "Book Publishing", blurb: "Aggregators and global stores" },
  { value: "affiliate-marketing", label: "Affiliate Marketing", blurb: "Earn commissions online" },
  { value: "dropshipping", label: "Dropshipping", blurb: "Sell without holding stock" },
  { value: "content-creation", label: "Content Creation", blurb: "Create content that pays" },
  { value: "freelancing", label: "Freelancing", blurb: "Sell your skills globally" },
  { value: "forex-trading", label: "Forex Trading", blurb: "Trading education and risk" },
] as const;

export const categoryLabels: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.value, c.label]),
);

export const categoryLabel = (value?: string) =>
  (value && categoryLabels[value]) ||
  (value ?? "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Shown when a course in Sanity has no thumbnail yet.
export const courseFallbackImage = (category?: string) =>
  category ? `/images/courses/${category}.jpg` : "/images/course-default.jpg";
