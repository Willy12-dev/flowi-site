import type { Metadata } from "next";
import { Inter, Playfair_Display, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import LaunchBanner from "@/components/site/LaunchBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://useflowi.app"),
  title: {
    default: "Flowi — AI Intelligence · Daily brief, monthly atlas, deep-dive courses",
    template: "%s | Flowi",
  },
  description:
    "The signal layer for AI builders. Twenty AI sources distilled every morning into a usable map of what shipped, what matters, and which tools you actually need to evaluate this week.",
  keywords: [
    "AI tools",
    "AI agents",
    "LLM",
    "Claude",
    "ChatGPT",
    "Gemini",
    "AI courses",
    "AI engineering",
    "agentic AI",
    "production AI",
    "AI newsletter",
    "AI atlas",
    "vector database",
    "RAG",
    "MCP",
    "AI memory",
    "AI for developers",
    "Flowi",
    "Flowi AI",
  ],
  openGraph: {
    title: "Flowi — AI Intelligence",
    description:
      "Daily AI brief, monthly atlas of every tool worth knowing, opinionated deep-dive courses. The signal layer for AI builders.",
    type: "website",
    url: "https://useflowi.app",
    siteName: "Flowi",
    locale: "en_US",
    images: [
      {
        url: "/images/atlas_hero.png",
        width: 1500,
        height: 1000,
        alt: "Flowi — AI Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowi — AI Intelligence",
    description:
      "Daily AI brief, monthly atlas, deep-dive books for AI builders.",
    images: ["/images/atlas_hero.png"],
    creator: "@FlowiGroup",
  },
  alternates: {
    canonical: "https://useflowi.app",
  },
  icons: {
    icon: "/images/logo-icon.png",
    apple: "/images/logo-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    // Set GOOGLE_SITE_VERIFICATION env var on Vercel after creating the
    // property in Google Search Console (https://search.google.com/search-console).
    // Verification method: HTML tag → paste only the content="..." value into the env var.
    google: process.env.GOOGLE_SITE_VERIFICATION,
    // BING_SITE_VERIFICATION for Bing Webmaster Tools (optional but helps).
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Flowi",
  url: "https://useflowi.app",
  logo: "https://useflowi.app/images/LOGOOOO.png",
  description:
    "Flowi is an AI intelligence platform that publishes a daily AI brief, a monthly atlas of every AI tool worth knowing, and opinionated deep-dive courses on the patterns that ship in production.",
  sameAs: [
    "https://twitter.com/FlowiGroup",
    "https://www.tiktok.com/@flowigroup",
    "https://www.instagram.com/flowigroup",
    "https://flowi.gumroad.com",
  ],
  foundingDate: "2024",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Flowi",
  url: "https://useflowi.app",
  description:
    "The signal layer for AI builders — daily AI brief, monthly atlas, deep-dive courses.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://useflowi.app/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <LaunchBanner />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
