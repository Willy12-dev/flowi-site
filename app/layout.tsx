import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://useflowi.app"),
  title: {
    default: "Flowi — Premium Web Design, AI Chatbots & Video Production | Nairobi",
    template: "%s | Flowi",
  },
  description:
    "We build stunning websites, AI chatbots, mobile apps, and AI-powered marketing videos for ambitious brands. Based in Nairobi, serving the world.",
  keywords: [
    "web design Kenya",
    "website developer Nairobi",
    "app development Kenya",
    "AI chatbot Kenya",
    "AI video production",
    "WhatsApp automation Kenya",
    "M-Pesa integration",
    "web design agency Nairobi",
    "Flowi",
  ],
  openGraph: {
    title: "Flowi — Premium Web Design, AI Chatbots & Video Production",
    description:
      "We build stunning websites, AI chatbots, mobile apps, and AI-powered marketing videos for ambitious brands. Based in Nairobi.",
    type: "website",
    url: "https://useflowi.app",
    siteName: "Flowi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowi — Premium Web Design & AI Agency",
    description:
      "Websites, AI chatbots, video production, and M-Pesa integration. Built in days, not months.",
  },
  alternates: {
    canonical: "https://useflowi.app",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain">{children}</body>
    </html>
  );
}
