import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Everlore - Master the Art of Knowledge",
    template: "%s | Everlore",
  },
  description:
    "Unlock infinite learning with Everlore. Explore comprehensive courses, expert mentorship, and cutting-edge educational technology designed to transform your future.",
  keywords: [
    "online learning",
    "education platform",
    "courses",
    "skill development",
    "mentorship",
    "professional growth",
    "knowledge academy",
  ],
  authors: [
    {
      name: "Everlore Team",
      url: "https://everlore.vercel.app",
    },
  ],
  creator: "Everlore",
  publisher: "Everlore",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://everlore.com",
    siteName: "Everlore",
    title: "Everlore - Master the Art of Knowledge",
    description:
      "Unlock infinite learning with Everlore. Explore comprehensive courses, expert mentorship, and cutting-edge educational technology.",
    images: [
      {
        url: "https://everlore.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Everlore - Educational Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@everlore",
    creator: "@everlore",
    title: "Everlore - Master the Art of Knowledge",
    description:
      "Unlock infinite learning with Everlore. Explore comprehensive courses, expert mentorship, and cutting-edge educational technology.",
    images: ["https://everlore.com/twitter-image.png"],
  },
  alternates: {
    canonical: "https://everlore.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  category: "education",
  referrer: "strict-origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
