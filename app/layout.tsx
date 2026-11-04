import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { RootProviders } from "@/providers/root-providers";
import { site } from "@/lib/config";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const description =
  "Everlore Academy teaches practical digital skills — YouTube automation, forex, publishing, freelancing and online business — with structured courses, live classes and 1:1 mentorship.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Everlore — Learn skills that pay",
    template: "%s · Everlore",
  },
  description,
  keywords: [
    "online courses Nigeria",
    "digital skills",
    "YouTube automation course",
    "forex trading education",
    "freelancing",
    "Everlore Academy",
  ],
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: site.url,
    siteName: site.name,
    title: "Everlore — Learn skills that pay",
    description,
    images: [{ url: "/images/hero-learner.jpg", width: 1400, height: 933, alt: "Everlore Academy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Everlore — Learn skills that pay",
    description,
    images: ["/images/hero-learner.jpg"],
  },
  icons: { icon: "/favicon.ico" },
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#070d1f" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${jakarta.variable} ${instrument.variable} font-sans antialiased`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
