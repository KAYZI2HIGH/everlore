// Replaces the sample courses in Sanity with Everlore's money-making catalogue.
// Re-runnable: documents are written with createOrReplace on fixed ids, so
// existing enrollments (which store the Sanity _id) keep pointing at a course.
// Prices are starting points in NGN — adjust them in Studio.
// Usage: npx tsx scripts/seed-academy-courses.ts
import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

type Module = { title: string; lessons: number; duration: string };
type Seed = {
  _id: string;
  replacesDraft?: boolean;
  title: string;
  slug: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: number;
  description: string;
  learningPoints: string[];
  highlights: string[];
  modules: Module[];
  faqs: { question: string; answer: string }[];
};

const commonFaqs = [
  {
    question: "How long do I have access?",
    answer: "Lifetime access. Watch at your own pace on phone, tablet or laptop, and get every future update to the course.",
  },
  {
    question: "Will this course guarantee that I make money?",
    answer:
      "No course can guarantee income. You'll get a proven process, templates and support — results depend on your effort, consistency and market conditions.",
  },
];

const COURSES: Seed[] = [
  {
    _id: "64eb62fa-87eb-4ba5-8832-846b94d19646",
    title: "YouTube Automation Mastery: Build Faceless Channels That Earn",
    slug: "youtube-automation-mastery",
    category: "youtube-automation",
    level: "beginner",
    price: 45000,
    duration: 14,
    description:
      "Learn to build and run faceless YouTube channels with a repeatable system — from picking a profitable niche to outsourcing scripts, voice-overs and edits, and getting monetised.",
    learningPoints: [
      "Find profitable, low-competition niches using real data",
      "Script, voice and edit videos without showing your face",
      "Build a team of freelancers and simple SOPs to run the channel",
      "Design thumbnails and titles that earn clicks",
      "Reach the YouTube Partner Program requirements and monetise",
      "Track analytics and scale to multiple channels",
    ],
    highlights: ["Niche research templates", "Freelancer hiring SOPs", "Thumbnail swipe file", "Monthly live Q&A"],
    modules: [
      { title: "How YouTube automation really works", lessons: 5, duration: "1h 10m" },
      { title: "Niche research and channel strategy", lessons: 7, duration: "2h 15m" },
      { title: "Scripts, voice-overs and AI tools", lessons: 8, duration: "2h 40m" },
      { title: "Editing workflow and thumbnails", lessons: 7, duration: "2h 30m" },
      { title: "Hiring and managing your team", lessons: 6, duration: "1h 50m" },
      { title: "Monetisation, analytics and scaling", lessons: 8, duration: "3h 35m" },
    ],
    faqs: [
      { question: "Do I need to show my face?", answer: "No. The whole course is built around faceless channels." },
      ...commonFaqs,
    ],
  },
  {
    _id: "9e86afd8-9d98-41d4-9282-cb3751075816",
    title: "YouTube Growth & Monetisation: From 0 to Partner Program",
    slug: "youtube-growth-and-monetisation",
    category: "youtube",
    level: "beginner",
    price: 35000,
    duration: 10,
    description:
      "Start, grow and monetise your own YouTube channel. Plan content people search for, film on a budget, and turn views into AdSense, sponsorships and product income.",
    learningPoints: [
      "Set up and brand a channel the right way",
      "Plan videos around what your audience is searching for",
      "Film and edit good-looking videos with just a phone",
      "Understand the algorithm: CTR, retention and session time",
      "Qualify for monetisation and land your first sponsors",
    ],
    highlights: ["Content calendar template", "Phone filming kit list", "Sponsorship pitch template", "Channel audit checklist"],
    modules: [
      { title: "Channel foundations and branding", lessons: 5, duration: "1h 05m" },
      { title: "Content strategy and video ideas", lessons: 6, duration: "1h 45m" },
      { title: "Filming and editing on a budget", lessons: 7, duration: "2h 20m" },
      { title: "Titles, thumbnails and the algorithm", lessons: 6, duration: "1h 50m" },
      { title: "Monetisation: AdSense, sponsors and products", lessons: 7, duration: "3h 00m" },
    ],
    faqs: commonFaqs,
  },
  {
    _id: "2f06abca-9d1d-4dfc-9267-10c8c31a6911",
    replacesDraft: true,
    title: "Amazon KDP Profits: Publish Books That Sell on Amazon",
    slug: "amazon-kdp-profits",
    category: "amazon-kdp",
    level: "beginner",
    price: 40000,
    duration: 12,
    description:
      "Use Amazon Kindle Direct Publishing to sell eBooks, paperbacks and low-content books worldwide. Research what sells, create and format your book, and launch it with Amazon ads.",
    learningPoints: [
      "Set up a KDP account and tax information from Nigeria",
      "Research profitable niches and keywords with free tools",
      "Create low-content and no-content books (journals, planners, logbooks)",
      "Format interiors and design covers that convert",
      "Write listings that rank in Amazon search",
      "Launch and optimise Amazon ads profitably",
    ],
    highlights: ["KDP account setup walkthrough", "Interior and cover templates", "Keyword research worksheet", "Ads launch checklist"],
    modules: [
      { title: "KDP fundamentals and account setup", lessons: 5, duration: "1h 15m" },
      { title: "Niche and keyword research", lessons: 7, duration: "2h 10m" },
      { title: "Creating low-content books", lessons: 6, duration: "2h 00m" },
      { title: "Covers, formatting and uploading", lessons: 7, duration: "2h 25m" },
      { title: "Listings that rank", lessons: 4, duration: "1h 20m" },
      { title: "Amazon ads and scaling a catalogue", lessons: 7, duration: "2h 50m" },
    ],
    faqs: [
      {
        question: "Can I use KDP from Nigeria?",
        answer: "Yes. We show you how to set up your account, tax interview and payouts from Nigeria step by step.",
      },
      ...commonFaqs,
    ],
  },
  {
    _id: "72a14361-ec62-4300-8b67-d8eda1264d83",
    replacesDraft: true,
    title: "Book Publishing Blueprint: From Manuscript to Global Stores",
    slug: "book-publishing-blueprint",
    category: "book-publishing",
    level: "beginner",
    price: 30000,
    duration: 9,
    description:
      "Turn your manuscript into a professionally published book on Amazon, Apple Books, Google Play, Kobo and more through aggregator platforms — and market it to readers.",
    learningPoints: [
      "Edit and prepare a manuscript for publication",
      "Choose between KDP, aggregators (Draft2Digital and others) or both",
      "Get ISBNs, covers and formatting right",
      "Publish eBook, paperback and audiobook editions",
      "Price, promote and build an author platform",
    ],
    highlights: ["Publishing checklist", "Aggregator comparison guide", "Launch plan template", "Author website starter"],
    modules: [
      { title: "Preparing your manuscript", lessons: 5, duration: "1h 20m" },
      { title: "Choosing where and how to publish", lessons: 4, duration: "1h 05m" },
      { title: "ISBNs, covers and formatting", lessons: 6, duration: "1h 55m" },
      { title: "Publishing on aggregator platforms", lessons: 6, duration: "2h 00m" },
      { title: "Book marketing and your author brand", lessons: 7, duration: "2h 40m" },
    ],
    faqs: commonFaqs,
  },
  {
    _id: "9209afb8-463a-4f0a-b27a-a70181683ce0",
    replacesDraft: true,
    title: "Affiliate Marketing Accelerator: Earn Commissions Online",
    slug: "affiliate-marketing-accelerator",
    category: "affiliate-marketing",
    level: "beginner",
    price: 25000,
    duration: 8,
    description:
      "Learn how to promote other people's products and earn commissions — choosing the right programmes, building content that converts, and driving traffic from social media and search.",
    learningPoints: [
      "Pick affiliate programmes and offers that pay well and are available in Nigeria",
      "Build a simple website or link-in-bio funnel",
      "Create reviews, comparisons and short-form content that converts",
      "Drive free traffic from TikTok, Instagram, YouTube and Google",
      "Track clicks and commissions and do more of what works",
    ],
    highlights: ["Programme shortlist", "Content templates", "Disclosure guide", "Tracking spreadsheet"],
    modules: [
      { title: "Affiliate marketing basics", lessons: 4, duration: "55m" },
      { title: "Choosing programmes and offers", lessons: 5, duration: "1h 25m" },
      { title: "Building your platform", lessons: 6, duration: "1h 50m" },
      { title: "Content that converts", lessons: 6, duration: "2h 00m" },
      { title: "Traffic, tracking and scaling", lessons: 6, duration: "1h 50m" },
    ],
    faqs: commonFaqs,
  },
  {
    _id: "b677d295-bd03-4b22-ae67-16af338e8532",
    replacesDraft: true,
    title: "Dropshipping Launchpad: Start an Online Store Without Stock",
    slug: "dropshipping-launchpad",
    category: "dropshipping",
    level: "beginner",
    price: 35000,
    duration: 10,
    description:
      "Launch an e-commerce store that sells products you never have to stock. Find winning products, set up your store, work with suppliers and run your first ads.",
    learningPoints: [
      "Understand local and international dropshipping models",
      "Find and validate winning products",
      "Build a store with Shopify or a local alternative",
      "Work with reliable suppliers and handle delivery",
      "Run profitable Meta and TikTok ads",
      "Handle customer service, refunds and payments",
    ],
    highlights: ["Product research checklist", "Supplier vetting guide", "Store launch template", "Ad creative examples"],
    modules: [
      { title: "How dropshipping works", lessons: 4, duration: "1h 00m" },
      { title: "Product research and validation", lessons: 6, duration: "1h 55m" },
      { title: "Building your store", lessons: 7, duration: "2h 10m" },
      { title: "Suppliers, fulfilment and payments", lessons: 5, duration: "1h 40m" },
      { title: "Ads and scaling", lessons: 7, duration: "3h 15m" },
    ],
    faqs: commonFaqs,
  },
  {
    _id: "course-content-creation-income",
    title: "Content Creation for Income: Create, Grow and Get Paid",
    slug: "content-creation-for-income",
    category: "content-creation",
    level: "beginner",
    price: 20000,
    duration: 7,
    description:
      "Become a creator brands want to pay. Plan content, film and edit on your phone, grow on TikTok and Instagram, and turn your audience into brand deals and digital products.",
    learningPoints: [
      "Find your niche and content pillars",
      "Shoot and edit short-form video on your phone",
      "Write hooks that stop the scroll",
      "Grow on TikTok, Instagram Reels and YouTube Shorts",
      "Pitch brands and price your content",
    ],
    highlights: ["Hook library", "Content calendar", "Media kit template", "Brand pitch emails"],
    modules: [
      { title: "Your creator strategy", lessons: 4, duration: "1h 00m" },
      { title: "Filming and editing on a phone", lessons: 6, duration: "1h 45m" },
      { title: "Hooks, stories and growth", lessons: 6, duration: "1h 40m" },
      { title: "Monetising: brand deals and products", lessons: 6, duration: "2h 35m" },
    ],
    faqs: commonFaqs,
  },
  {
    _id: "course-freelancing-online",
    title: "Freelancing Online: Sell Your Skills to Global Clients",
    slug: "freelancing-online",
    category: "freelancing",
    level: "beginner",
    price: 20000,
    duration: 8,
    description:
      "Package a skill you already have — writing, design, video editing, virtual assistance — and win clients on Upwork, Fiverr and LinkedIn. Get paid in dollars and build repeat business.",
    learningPoints: [
      "Choose an in-demand service and package it",
      "Build a portfolio and profile that wins jobs",
      "Write proposals that get replies",
      "Price your work and negotiate",
      "Receive international payments safely from Nigeria",
    ],
    highlights: ["Profile templates", "Proposal swipe file", "Pricing calculator", "Client contract template"],
    modules: [
      { title: "Choosing and packaging your service", lessons: 5, duration: "1h 15m" },
      { title: "Portfolio and profiles", lessons: 5, duration: "1h 30m" },
      { title: "Finding and winning clients", lessons: 6, duration: "2h 05m" },
      { title: "Pricing, payments and contracts", lessons: 5, duration: "1h 35m" },
      { title: "Repeat clients and growth", lessons: 4, duration: "1h 35m" },
    ],
    faqs: commonFaqs,
  },
  {
    _id: "course-forex-trading-foundations",
    title: "Forex Trading Foundations: Learn to Trade With Discipline",
    slug: "forex-trading-foundations",
    category: "forex-trading",
    level: "beginner",
    price: 50000,
    duration: 12,
    description:
      "A structured, risk-first introduction to forex trading: how the market works, technical analysis, building a trading plan and practising on a demo account before risking real money.",
    learningPoints: [
      "Understand currency pairs, pips, lots and leverage",
      "Read charts with support, resistance and trend structure",
      "Build and backtest a simple trading plan",
      "Manage risk on every trade",
      "Choose a regulated broker and practise on demo",
    ],
    highlights: ["Trading plan template", "Risk calculator", "Trading journal", "Weekly market review"],
    modules: [
      { title: "How the forex market works", lessons: 5, duration: "1h 20m" },
      { title: "Technical analysis essentials", lessons: 8, duration: "3h 00m" },
      { title: "Building a trading plan", lessons: 6, duration: "2h 10m" },
      { title: "Risk management and psychology", lessons: 6, duration: "2h 20m" },
      { title: "Brokers, demo trading and review", lessons: 6, duration: "3h 10m" },
    ],
    faqs: [
      {
        question: "Is forex trading risky?",
        answer:
          "Yes. Trading leveraged products carries a high risk of losing money, and most retail traders lose. This course is education, not financial advice — never trade money you can't afford to lose.",
      },
      commonFaqs[0],
    ],
  },
];

