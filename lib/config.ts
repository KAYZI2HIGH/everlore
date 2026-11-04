export const site = {
  name: "Everlore",
  legalName: "Everlore Digital Services Limited",
  tagline: "Insight for the future",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.everloreltd.com",
  email: "hello@everloreltd.com",
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

export const categoryLabels: Record<string, string> = {
  "web-development": "Web Development",
  "mobile-development": "Mobile Development",
  "data-science": "Data Science",
  "ui-ux-design": "UI/UX Design",
  business: "Business",
  "youtube-automation-content-systems": "YouTube Automation",
  "forex-trading-education": "Forex Trading",
  "digital-services-freelancing-skills": "Freelancing Skills",
  "online-business-automation": "Online Business",
};

export const categoryLabel = (value?: string) =>
  (value && categoryLabels[value]) ||
  (value ?? "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Shown when a course in Sanity has no thumbnail yet.
const fallbackImages: Record<string, string> = {
  "web-development": "/images/course-web.jpg",
  "data-science": "/images/course-data.jpg",
  "ui-ux-design": "/images/course-design.jpg",
  business: "/images/course-business.jpg",
};
export const courseFallbackImage = (category?: string) =>
  (category && fallbackImages[category]) || "/images/course-default.jpg";
