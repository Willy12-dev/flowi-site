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
  title: "Flowi — Premium Web Design & Development Agency",
  description:
    "We build stunning websites, AI chatbots, mobile apps, and AI-powered marketing videos for ambitious brands. Based in Nairobi, serving the world.",
  keywords: [
    "web design Kenya",
    "website developer Nairobi",
    "app development Kenya",
    "web design agency",
    "Flowi",
  ],
  openGraph: {
    title: "Flowi — Premium Web Design & Development Agency",
    description:
      "We build stunning websites, mobile apps, and business automation for ambitious brands.",
    type: "website",
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