const key = (s: string, i: number) => `${s.replace(/[^a-z0-9]/gi, "").slice(0, 8)}${i}`;

async function main() {
  const tx = client.transaction();
  for (const c of COURSES) {
    const file = `public/images/courses/${c.category}.jpg`;
    const asset = await client.assets.upload("image", fs.createReadStream(file), {
      filename: `${c.slug}.jpg`,
    });
    const now = new Date().toISOString();
    const doc = {
      _type: "course",
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      description: c.description,
      image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
      price: c.price,
      instructor: "Everlore Academy",
      category: c.category,
      level: c.level,
      duration: c.duration,
      students: 0,
      learningPoints: c.learningPoints,
      highlights: c.highlights.map((title, i) => ({ _key: key("h" + title, i), title })),
      modules: c.modules.map((m, i) => ({ _key: key("m" + m.title, i), ...m })),
      faqs: c.faqs.map((f, i) => ({ _key: key("f" + f.question, i), ...f })),
      reviews: [],
      createdAt: now,
      updatedAt: now,
    };
    tx.createOrReplace({ _id: c._id, ...doc });
    // Old drafts are still referenced by legacy Sanity user docs, so they can't be
    // deleted; overwrite them with the same content so Studio shows no stale edits.
    if (c.replacesDraft) tx.createOrReplace({ _id: `drafts.${c._id}`, ...doc });
    console.log("prepared", c.title);
  }
  const res = await tx.commit();
  console.log(`Committed ${res.results.length} mutations.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
